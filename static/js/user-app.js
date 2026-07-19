// ============================================================
// user-app.js – Painel do usuário (Netflix-style)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 User app iniciado.');

    const MULTA_POR_DIA = 1.00; // valor em reais por dia de atraso

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

    // ===== FUNÇÃO AUXILIAR: PARSE DE DATA =====
    function parseData(str) {
        if (!str) return null;
        // Formato ISO yyyy-mm-dd
        if (str.includes('-') && str.length === 10) {
            const d = new Date(str + 'T00:00:00');
            return isNaN(d) ? null : d;
        }
        // Formato brasileiro dd/mm/aaaa
        if (str.includes('/')) {
            const partes = str.split('/');
            if (partes.length === 3) {
                const d = new Date(partes[2], partes[1] - 1, partes[0]);
                return isNaN(d) ? null : d;
            }
        }
        return null;
    }

    // ===== FUNÇÃO AUXILIAR: MODAL DE MULTA =====
    function exibirModalMulta(diasAtraso, multa) {
        return new Promise((resolve) => {
            const existente = document.getElementById('modal-multa');
            if (existente) existente.remove();

            const modal = document.createElement('div');
            modal.id = 'modal-multa';
            modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;';
            modal.innerHTML = `
                <div style="background:#fff; padding:30px; border-radius:8px; max-width:450px; width:90%; text-align:center;">
                    <h3 style="color:#e74c3c;">⚠️ Devolução com Atraso</h3>
                    <p>Atraso de <strong>${diasAtraso} dia(s)</strong>.</p>
                    <p>Multa: <strong>R$ ${multa.toFixed(2)}</strong></p>
                    <button id="btn-pagar" style="margin:10px; padding:10px 20px; background:#27ae60; color:#fff; border:none; border-radius:5px; cursor:pointer;">Pagar</button>
                    <button id="btn-cancelar" style="margin:10px; padding:10px 20px; background:#e74c3c; color:#fff; border:none; border-radius:5px; cursor:pointer;">Cancelar</button>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('btn-cancelar').onclick = () => {
                modal.remove();
                resolve(false);
            };

            document.getElementById('btn-pagar').onclick = () => {
                modal.querySelector('div').innerHTML = `
                    <h3>👨‍💻 Desenvolvido por:</h3>
                    <div style="text-align:left; margin:20px 0;">
                        <p><a href="https://github.com/Guspelepe" target="_blank">@Guspelepe</a> - Gustavo Pelepe</p>
                        <p><a href="https://github.com/ronaldokaras" target="_blank">@ronaldokaras</a> - Ronaldo Karas</p>
                        <p><a href="https://github.com/douglasbecker404" target="_blank">@douglasbecker404</a> - Douglas Becker</p>
                    </div>
                    <button id="btn-confirmar-devolucao" style="margin:10px; padding:10px 20px; background:#3498db; color:#fff; border:none; border-radius:5px; cursor:pointer;">Confirmar Devolução</button>
                    <button id="btn-voltar" style="margin:10px; padding:10px 20px; background:#95a5a6; color:#fff; border:none; border-radius:5px; cursor:pointer;">Voltar</button>
                `;
                document.getElementById('btn-confirmar-devolucao').onclick = () => {
                    modal.remove();
                    resolve(true);
                };
                document.getElementById('btn-voltar').onclick = () => {
                    modal.remove();
                    resolve(false);
                };
            };
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

    // 3. Meus Livros (ATUALIZADO COM NOVAS COLUNAS)
    async function renderMeusLivros() {
        try {
            await aguardarBanco();
            console.log('📖 Renderizando meus livros...');
            const alugueis = await db.alugueis.where({ cliente_id: usuarioId }).toArray();
            if (alugueis.length === 0) {
                contentUser.innerHTML = `<div class="card-user"><h3>📖 Meus Livros</h3><p>Você ainda não alugou nenhum livro.</p></div>`;
                return;
            }

            // Cabeçalho atualizado com Devolução Real, Atraso e Multa
            let html = `<div class="card-user"><h3>📖 Meus Livros</h3><table class="tabela-user">
                <thead><tr><th>Livro</th><th>Data Locação</th><th>Prev. Devolução</th><th>Devolução Real</th><th>Status</th><th>Atraso</th><th>Multa</th><th>Ação</th></tr></thead><tbody>`;

            alugueis.forEach(aluguel => {
                const status = aluguel.status === 'ativo' ? 'Ativo' : 'Devolvido';
                const statusClass = aluguel.status === 'ativo' ? 'status-disponivel' : 'status-alugado';

                const dataLoc = aluguel.data_locacao.split('-').reverse().join('/');
                const dataPrevista = parseData(aluguel.data_devolucao_prevista);
                const devPrev = dataPrevista ? dataPrevista.toLocaleDateString('pt-BR') : '-';
                const dataReal = parseData(aluguel.data_devolucao_real);
                const devReal = dataReal ? dataReal.toLocaleDateString('pt-BR') : '-';

                // Calcula atraso e multa dinamicamente
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
                        <button class="btn-user" onclick="renovarAluguel(${aluguel.id})" style="padding:4px 12px; font-size:0.8rem;">🔄 Renovar</button>
                        <button class="btn-user" onclick="devolverAluguel(${aluguel.id})" style="padding:4px 12px; font-size:0.8rem; background:#e74c3c;">📦 Devolver</button>
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
            console.log('✅ Meus livros renderizados.');
        } catch (err) {
            console.error('Erro ao renderizar meus livros:', err);
            contentUser.innerHTML = '<p>⚠️ Erro ao carregar seus livros.</p>';
        }
    }

    // 4. Perfil
    async function renderPerfil() {
        try {
            await aguardarBanco();
            if (!usuarioAtual) await carregarUsuario();
            console.log('👤 Renderizando perfil...');

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
                renderPerfil();
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
                    const fotoUrl = usuario.foto || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNCM0U1RkMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjgyIiByPSIyOCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI0IwQkVDNSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIxNiIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI0IwQkVDNSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cmVjdCB4PSIzOCIgeT0iMjIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgcng9IjIiIGZpbGw9IiMzNzQ3NEYiLz48cmVjdCB4PSIzMiIgeT0iMzciIHdpZHRoPSIzNiIgaGVpZ2h0PSI0IiByeD0iMiIgZmlsbD0iIzM3NDc0RiIvPjxjaXJjbGUgY3g9IjQ1IiBjeT0iMzgiIHI9IjIiIGZpbGw9IiMyMTIxMjEiLz48Y2lyY2xlIGN4PSI1NSIgY3k9IjM4IiByPSIyIiBmaWxsPSIjMjEyMTIxIi8+PHBvbHlnb24gcG9pbnRzPSI1MCw0MiA1Niw0NCA1MCw0NiIgZmlsbD0iI0ZGNzA0MyIvPjxjaXJjbGUgY3g9IjQ1IiBjeT0iNDciIHI9IjEuMiIgZmlsbD0iIzQyNDI0MiIvPjxjaXJjbGUgY3g9IjQ4LjUiIGN5PSI0OC41IiByPSIxLjIiIGZpbGw9IiM0MjQyNDIiLz48Y2lyY2xlIGN4PSI1MS41IiBjeT0iNDguNSIgcj0iMS4yIiBmaWxsPSIjNDI0MjQyIi8+PGNpcmNsZSBjeD0iNTUiIGN5PSI0NyIgcj0iMS4yIiBmaWxsPSIjNDI0MjQyIi8+PHBhdGggZD0iTTM5IDUyIFE1MCA1NyA2MSA1MiBMNjAgNTggUTUwIDYzIDQwIDU4IFoiIGZpbGw9IiNFNTM5MzUiLz48cmVjdCB4PSI1OCIgeT0iNTUiIHdpZHRoPSI4IiBoZWlnaHQ9IjE0IiByeD0iMiIgZmlsbD0iI0U1MzkzNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTUgNTggNTUpIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2NSIgcj0iMi41IiBmaWxsPSIjNDI0MjQyIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI3MyIgcj0iMi41IiBmaWxsPSIjNDI0MjQyIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI4MSIgcj0iMi41IiBmaWxsPSIjNDI0MjQyIi8+PGxpbmUgeDE9IjM1IiB5MT0iNTgiIHgyPSIyMCIgeTI9IjQ4IiBzdHJva2U9IiM3OTU1NDgiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48bGluZSB4MT0iMjEiIHkxPSI0OSIgeDI9IjE3IiB5Mj0iNDMiIHN0cm9rZT0iIzc5NTU0OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48bGluZSB4MT0iNjUiIHkxPSI1OCIgeDI9IjgwIiB5Mj0iNDgiIHN0cm9rZT0iIzc5NTU0OCIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSI3OSIgeTE9IjQ5IiB4Mj0iODMiIHkyPSI0MyIgc3Ryb2tlPSIjNzk1NTQ4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjgwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNzUiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI4NSIgY3k9IjgwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BjaXR5PSIwLjgiLz48L3N2Zz4=';
                    const nomeExibicao = usuario.apelido || usuario.nome;
                    html += `
                        <div style="background: var(--bg-sidebar); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent-color); display: flex; align-items: center; gap: 16px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid var(--accent-color);">
                                <img src="${fotoUrl}" alt="${nomeExibicao}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNlZWUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIxNSIgZmlsbD0iI2NjYyIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iODUiIHI9IjMwIiBmaWxsPSIjY2NjIi8+PC9zdmc+'">
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
            
            let data;
            const strData = aluguel.data_devolucao_prevista;
            if (strData.includes('/')) {
                const partes = strData.split('/');
                if (partes.length === 3) {
                    data = new Date(partes[2], partes[1] - 1, partes[0]);
                } else {
                    notificar('Formato de data inválido.', 'erro');
                    return;
                }
            } else if (strData.includes('-')) {
                data = new Date(strData + 'T00:00:00');
            } else {
                notificar('Formato de data inválido.', 'erro');
                return;
            }
            
            if (isNaN(data)) {
                notificar('Erro ao processar data.', 'erro');
                return;
            }
            
            data.setDate(data.getDate() + 7);
            const novaDataISO = data.toISOString().split('T')[0];
            await db.alugueis.update(aluguelId, { data_devolucao_prevista: novaDataISO });
            const novaDataBR = data.toLocaleDateString('pt-BR');
            notificar(`Aluguel renovado até ${novaDataBR}.`);
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
            let diasAtraso = 0;
            let multa = 0;

            if (aluguel.data_devolucao_prevista) {
                const prevista = parseData(aluguel.data_devolucao_prevista);
                const real = new Date(hoje + 'T00:00:00');
                if (prevista && real > prevista) {
                    const diffMs = real - prevista;
                    diasAtraso = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    multa = diasAtraso * MULTA_POR_DIA;
                }
            }

            // Se houver atraso, mostra modal de multa
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