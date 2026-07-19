// ============================================================
// user-app.js – Painel do usuário (Netflix-style)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.warn('User app iniciado.');

    const MULTA_POR_DIA = 1.00;

    // ===== VERIFICA LOGIN =====
    if (sessionStorage.getItem('perfil') !== 'usuario') {
        window.location.href = 'index.html';
        return;
    }

    // ===== DOM ELEMENTOS =====
    const contentUser = document.getElementById('content-user');
    const sectionTitle = document.getElementById('section-title-user');
    const userNome = document.getElementById('user-nome');
    const userApelido = document.getElementById('user-apelido');
    const userAvatar = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-user');

    const usuarioId = parseInt(sessionStorage.getItem('usuarioId'));
    let usuarioAtual = null;

    async function carregarUsuario() {
        try {
            await aguardarBanco();
            usuarioAtual = await db.clientes.get(usuarioId);
            if (!usuarioAtual) {
                alert('Usuário não encontrado.');
                logout();
                return;
            }
            userNome.textContent = usuarioAtual.nome.split(' ')[0] || usuarioAtual.nome;
            userApelido.textContent = usuarioAtual.apelido || '';
            userAvatar.src = usuarioAtual.foto || 'static/src/avatares/usuario.jpg';
            console.warn('Usuário carregado:', usuarioAtual.nome);
        } catch (err) {
            console.error('Erro ao carregar usuário:', err);
            notificar('Erro ao carregar dados do usuário.', 'erro');
        }
    }

    // ================================================================
    // PÁGINA INICIAL
    // ================================================================
    async function renderInicio() {
        try {
            await aguardarBanco();
            console.warn('Renderizando página inicial...');

            async function renderizarAba(tipo) {
                const gradeContainer = document.getElementById('grade-destaques');
                if (!gradeContainer) return;
                let html = '';

                if (tipo === 'top_usuarios') {
                    const clientes = await db.clientes.toArray();
                    const topUsuarios = clientes
                        .filter(c => c.livros_lidos > 0)
                        .sort((a, b) => (b.livros_lidos || 0) - (a.livros_lidos || 0))
                        .slice(0, 5);

                    if (topUsuarios.length === 0) {
                        html = `<p style="color: var(--text-secondary);">Nenhum usuário com livros lidos ainda.</p>`;
                    } else {
                        html = `<div class="grade-livros">`;
                        topUsuarios.forEach((u, index) => {
                            const posicao = index + 1;
                            let corFundo = '', corTexto = '#000';
                            if (posicao === 1) { corFundo = '#FFD700'; corTexto = '#000'; }
                            else if (posicao === 2) { corFundo = '#C0C0C0'; corTexto = '#000'; }
                            else if (posicao === 3) { corFundo = '#CD7F32'; corTexto = '#fff'; }
                            else { corFundo = '#E74C3C'; corTexto = '#fff'; }

                            const fotoUrl = u.foto || 'static/src/avatares/usuario.jpg';
                            const apelido = u.apelido || u.nome;
                            html += `
                                <div class="livro-card" style="cursor:default; position:relative;">
                                    <div class="capa" style="aspect-ratio:1/1; background:transparent; display:flex; align-items:center; justify-content:center; padding:10px; position:relative;">
                                        <img src="${fotoUrl}" alt="${u.nome}" style="width:80%; height:80%; border-radius:50%; object-fit:cover; border:3px solid var(--accent-color);" onerror="this.src='static/src/avatares/usuario.jpg'">
                                        <span style="position:absolute; top:10%; right:10%; background:${corFundo}; color:${corTexto}; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.9rem; border:2px solid rgba(255,255,255,0.6); box-shadow:0 2px 8px rgba(0,0,0,0.3);">
                                            ${posicao}
                                        </span>
                                    </div>
                                    <div class="info" style="text-align:center;">
                                        <h4>${apelido}</h4>
                                        <span style="font-size:0.8rem; color: var(--text-secondary);">${u.livros_lidos} livros lidos</span>
                                    </div>
                                </div>
                            `;
                        });
                        html += `</div>`;
                    }
                } else {
                    const livros = await db.livros.toArray();
                    const alugueisAtivos = await db.alugueis.where({ status: 'ativo' }).toArray();
                    const livrosAlugados = new Set(alugueisAtivos.map(a => a.livro.split(' - ')[0].trim().toLowerCase()));
                    let lista = livros.sort(() => 0.5 - Math.random()).slice(0, 5);
                    html = `<div class="grade-livros">`;
                    lista.forEach(livro => {
                        const tituloSimplificado = livro.titulo.split(' - ')[0].trim().toLowerCase();
                        const disponivel = !livrosAlugados.has(tituloSimplificado);
                        const statusClass = disponivel ? 'status-disponivel' : 'status-alugado';
                        const statusTexto = disponivel ? 'Disponível' : 'Alugado';
                        const caminhoCapa = `static/src/${encodeURIComponent(livro.titulo)}.jpg`;
                        html += `
                            <div class="livro-card" onclick="abrirLivro('${livro.titulo}')">
                                <div class="capa">
                                    <img src="${caminhoCapa}" alt="${livro.titulo}" onerror="this.style.display='none'; this.parentElement.querySelector('.placeholder').style.display='flex';">
                                    <div class="placeholder" style="display:none;"></div>
                                </div>
                                <div class="info">
                                    <h4>${livro.titulo}</h4>
                                    <span class="status ${statusClass}">${statusTexto}</span>
                                </div>
                            </div>
                        `;
                    });
                    html += `</div>`;
                }
                gradeContainer.innerHTML = html;
            }

            let html = `
                <div class="card-user">
                    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
                        <h3 style="margin:0;">Destaques</h3>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            <button class="btn-filtro" data-tipo="top_livros" style="background:var(--accent-color); color:#fff; border:none; padding:6px 16px; border-radius:20px; font-size:0.8rem; cursor:pointer;">Top Livros</button>
                            <button class="btn-filtro" data-tipo="novos_livros" style="background:var(--bg-sidebar); color:var(--text-secondary); border:1px solid var(--border-color); padding:6px 16px; border-radius:20px; font-size:0.8rem; cursor:pointer;">Novos Livros</button>
                            <button class="btn-filtro" data-tipo="top_usuarios" style="background:var(--bg-sidebar); color:var(--text-secondary); border:1px solid var(--border-color); padding:6px 16px; border-radius:20px; font-size:0.8rem; cursor:pointer;">Top Usuários</button>
                        </div>
                    </div>
                    <div id="grade-destaques"></div>
                </div>
            `;

            // Comunidade
            const avaliacoes = await db.avaliacoes.toArray();
            const clientes = await db.clientes.toArray();
            const mapaClientes = {};
            clientes.forEach(c => { mapaClientes[c.id] = { nome: c.nome, apelido: c.apelido || c.nome, foto: c.foto || '' }; });
            avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

            html += `<div class="card-user"><h3>Comunidade - Avaliações</h3>`;
            if (avaliacoes.length === 0) {
                html += `<p>Ainda não há avaliações. Seja o primeiro!</p>`;
            } else {
                html += `<div style="display:grid; gap:16px;">`;
                avaliacoes.forEach(av => {
                    const usuario = mapaClientes[av.usuario_id] || { nome: 'Anônimo', apelido: 'Anônimo', foto: '' };
                    const fotoUrl = usuario.foto || 'static/src/avatares/usuario.jpg';
                    const nomeExibicao = usuario.apelido || usuario.nome;
                    html += `
                        <div style="background: var(--bg-sidebar); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent-color); display: flex; align-items: center; gap: 16px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid var(--accent-color);">
                                <img src="${fotoUrl}" alt="${nomeExibicao}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='static/src/avatares/usuario.jpg'">
                            </div>
                            <div style="flex:1;">
                                <p><strong>${av.livro}</strong> - ⭐ ${av.nota}/5</p>
                                <p style="color: var(--text-secondary);">${av.comentario || 'Sem comentário'}</p>
                                <small style="color: var(--text-secondary);">Por <strong>${nomeExibicao}</strong> em ${av.data}</small>
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            html += `
                <hr style="border-color: var(--border-color); margin: 24px 0;">
                <h4>Deixe sua avaliação</h4>
                <form id="form-avaliacao-inicio" class="form-user" style="max-width:100%;">
                    <div><label for="avaliacao-livro-inicio">Livro</label><input type="text" id="avaliacao-livro-inicio" placeholder="Título do livro" required></div>
                    <div><label for="avaliacao-nota-inicio">Nota (1-5)</label><input type="number" id="avaliacao-nota-inicio" min="1" max="5" placeholder="5" required></div>
                    <div class="full-width"><label for="avaliacao-comentario-inicio">Comentário</label><textarea id="avaliacao-comentario-inicio" rows="3" placeholder="Sua opinião..."></textarea></div>
                    <div class="full-width"><button type="submit" class="btn-user">Enviar avaliação</button></div>
                </form>
            `;
            html += `</div>`;
            contentUser.innerHTML = html;

            // Configura abas
            const botoes = document.querySelectorAll('.btn-filtro');
            async function setAba(tipo) {
                botoes.forEach(btn => {
                    const btnTipo = btn.dataset.tipo;
                    if (btnTipo === tipo) {
                        btn.style.background = 'var(--accent-color)';
                        btn.style.color = '#fff';
                        btn.style.border = 'none';
                    } else {
                        btn.style.background = 'var(--bg-sidebar)';
                        btn.style.color = 'var(--text-secondary)';
                        btn.style.border = '1px solid var(--border-color)';
                    }
                });
                await renderizarAba(tipo);
            }
            botoes.forEach(btn => {
                btn.addEventListener('click', function() {
                    setAba(this.dataset.tipo);
                });
            });
            await setAba('top_livros');

            document.getElementById('form-avaliacao-inicio').addEventListener('submit', async (e) => {
                e.preventDefault();
                const livro = document.getElementById('avaliacao-livro-inicio').value.trim();
                const nota = parseInt(document.getElementById('avaliacao-nota-inicio').value);
                const comentario = document.getElementById('avaliacao-comentario-inicio').value.trim();
                if (!livro || !nota || nota < 1 || nota > 5) {
                    notificar('Preencha todos os campos corretamente.', 'erro');
                    return;
                }
                await db.avaliacoes.add({ livro, usuario_id: usuarioId, nota, comentario, data: new Date().toISOString().split('T')[0] });
                notificar('Avaliação enviada com sucesso!');
                renderInicio();
            });

            console.warn('Página inicial renderizada.');
        } catch (err) {
            console.error('Erro ao renderizar início:', err);
            contentUser.innerHTML = '<p>Erro ao carregar a página inicial.</p>';
        }
    }

    // ================================================================
    // BIBLIOTECA
    // ================================================================
    async function renderBiblioteca() {
        try {
            await aguardarBanco();
            console.warn('Renderizando biblioteca...');
            const livros = await db.livros.toArray();
            const alugueisAtivos = await db.alugueis.where({ status: 'ativo' }).toArray();
            const livrosAlugados = new Set(alugueisAtivos.map(a => a.livro.split(' - ')[0].trim().toLowerCase()));

            let html = `<div class="card-user"><h3>Todos os Livros</h3><div class="grade-livros">`;
            livros.forEach(livro => {
                const tituloSimplificado = livro.titulo.split(' - ')[0].trim().toLowerCase();
                const disponivel = !livrosAlugados.has(tituloSimplificado);
                const statusClass = disponivel ? 'status-disponivel' : 'status-alugado';
                const statusTexto = disponivel ? 'Disponível' : 'Alugado';
                const caminhoCapa = `static/src/${encodeURIComponent(livro.titulo)}.jpg`;
                html += `
                    <div class="livro-card" onclick="abrirLivro('${livro.titulo}')">
                        <div class="capa">
                            <img src="${caminhoCapa}" alt="${livro.titulo}" onerror="this.style.display='none'; this.parentElement.querySelector('.placeholder').style.display='flex';">
                            <div class="placeholder" style="display:none;"></div>
                        </div>
                        <div class="info">
                            <h4>${livro.titulo}</h4>
                            <span class="status ${statusClass}">${statusTexto}</span>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;
            contentUser.innerHTML = html;
            console.warn('Biblioteca renderizada.');
        } catch (err) {
            console.error('Erro ao renderizar biblioteca:', err);
            contentUser.innerHTML = '<p>Erro ao carregar a biblioteca.</p>';
        }
    }

    // ================================================================
    // MEUS LIVROS
    // ================================================================
    async function renderMeusLivros() {
        try {
            await aguardarBanco();
            console.warn('Renderizando meus livros...');
            const alugueis = await db.alugueis.where({ cliente_id: usuarioId }).toArray();
            if (alugueis.length === 0) {
                contentUser.innerHTML = `<div class="card-user"><h3>Meus Livros</h3><p>Você ainda não alugou nenhum livro.</p></div>`;
                return;
            }

            let html = `<div class="card-user"><h3>Meus Livros</h3><table class="tabela-user">
                <thead><tr><th>Livro</th><th>Data Locação</th><th>Prev. Devolução</th><th>Devolução Real</th><th>Status</th><th>Atraso</th><th>Multa</th><th>Ação</th></tr></thead><tbody>`;
            alugueis.forEach(aluguel => {
                const status = aluguel.status === 'ativo' ? 'Ativo' : 'Devolvido';
                const statusClass = aluguel.status === 'ativo' ? 'status-disponivel' : 'status-alugado';
                const dataLoc = aluguel.data_locacao.split('-').reverse().join('/');
                const dataPrevista = parseData(aluguel.data_devolucao_prevista);
                const devPrev = dataPrevista ? dataPrevista.toLocaleDateString('pt-BR') : '-';
                const dataReal = parseData(aluguel.data_devolucao_real);
                const devReal = dataReal ? dataReal.toLocaleDateString('pt-BR') : '-';

                let diasAtraso = aluguel.dias_atraso;
                let multa = aluguel.multa;
                if ((diasAtraso === undefined || diasAtraso === null) && aluguel.status === 'devolvido' && dataPrevista && dataReal && dataReal > dataPrevista) {
                    const diffMs = dataReal - dataPrevista;
                    diasAtraso = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    multa = diasAtraso * MULTA_POR_DIA;
                } else {
                    diasAtraso = diasAtraso || 0;
                    multa = multa || 0;
                }
                const atrasoExibicao = diasAtraso > 0 ? `${diasAtraso} dia(s)` : '—';
                const multaExibicao = multa > 0 ? `R$ ${multa.toFixed(2)}` : '—';

                let acoes = '';
                if (aluguel.status === 'ativo') {
                    acoes = `
                        <button class="btn-user" onclick="renovarAluguel(${aluguel.id})" style="padding:4px 12px; font-size:0.8rem;">Renovar</button>
                        <button class="btn-user" onclick="devolverAluguel(${aluguel.id})" style="padding:4px 12px; font-size:0.8rem; background:#e74c3c;">Devolver</button>
                    `;
                }
                html += `<tr>
                    <td>${aluguel.livro}</td>
                    <td>${dataLoc}</td>
                    <td>${devPrev}</td>
                    <td>${devReal}</td>
                    <td class="${statusClass}">${status}</td>
                    <td>${atrasoExibicao}</td>
                    <td>${multaExibicao}</td>
                    <td>${acoes || '-'}</td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
            contentUser.innerHTML = html;
            console.warn('Meus livros renderizados.');
        } catch (err) {
            console.error('Erro ao renderizar meus livros:', err);
            contentUser.innerHTML = '<p>Erro ao carregar seus livros.</p>';
        }
    }

    // ================================================================
    // PERFIL (VISUALIZAÇÃO)
    // ================================================================
    async function renderPerfil() {
        try {
            await aguardarBanco();
            if (!usuarioAtual) await carregarUsuario();
            console.warn('Renderizando perfil (visualização)...');

            const avaliacoes = await db.avaliacoes.where('usuario_id').equals(usuarioId).toArray();
            avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

            const fotoUrl = usuarioAtual.foto || 'static/src/avatares/usuario.jpg';
            const bio = usuarioAtual.bio || 'Nenhuma bio cadastrada.';
            const nascimento = usuarioAtual.nascimento ? new Date(usuarioAtual.nascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informado';
            const lendoAgora = usuarioAtual.lendo_agora || 'Nenhum livro no momento.';
            const apelido = usuarioAtual.apelido || '';

            let html = `
                <div class="card-user" style="text-align:center;">
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <img src="${fotoUrl}" alt="${usuarioAtual.nome}" style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:4px solid var(--accent-color); margin-bottom:12px;" onerror="this.src='static/src/avatares/usuario.jpg'">
                        <h2 style="margin:0; font-size:2rem;">${apelido || usuarioAtual.nome}</h2>
                        <p style="color:var(--text-secondary); font-size:1rem; margin-top:4px;">${usuarioAtual.nome}</p>
                    </div>
                </div>
                <div class="card-user">
                    <h3>Sobre</h3>
                    <p><strong>Bio:</strong> ${bio}</p>
                    <p><strong>Nascimento:</strong> ${nascimento}</p>
                    <p><strong>Lendo agora:</strong> ${lendoAgora}</p>
                </div>
            `;

            html += `<div class="card-user"><h3>Minhas Avaliações</h3>`;
            if (avaliacoes.length === 0) {
                html += `<p>Você ainda não fez nenhuma avaliação.</p>`;
            } else {
                avaliacoes.forEach(av => {
                    html += `
                        <div style="background:var(--bg-sidebar); padding:12px 16px; border-radius:8px; margin-bottom:10px; border-left:3px solid var(--accent-color);">
                            <p><strong>${av.livro}</strong> - ★ ${av.nota}/5</p>
                            <p style="color:var(--text-secondary); font-size:0.9rem;">${av.comentario || 'Sem comentário'}</p>
                            <small style="color:var(--text-secondary);">${av.data}</small>
                        </div>
                    `;
                });
            }
            html += `</div>`;

            contentUser.innerHTML = html;
            console.warn('Perfil renderizado.');
        } catch (err) {
            console.error('Erro ao renderizar perfil:', err);
            contentUser.innerHTML = '<p>Erro ao carregar perfil.</p>';
        }
    }

    // ================================================================
    // EDITAR PERFIL
    // ================================================================
    async function renderEditarPerfil() {
        try {
            await aguardarBanco();
            if (!usuarioAtual) await carregarUsuario();
            console.warn('Renderizando editar perfil...');

            const bio = usuarioAtual.bio || '';
            const nascimento = usuarioAtual.nascimento || '';
            const lendoAgora = usuarioAtual.lendo_agora || '';
            const foto = usuarioAtual.foto || '';

            let html = `
                <div class="card-user">
                    <h3>Editar Perfil</h3>
                    <h4 style="margin-top:20px; border-bottom:1px solid var(--border-color); padding-bottom:8px; color:var(--accent-color);">PERFIL</h4>
                    <div style="display:grid; grid-template-columns:1fr; gap:16px; margin-top:16px;">
                        <div>
                            <label style="font-weight:500; color:var(--text-secondary); display:block; margin-bottom:4px;">URL da foto (avatar) – opcional</label>
                            <input type="text" id="edit-foto" placeholder="Deixe em branco para manter a atual" value="${foto}" style="width:100%; padding:10px 14px; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); color:var(--text-primary);">
                        </div>
                        <div>
                            <label style="font-weight:500; color:var(--text-secondary); display:block; margin-bottom:4px;">Bio (descrição curta)</label>
                            <textarea id="edit-bio" rows="3" placeholder="Fale um pouco sobre você..." style="width:100%; padding:10px 14px; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); color:var(--text-primary); resize:vertical;">${bio}</textarea>
                        </div>
                        <div>
                            <label style="font-weight:500; color:var(--text-secondary); display:block; margin-bottom:4px;">Lendo agora</label>
                            <input type="text" id="edit-lendo" placeholder="Título do livro que está lendo" value="${lendoAgora}" style="width:100%; padding:10px 14px; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); color:var(--text-primary);">
                        </div>
                        <div>
                            <label style="font-weight:500; color:var(--text-secondary); display:block; margin-bottom:4px;">Data de Nascimento</label>
                            <input type="date" id="edit-nascimento" value="${nascimento}" style="width:100%; padding:10px 14px; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); color:var(--text-primary);">
                        </div>
                    </div>
                    <h4 style="margin-top:30px; border-bottom:1px solid var(--border-color); padding-bottom:8px; color:var(--accent-color);">USUÁRIO</h4>
                    <div style="display:grid; grid-template-columns:1fr; gap:16px; margin-top:16px;">
                        <div>
                            <label style="font-weight:500; color:var(--text-secondary); display:block; margin-bottom:4px;">Nova senha</label>
                            <input type="password" id="edit-senha" placeholder="Deixe em branco para manter a atual" style="width:100%; padding:10px 14px; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); color:var(--text-primary);">
                            <small style="color:var(--text-secondary);">Mínimo 4 caracteres</small>
                        </div>
                    </div>
                    <button type="submit" id="btn-salvar-perfil" class="btn-user" style="margin-top:30px; width:100%;">Salvar alterações</button>
                </div>
            `;
            contentUser.innerHTML = html;

            document.getElementById('btn-salvar-perfil').addEventListener('click', async function(e) {
                e.preventDefault();
                const foto = document.getElementById('edit-foto').value.trim();
                const bio = document.getElementById('edit-bio').value.trim();
                const lendoAgora = document.getElementById('edit-lendo').value.trim();
                const nascimento = document.getElementById('edit-nascimento').value;
                const novaSenha = document.getElementById('edit-senha').value.trim();

                console.warn('Salvando perfil:', { foto, bio, lendoAgora, nascimento, novaSenha });

                const atualizacao = {};
                if (foto) atualizacao.foto = foto;
                if (bio) atualizacao.bio = bio;
                if (lendoAgora) atualizacao.lendo_agora = lendoAgora;
                if (nascimento) atualizacao.nascimento = nascimento;
                if (novaSenha && novaSenha.length >= 4) atualizacao.senha = novaSenha;

                if (Object.keys(atualizacao).length === 0) {
                    notificar('Nenhuma alteração foi feita.', 'erro');
                    return;
                }

                try {
                    await aguardarBanco();
                    await db.clientes.update(usuarioId, atualizacao);
                    if (foto) userAvatar.src = foto;
                    usuarioAtual = await db.clientes.get(usuarioId);
                    notificar('Perfil atualizado com sucesso!');
                    renderEditarPerfil();
                } catch (err) {
                    console.error('Erro ao salvar perfil:', err);
                    notificar('Erro ao salvar alterações.', 'erro');
                }
            });

            console.warn('Editar perfil renderizado.');
        } catch (err) {
            console.error('Erro ao renderizar editar perfil:', err);
            contentUser.innerHTML = '<p>Erro ao carregar edição de perfil.</p>';
        }
    }

    // ================================================================
    // SOLICITAR LIVROS
    // ================================================================
    async function renderSolicitarLivros() {
        contentUser.innerHTML = `
            <div class="card-user" style="text-align:center; padding:40px;">
                <h3>Solicitar Livros</h3>
                <p style="color:var(--text-secondary); font-size:1.1rem; margin-top:20px;">
                    Em breve você poderá solicitar novos livros para a biblioteca.
                </p>
                <p style="color:var(--text-secondary);">Esta funcionalidade está em desenvolvimento.</p>
            </div>
        `;
    }

    // ===== FUNÇÕES GLOBAIS (renovar, devolver, abrir livro, notificar, logout) =====
    window.abrirLivro = function(titulo) {
        notificar(`Detalhes de "${titulo}" em breve.`, 'info');
    };

    window.renovarAluguel = async function(aluguelId) {
        try {
            await aguardarBanco();
            const aluguel = await db.alugueis.get(aluguelId);
            if (!aluguel || aluguel.status !== 'ativo') {
                notificar('Este aluguel não está ativo.', 'erro');
                return;
            }
            const data = new Date(aluguel.data_devolucao_prevista + 'T00:00:00');
            if (isNaN(data)) {
                notificar('Erro ao processar data.', 'erro');
                return;
            }
            data.setDate(data.getDate() + 7);
            const novaDataISO = data.toISOString().split('T')[0];
            await db.alugueis.update(aluguelId, { data_devolucao_prevista: novaDataISO });
            notificar(`Aluguel renovado até ${data.toLocaleDateString('pt-BR')}.`);
            renderMeusLivros();
        } catch (err) {
            console.error('Erro ao renovar:', err);
            notificar('Erro ao renovar aluguel.', 'erro');
        }
    };

    window.devolverAluguel = async function(aluguelId) {
        if (!confirm('Deseja realmente devolver este livro?')) return;
        try {
            await aguardarBanco();
            const aluguel = await db.alugueis.get(aluguelId);
            if (!aluguel || aluguel.status !== 'ativo') {
                notificar('Este aluguel não está ativo.', 'erro');
                return;
            }

            const hoje = new Date().toISOString().split('T')[0];
            let diasAtraso = 0, multa = 0;
            const dataPrevista = parseData(aluguel.data_devolucao_prevista);
            const dataReal = new Date(hoje + 'T00:00:00');
            if (dataPrevista && dataReal > dataPrevista) {
                const diffMs = dataReal - dataPrevista;
                diasAtraso = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                multa = diasAtraso * MULTA_POR_DIA;
            }

            if (diasAtraso > 0) {
                const confirmado = await exibirModalMulta(diasAtraso, multa);
                if (!confirmado) {
                    notificar('Devolução cancelada.', 'erro');
                    return;
                }
            }

            await db.alugueis.update(aluguelId, {
                status: 'devolvido',
                data_devolucao_real: hoje,
                dias_atraso: diasAtraso,
                multa: multa
            });
            notificar(`Livro "${aluguel.livro}" devolvido com sucesso! Multa: R$ ${multa.toFixed(2)}.`);
            renderMeusLivros();
        } catch (err) {
            console.error('Erro ao devolver:', err);
            notificar('Erro ao devolver livro.', 'erro');
        }
    };

    // ===== LOGOUT =====
    logoutBtn.addEventListener('click', logout);

    // ================================================================
    // NAVEGAÇÃO (ATUALIZADA COM TODAS AS SEÇÕES)
    // ================================================================
    const menuLinks = document.querySelectorAll('.menu-user a[data-section]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            const titles = {
                'inicio': 'Página Inicial',
                'perfil': 'Perfil',
                'editar-perfil': 'Editar Perfil',
                'biblioteca': 'Biblioteca',
                'meus-livros': 'Meus Livros',
                'solicitar-livros': 'Solicitar Livros'
            };
            sectionTitle.textContent = titles[section] || section;

            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            switch (section) {
                case 'inicio': renderInicio(); break;
                case 'perfil': renderPerfil(); break;
                case 'editar-perfil': renderEditarPerfil(); break;
                case 'biblioteca': renderBiblioteca(); break;
                case 'meus-livros': renderMeusLivros(); break;
                case 'solicitar-livros': renderSolicitarLivros(); break;
                default: contentUser.innerHTML = '<p>Seção em desenvolvimento.</p>';
            }
        });
    });

    // ================================================================
    // INICIALIZAÇÃO
    // ================================================================
    carregarUsuario().then(() => {
        const linkInicio = document.querySelector('a[data-section="inicio"]');
        if (linkInicio) linkInicio.click();
        else renderInicio();
    }).catch(err => {
        console.error('Erro na inicialização:', err);
        contentUser.innerHTML = '<p>Erro ao iniciar o painel. Recarregue a página.</p>';
    });

}); // FIM DO DOMContentLoaded