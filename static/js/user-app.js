// ============================================================
// user-app.js – Painel do usuário (Netflix-style)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 User app iniciado.');

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

    // Dados do usuário logado
    const usuarioId = parseInt(sessionStorage.getItem('usuarioId'));
    let usuarioAtual = null;

    // ===== AGUARDA O BANCO =====
    async function aguardarBanco() {
        return new Promise((resolve) => {
            if (typeof db !== 'undefined') {
                resolve();
                return;
            }
            const interval = setInterval(() => {
                if (typeof db !== 'undefined') {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    }

    // ===== CARREGA USUÁRIO =====
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
            if (usuarioAtual.foto) {
                userAvatar.src = usuarioAtual.foto;
            }
            console.log('✅ Usuário carregado:', usuarioAtual.nome);
        } catch (err) {
            console.error('Erro ao carregar usuário:', err);
            notificar('Erro ao carregar dados do usuário.', 'erro');
        }
    }

    // ===== FUNÇÕES DE RENDERIZAÇÃO =====

    // 1. Página Inicial
    async function renderInicio() {
        try {
            await aguardarBanco();
            console.log('📌 Renderizando página inicial...');
            const livros = await db.livros.toArray();
            const alugueisAtivos = await db.alugueis.where({ status: 'ativo' }).toArray();
            const livrosAlugados = new Set(alugueisAtivos.map(a => a.livro.split(' - ')[0].trim().toLowerCase()));

            const destaques = livros.sort(() => 0.5 - Math.random()).slice(0, 6);

            let html = `
                <div class="card-user">
                    <h3>📌 Destaques</h3>
                    <div class="grade-livros">
            `;
            destaques.forEach(livro => {
                const tituloSimplificado = livro.titulo.split(' - ')[0].trim().toLowerCase();
                const disponivel = !livrosAlugados.has(tituloSimplificado);
                const statusClass = disponivel ? 'status-disponivel' : 'status-alugado';
                const statusTexto = disponivel ? 'Disponível' : 'Alugado';
                const caminhoCapa = `static/src/${encodeURIComponent(livro.titulo)}.jpg`;

                html += `
                    <div class="livro-card" onclick="abrirLivro('${livro.titulo}')">
                        <div class="capa">
                            <img src="${caminhoCapa}" alt="${livro.titulo}" onerror="this.style.display='none'; this.parentElement.querySelector('.placeholder').style.display='flex';">
                            <div class="placeholder" style="display:none;">📚</div>
                        </div>
                        <div class="info">
                            <h4>${livro.titulo}</h4>
                            <span class="status ${statusClass}">${statusTexto}</span>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;

            // Últimas avaliações
            const avaliacoes = await db.avaliacoes.toArray();
            const ultimasAvaliacoes = avaliacoes.sort((a,b) => new Date(b.data) - new Date(a.data)).slice(0, 3);
            if (ultimasAvaliacoes.length > 0) {
                const usuarios = await db.clientes.toArray();
                const mapaUsuarios = {};
                usuarios.forEach(u => { mapaUsuarios[u.id] = u.nome; });

                html += `<div class="card-user"><h3>💬 Últimas da Comunidade</h3>`;
                ultimasAvaliacoes.forEach(av => {
                    const nomeUsuario = mapaUsuarios[av.usuario_id] || 'Anônimo';
                    html += `
                        <div style="background: var(--bg-sidebar); padding: 12px 16px; border-radius: 8px; margin-bottom: 10px;">
                            <p><strong>${av.livro}</strong> - ⭐ ${av.nota}/5</p>
                            <p style="color: var(--text-secondary); font-size:0.9rem;">${av.comentario || 'Sem comentário'}</p>
                            <small style="color: var(--text-secondary);">Por ${nomeUsuario} em ${av.data}</small>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            contentUser.innerHTML = html;
            console.log('✅ Página inicial renderizada.');
        } catch (err) {
            console.error('Erro ao renderizar início:', err);
            contentUser.innerHTML = '<p>⚠️ Erro ao carregar a página inicial. Tente recarregar.</p>';
        }
    }

    // 2. Biblioteca
    async function renderBiblioteca() {
        try {
            await aguardarBanco();
            console.log('📚 Renderizando biblioteca...');
            const livros = await db.livros.toArray();
            const alugueisAtivos = await db.alugueis.where({ status: 'ativo' }).toArray();
            const livrosAlugados = new Set(alugueisAtivos.map(a => a.livro.split(' - ')[0].trim().toLowerCase()));

            let html = `<div class="card-user"><h3>📚 Todos os Livros</h3><div class="grade-livros">`;
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
                            <div class="placeholder" style="display:none;">📚</div>
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
            console.log('✅ Biblioteca renderizada.');
        } catch (err) {
            console.error('Erro ao renderizar biblioteca:', err);
            contentUser.innerHTML = '<p>⚠️ Erro ao carregar a biblioteca.</p>';
        }
    }

    // 3. Meus Livros
    async function renderMeusLivros() {
        try {
            await aguardarBanco();
            console.log('📖 Renderizando meus livros...');
            const alugueis = await db.alugueis.where({ cliente_id: usuarioId }).toArray();
            if (alugueis.length === 0) {
                contentUser.innerHTML = `<div class="card-user"><h3>📖 Meus Livros</h3><p>Você ainda não alugou nenhum livro.</p></div>`;
                return;
            }

            let html = `<div class="card-user"><h3>📖 Meus Livros</h3><table class="tabela-user">
                <thead><tr><th>Livro</th><th>Data Locação</th><th>Prev. Devolução</th><th>Status</th><th>Ação</th></tr></thead><tbody>`;
            alugueis.forEach(aluguel => {
                const status = aluguel.status === 'ativo' ? 'Ativo' : 'Devolvido';
                const statusClass = aluguel.status === 'ativo' ? 'status-disponivel' : 'status-alugado';
                const dataLoc = aluguel.data_locacao.split('-').reverse().join('/');
                const devPrev = aluguel.data_devolucao_prevista 
                    ? new Date(aluguel.data_devolucao_prevista + 'T00:00:00').toLocaleDateString('pt-BR') 
                    : '-';
                const devReal = aluguel.data_devolucao_real ? aluguel.data_devolucao_real.split('-').reverse().join('/') : '-';

                let acoes = '';
                if (aluguel.status === 'ativo') {
                    acoes = `
                        <button class="btn-user" onclick="renovarAluguel(${aluguel.id})" style="padding:4px 12px; font-size:0.8rem;">🔄 Renovar</button>
                        <button class="btn-user" onclick="devolverAluguel(${aluguel.id})" style="padding:4px 12px; font-size:0.8rem; background:#e74c3c;">📦 Devolver</button>
                    `;
                }

                html += `<tr>
                    <td>${aluguel.livro}</td>
                    <td>${dataLoc}</td>
                    <td>${devPrev}</td>
                    <td class="${statusClass}">${status}</td>
                    <td>${acoes || '-'}</td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
            contentUser.innerHTML = html;
            console.log('✅ Meus livros renderizados.');
        } catch (err) {
            console.error('Erro ao renderizar meus livros:', err);
            contentUser.innerHTML = '<p>⚠️ Erro ao carregar seus livros.</p>';
        }
    }

    // ===== 4. PERFIL (completo com bio, nascimento, lendo_agora) =====
    async function renderPerfil() {
        try {
            await aguardarBanco();
            if (!usuarioAtual) await carregarUsuario();
            console.log('👤 Renderizando perfil...');

            // Garantir que campos existam (caso não estejam no banco)
            const bio = usuarioAtual.bio || '';
            const nascimento = usuarioAtual.nascimento || '';
            const lendoAgora = usuarioAtual.lendo_agora || '';

            let html = `
                <div class="card-user">
                    <h3>👤 Meu Perfil</h3>
                    <form id="form-perfil" class="form-user">
                        <div class="full-width">
                            <label for="perfil-nome">Nome completo</label>
                            <input type="text" id="perfil-nome" value="${usuarioAtual.nome || ''}" required>
                        </div>
                        <div>
                            <label for="perfil-apelido">Apelido (nick)</label>
                            <input type="text" id="perfil-apelido" placeholder="Como quer ser chamado?" value="${usuarioAtual.apelido || ''}">
                        </div>
                        <div>
                            <label for="perfil-foto">URL da foto (avatar)</label>
                            <input type="url" id="perfil-foto" placeholder="https://exemplo.com/foto.jpg" value="${usuarioAtual.foto || ''}">
                        </div>
                        <div>
                            <label for="perfil-nascimento">Data de Nascimento</label>
                            <input type="date" id="perfil-nascimento" value="${nascimento}">
                        </div>
                        <div>
                            <label for="perfil-lendo">📖 Lendo agora</label>
                            <input type="text" id="perfil-lendo" placeholder="Título do livro que está lendo" value="${lendoAgora}">
                        </div>
                        <div class="full-width">
                            <label for="perfil-bio">Bio (descrição curta)</label>
                            <textarea id="perfil-bio" rows="3" placeholder="Fale um pouco sobre você...">${bio}</textarea>
                        </div>
                        <div class="full-width">
                            <label for="perfil-senha">Nova senha (opcional)</label>
                            <input type="password" id="perfil-senha" placeholder="Deixe em branco para manter">
                        </div>
                        <div class="full-width">
                            <button type="submit" class="btn-user">Salvar alterações</button>
                        </div>
                    </form>
                </div>
            `;
            contentUser.innerHTML = html;
            console.log('✅ Perfil renderizado.');

            // ===== EVENTO DE SUBMISSÃO =====
            document.getElementById('form-perfil').addEventListener('submit', async (e) => {
                e.preventDefault();
                const nome = document.getElementById('perfil-nome').value.trim();
                const apelido = document.getElementById('perfil-apelido').value.trim();
                const foto = document.getElementById('perfil-foto').value.trim();
                const nascimento = document.getElementById('perfil-nascimento').value;
                const lendoAgora = document.getElementById('perfil-lendo').value.trim();
                const bio = document.getElementById('perfil-bio').value.trim();
                const novaSenha = document.getElementById('perfil-senha').value.trim();

                if (!nome) {
                    notificar('Nome é obrigatório.', 'erro');
                    return;
                }

                const atualizacao = {
                    nome,
                    apelido,
                    foto: foto || '',
                    nascimento,
                    lendo_agora: lendoAgora,
                    bio
                };

                if (novaSenha.length >= 4) {
                    atualizacao.senha = novaSenha;
                }

                await db.clientes.update(usuarioId, atualizacao);
                sessionStorage.setItem('usuario', nome);
                userNome.textContent = nome.split(' ')[0];
                userApelido.textContent = apelido;
                if (foto) userAvatar.src = foto;
                notificar('Perfil atualizado com sucesso!');
                renderPerfil(); // recarrega
            });

        } catch (err) {
            console.error('Erro ao renderizar perfil:', err);
            contentUser.innerHTML = '<p>⚠️ Erro ao carregar perfil.</p>';
        }
    }

    // 5. Comunidade
    async function renderComunidade() {
        try {
            await aguardarBanco();
            console.log('💬 Renderizando comunidade...');

            const avaliacoes = await db.avaliacoes.toArray();
            const clientes = await db.clientes.toArray();
            const mapaClientes = {};
            clientes.forEach(c => {
                mapaClientes[c.id] = {
                    nome: c.nome,
                    apelido: c.apelido || c.nome,
                    foto: c.foto || ''
                };
            });

            avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

            let html = `<div class="card-user"><h3>💬 Comunidade - Avaliações</h3>`;

            if (avaliacoes.length === 0) {
                html += `<p>Ainda não há avaliações. Seja o primeiro!</p>`;
            } else {
                html += `<div style="display:grid; gap:16px;">`;
                avaliacoes.forEach(av => {
                    const usuario = mapaClientes[av.usuario_id] || { nome: 'Anônimo', apelido: 'Anônimo', foto: '' };
                    const fotoUrl = usuario.foto || 'static/src/default-avatar.png';
                    const nomeExibicao = usuario.apelido || usuario.nome;
                    html += `
                        <div style="background: var(--bg-sidebar); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent-color); display: flex; align-items: center; gap: 16px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid var(--accent-color);">
                                <img src="${fotoUrl}" alt="${nomeExibicao}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='static/src/default-avatar.png'">
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

            // Formulário para nova avaliação
            html += `
                <hr style="border-color: var(--border-color); margin: 24px 0;">
                <h4>Deixe sua avaliação</h4>
                <form id="form-avaliacao" class="form-user" style="max-width:100%;">
                    <div>
                        <label for="avaliacao-livro">Livro</label>
                        <input type="text" id="avaliacao-livro" placeholder="Título do livro" required>
                    </div>
                    <div>
                        <label for="avaliacao-nota">Nota (1-5)</label>
                        <input type="number" id="avaliacao-nota" min="1" max="5" placeholder="5" required>
                    </div>
                    <div class="full-width">
                        <label for="avaliacao-comentario">Comentário</label>
                        <textarea id="avaliacao-comentario" rows="3" placeholder="Sua opinião..."></textarea>
                    </div>
                    <div class="full-width">
                        <button type="submit" class="btn-user">Enviar avaliação</button>
                    </div>
                </form>
            `;
            html += `</div>`;
            contentUser.innerHTML = html;

            document.getElementById('form-avaliacao').addEventListener('submit', async (e) => {
                e.preventDefault();
                const livro = document.getElementById('avaliacao-livro').value.trim();
                const nota = parseInt(document.getElementById('avaliacao-nota').value);
                const comentario = document.getElementById('avaliacao-comentario').value.trim();
                if (!livro || !nota || nota < 1 || nota > 5) {
                    notificar('Preencha todos os campos corretamente.', 'erro');
                    return;
                }
                await db.avaliacoes.add({
                    livro,
                    usuario_id: usuarioId,
                    nota,
                    comentario,
                    data: new Date().toISOString().split('T')[0]
                });
                notificar('Avaliação enviada com sucesso!');
                renderComunidade();
            });
            console.log('✅ Comunidade renderizada.');
        } catch (err) {
            console.error('Erro ao renderizar comunidade:', err);
            contentUser.innerHTML = '<p>⚠️ Erro ao carregar comunidade.</p>';
        }
    }

    // ===== FUNÇÕES GLOBAIS =====
    window.abrirLivro = function(titulo) {
        notificar(`📖 Detalhes de "${titulo}" em breve.`, 'info');
    };

    window.renovarAluguel = async function(aluguelId) {
        try {
            await aguardarBanco();
            const aluguel = await db.alugueis.get(aluguelId);
            if (!aluguel || aluguel.status !== 'ativo') {
                notificar('Este aluguel não está ativo.', 'erro');
                return;
            }
            const partes = aluguel.data_devolucao_prevista.split('/');
            const data = new Date(aluguel.data_devolucao_prevista + 'T00:00:00');
            data.setDate(data.getDate() + 7);
            const novaDataISO = data.toISOString().split('T')[0];
            await db.alugueis.update(aluguelId, { data_devolucao_prevista: novaDataISO });
            // Notificar com formato pt-BR
            const novaDataBR = data.toLocaleDateString('pt-BR');
            notificar(`Aluguel renovado até ${novaDataBR}.`);
            renderMeusLivros();
        } catch (err) {
            console.error('Erro ao renovar:', err);
            notificar('Erro ao renovar aluguel.', 'erro');
        }
    };

    window.devolverAluguel = async function(aluguelId) {
        if (!confirm('Confirmar devolução?')) return;
        try {
            await aguardarBanco();
            const aluguel = await db.alugueis.get(aluguelId);
            if (!aluguel || aluguel.status !== 'ativo') {
                notificar('Este aluguel não está ativo.', 'erro');
                return;
            }
            await db.alugueis.update(aluguelId, {
                status: 'devolvido',
                data_devolucao_real: new Date().toISOString().split('T')[0]
            });
            notificar(`Livro "${aluguel.livro}" devolvido com sucesso!`);
            renderMeusLivros();
        } catch (err) {
            console.error('Erro ao devolver:', err);
            notificar('Erro ao devolver livro.', 'erro');
        }
    };

    // ===== NOTIFICAÇÃO =====
    function notificar(mensagem, tipo = 'sucesso') {
        const notif = document.getElementById('notificacao-user');
        notif.textContent = mensagem;
        notif.className = 'notificacao-user ' + (tipo === 'erro' ? 'erro' : '');
        notif.style.display = 'block';
        setTimeout(() => { notif.style.display = 'none'; }, 4000);
    }

    // ===== LOGOUT =====
    function logout() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }

    logoutBtn.addEventListener('click', logout);

    // ===== NAVEGAÇÃO =====
    const menuLinks = document.querySelectorAll('.menu-user a[data-section]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            const titles = {
                'inicio': 'Página Inicial',
                'biblioteca': 'Biblioteca',
                'meus-livros': 'Meus Livros',
                'perfil': 'Perfil',
                'comunidade': 'Comunidade'
            };
            sectionTitle.textContent = titles[section] || section;

            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            switch (section) {
                case 'inicio': renderInicio(); break;
                case 'biblioteca': renderBiblioteca(); break;
                case 'meus-livros': renderMeusLivros(); break;
                case 'perfil': renderPerfil(); break;
                case 'comunidade': renderComunidade(); break;
                default: contentUser.innerHTML = '<p>Seção em desenvolvimento.</p>';
            }
        });
    });

    // ===== INICIALIZAÇÃO =====
    carregarUsuario().then(() => {
        const linkInicio = document.querySelector('a[data-section="inicio"]');
        if (linkInicio) {
            linkInicio.click();
        } else {
            renderInicio();
        }
    }).catch(err => {
        console.error('Erro na inicialização:', err);
        contentUser.innerHTML = '<p>⚠️ Erro ao iniciar o painel. Recarregue a página.</p>';
    });
});