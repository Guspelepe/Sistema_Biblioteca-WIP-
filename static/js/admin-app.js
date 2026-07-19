// ============================================================
// admin-app.js – Painel do bibliotecário (login obrigatório)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Admin app iniciado.');

    const MULTA_POR_DIA = 1.00;

    // Credenciais dos bibliotecários
    const BIBLIOTECARIOS = [
        { usuario: "ana", senha: "ana123" },
        { usuario: "carlos", senha: "carlos456" }
    ];

    // DOM elements
    const contentArea = document.getElementById('content-area');
    const sectionTitle = document.getElementById('section-title');
    const adminNomeSpan = document.getElementById('admin-nome');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // ===== FORÇA O MODAL A FICAR VISÍVEL INICIALMENTE =====
    loginModal.style.display = 'flex';
    contentArea.innerHTML = '<p>Faça login para acessar o sistema.</p>';
    adminNomeSpan.textContent = 'Desconectado';

    if (sessionStorage.getItem('perfil') !== 'bibliotecario') {
        sessionStorage.removeItem('logado');
        sessionStorage.removeItem('perfil');
        sessionStorage.removeItem('usuario');
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

            document.getElementById('btn-cancelar').onclick = () => { modal.remove(); resolve(false); };
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
                document.getElementById('btn-confirmar-devolucao').onclick = () => { modal.remove(); resolve(true); };
                document.getElementById('btn-voltar').onclick = () => { modal.remove(); resolve(false); };
            };
        });
    }

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

    // ================================================================
    // RENDERIZAÇÕES
    // ================================================================

    // 1. USUÁRIOS
    async function renderUsuarios() {
        await aguardarBanco();
        const clientes = await db.clientes.toArray();
        const alugueisAtivos = await db.alugueis.where('status').equals('ativo').toArray();
        const mapaAluguel = {};
        alugueisAtivos.forEach(a => { mapaAluguel[a.cliente_id] = a.livro; });

        let html = `<div class="card"><h3>Usuários Cadastrados</h3>`;
        if (clientes.length === 0) {
            html += `<p>Nenhum usuário cadastrado.</p>`;
        } else {
            html += `<table>
                <thead><tr><th>Foto</th><th>Nome</th><th>Apelido</th><th>CPF</th><th>Livros Lidos</th><th>Média</th><th>Lendo Agora</th><th>Livro Alugado</th></tr></thead><tbody>`;
            clientes.forEach(c => {
                const livro = mapaAluguel[c.id] || '—';
                const fotoHtml = c.foto ? `<img src="${c.foto}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : '—';
                const media = c.media_estrelas ? c.media_estrelas.toFixed(1) : '—';
                const lendo = c.lendo_agora || '—';
                const livrosLidos = c.livros_lidos || '—';
                const apelido = c.apelido || '—';
                html += `<tr>
                    <td>${fotoHtml}</td>
                    <td>${c.nome}</td>
                    <td>${apelido}</td>
                    <td>${c.cpf}</td>
                    <td>${livrosLidos}</td>
                    <td>${media}</td>
                    <td>${lendo}</td>
                    <td>${livro !== '—' ? `<span class="status-ativo">${livro}</span>` : '—'}</td>
                </tr>`;
            });
            html += `</tbody></table>`;
        }
        html += `</div>`;
        contentArea.innerHTML = html;
    }

    // 2. RELATÓRIO
    async function renderRelatorio() {
        await aguardarBanco();
        const alugueis = await db.alugueis.toArray();
        const clientes = await db.clientes.toArray();
        const mapaClientes = {};
        clientes.forEach(c => { mapaClientes[c.id] = c.nome; });

        alugueis.sort((a, b) => new Date(b.data_locacao) - new Date(a.data_locacao));
        const recentes = alugueis.slice(0, 20);

        const parseData = (str) => {
            if (!str) return null;
            if (str.includes('-') && str.length === 10) {
                const d = new Date(str + 'T00:00:00');
                return isNaN(d) ? null : d;
            }
            if (str.includes('/')) {
                const partes = str.split('/');
                if (partes.length === 3) {
                    const d = new Date(partes[2], partes[1] - 1, partes[0]);
                    return isNaN(d) ? null : d;
                }
            }
            return null;
        };

        let html = `<div class="card"><h3>Últimas Movimentações</h3>`;
        if (recentes.length === 0) {
            html += `<p>Nenhum aluguel registrado ainda.</p>`;
        } else {
            html += `<table>
                <thead><tr>
                    <th>Cliente</th><th>Livro</th><th>Data Locação</th><th>Prev. Devolução</th>
                    <th>Devolução Real</th><th>Status</th><th>Atraso</th><th>Multa</th>
                </tr></thead>
                <tbody>`;
            recentes.forEach(a => {
                const nomeCliente = mapaClientes[a.cliente_id] || 'Desconhecido';
                const status = a.status === 'ativo' ? 'Ativo' : 'Devolvido';
                const statusClass = a.status === 'ativo' ? 'status-ativo' : 'status-devolvido';
                const dataLoc = a.data_locacao.split('-').reverse().join('/');

                const dataPrevista = parseData(a.data_devolucao_prevista);
                const devPrev = dataPrevista ? dataPrevista.toLocaleDateString('pt-BR') : '-';

                const dataReal = parseData(a.data_devolucao_real);
                const devReal = dataReal ? dataReal.toLocaleDateString('pt-BR') : '-';

                let diasAtraso = a.dias_atraso;
                let multa = a.multa;
                if ((diasAtraso === undefined || diasAtraso === null) && dataPrevista && dataReal && dataReal > dataPrevista) {
                    const diffMs = dataReal - dataPrevista;
                    diasAtraso = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    multa = diasAtraso * MULTA_POR_DIA;
                } else {
                    diasAtraso = diasAtraso || 0;
                    multa = multa || 0;
                }

                const atrasoExibicao = diasAtraso > 0 ? `${diasAtraso} dia(s)` : '—';
                const multaExibicao = multa > 0 ? `R$ ${multa.toFixed(2)}` : '—';

                html += `<tr>
                    <td>${nomeCliente}</td>
                    <td>${a.livro}</td>
                    <td>${dataLoc}</td>
                    <td>${devPrev}</td>
                    <td>${devReal}</td>
                    <td class="${statusClass}">${status}</td>
                    <td>${atrasoExibicao}</td>
                    <td>${multaExibicao}</td>
                </tr>`;
            });
            html += `</tbody></table>`;
        }
        html += `</div>`;
        contentArea.innerHTML = html;
    }

    // 3. CATÁLOGO
    async function renderCatalogo() {
        await aguardarBanco();
        const livros = await db.livros.toArray();
        let html = `<div class="card"><h3>Catálogo de Livros (${livros.length})</h3>`;
        if (livros.length === 0) {
            html += `<p>Nenhum livro cadastrado.</p>`;
        } else {
            html += `<table>
                <thead><tr><th>Título</th><th>Autor</th><th>Ano</th><th>Editora</th></tr></thead><tbody>`;
            livros.forEach(l => {
                html += `<tr><td>${l.titulo}</td><td>${l.autor}</td><td>${l.ano}</td><td>${l.editora}</td></tr>`;
            });
            html += `</tbody></table>`;
        }
        html += `</div>`;
        contentArea.innerHTML = html;
    }

    // 4. ADICIONAR LIVROS (NOVO)
    async function renderAdicionarLivros() {
        await aguardarBanco();
        let html = `
            <div class="card">
                <h3>➕ Adicionar Novo Livro</h3>
                <form id="form-adicionar-livro">
                    <div>
                        <label for="novo-titulo">Título</label>
                        <input type="text" id="novo-titulo" placeholder="Nome do livro" required>
                    </div>
                    <div>
                        <label for="novo-autor">Autor</label>
                        <input type="text" id="novo-autor" placeholder="Nome do autor" required>
                    </div>
                    <div>
                        <label for="novo-ano">Ano</label>
                        <input type="number" id="novo-ano" placeholder="Ano de publicação" min="1000" max="2099" required>
                    </div>
                    <div>
                        <label for="novo-editora">Editora</label>
                        <input type="text" id="novo-editora" placeholder="Editora" required>
                    </div>
                    <div class="full-width">
                        <button type="submit">Adicionar Livro</button>
                    </div>
                </form>
            </div>
            <div class="card">
                <h3>📚 Últimos Livros Adicionados</h3>
                <div id="ultimos-livros-adicionados">
                    <p>Carregando...</p>
                </div>
            </div>
        `;
        contentArea.innerHTML = html;

        // Carrega os últimos 5 livros adicionados (mais recentes pelo ID)
        async function carregarUltimosLivros() {
            const livros = await db.livros.toArray();
            const ultimos = livros.sort((a, b) => b.id - a.id).slice(0, 5);
            const container = document.getElementById('ultimos-livros-adicionados');
            if (ultimos.length === 0) {
                container.innerHTML = '<p>Nenhum livro cadastrado ainda.</p>';
                return;
            }
            let tabela = `<table>
                <thead><tr><th>Título</th><th>Autor</th><th>Ano</th><th>Editora</th></tr></thead><tbody>`;
            ultimos.forEach(l => {
                tabela += `<tr><td>${l.titulo}</td><td>${l.autor}</td><td>${l.ano}</td><td>${l.editora}</td></tr>`;
            });
            tabela += `</tbody></table>`;
            container.innerHTML = tabela;
        }
        carregarUltimosLivros();

        // Evento de submit
        document.getElementById('form-adicionar-livro').addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('novo-titulo').value.trim();
            const autor = document.getElementById('novo-autor').value.trim();
            const ano = parseInt(document.getElementById('novo-ano').value);
            const editora = document.getElementById('novo-editora').value.trim();

            if (!titulo || !autor || !ano || !editora) {
                notificar('Preencha todos os campos.', 'erro');
                return;
            }

            const existente = await db.livros.where('titulo').equals(titulo).first();
            if (existente) {
                notificar('Já existe um livro com este título.', 'erro');
                return;
            }

            await db.livros.add({ titulo, autor, ano, editora });
            notificar(`Livro "${titulo}" adicionado com sucesso.`);
            document.getElementById('form-adicionar-livro').reset();
            carregarUltimosLivros();
        });
    }

    // 5. ALUGAR
    async function renderAlugar() {
        await aguardarBanco();
        const clientes = await db.clientes.toArray();
        const livros = await db.livros.toArray();

        let html = `<div class="card"><h3>Realizar Aluguel</h3>
            <form id="form-alugar">
                <div>
                    <label for="cliente-alugar">Cliente</label>
                    <select id="cliente-alugar" required>
                        <option value="">Selecione...</option>`;
        clientes.forEach(c => {
            html += `<option value="${c.id}">${c.nome} (${c.cpf})</option>`;
        });
        html += `</select></div>
                <div>
                    <label for="livro-alugar">Livro</label>
                    <select id="livro-alugar" required>
                        <option value="">Selecione...</option>`;
        livros.forEach(l => {
            html += `<option value="${l.titulo}">${l.titulo}</option>`;
        });
        html += `</select></div>
                <div>
                    <label for="data-locacao">Data de Locação</label>
                    <input type="date" id="data-locacao" required>
                </div>
                <div>
                    <label for="data-devolucao-prevista">Devolução Prevista (automática +7 dias)</label>
                    <input type="text" id="data-devolucao-prevista" readonly placeholder="Automático">
                    <input type="hidden" id="data-devolucao-prevista-iso">
                </div>
                <div class="full-width">
                    <button type="submit">Confirmar Aluguel</button>
                </div>
            </form>
        </div>`;
        contentArea.innerHTML = html;

        document.getElementById('data-locacao').addEventListener('change', function() {
            const data = new Date(this.value + 'T00:00:00');
            if (!isNaN(data)) {
                data.setDate(data.getDate() + 7);
                const iso = data.toISOString().split('T')[0];
                document.getElementById('data-devolucao-prevista').value = data.toLocaleDateString('pt-BR');
                document.getElementById('data-devolucao-prevista-iso').value = iso;
            } else {
                document.getElementById('data-devolucao-prevista').value = '';
                document.getElementById('data-devolucao-prevista-iso').value = '';
            }
        });

        document.getElementById('form-alugar').addEventListener('submit', async (e) => {
            e.preventDefault();
            const clienteId = parseInt(document.getElementById('cliente-alugar').value);
            const livroTitulo = document.getElementById('livro-alugar').value;
            const dataLocacao = document.getElementById('data-locacao').value;
            const dataDevolucaoPrevista = document.getElementById('data-devolucao-prevista-iso').value;

            if (!clienteId || !livroTitulo || !dataLocacao || !dataDevolucaoPrevista) {
                notificar('Preencha todos os campos.', 'erro');
                return;
            }

            const aluguelAtivo = await db.alugueis.where('cliente_id').equals(clienteId).filter(a => a.status === 'ativo').first();
            if (aluguelAtivo) {
                notificar('Cliente já possui um livro alugado.', 'erro');
                return;
            }

            const livroAlugado = await db.alugueis.where('livro').equals(livroTitulo).filter(a => a.status === 'ativo').first();
            if (livroAlugado) {
                notificar('Este livro já está alugado.', 'erro');
                return;
            }

            await db.alugueis.add({
                cliente_id: clienteId,
                livro: livroTitulo,
                data_locacao: dataLocacao,
                data_devolucao_prevista: dataDevolucaoPrevista,
                status: 'ativo'
            });

            notificar(`Aluguel de "${livroTitulo}" realizado com sucesso!`);
            renderAlugar();
        });
    }

    // 6. DEVOLVER
    async function renderDevolver() {
        await aguardarBanco();
        const clientes = await db.clientes.toArray();
        let html = `<div class="card"><h3>Devolução de Livro</h3>
            <form id="form-devolver">
                <div>
                    <label for="cliente-devolver">Cliente</label>
                    <select id="cliente-devolver" required>
                        <option value="">Selecione...</option>`;
        clientes.forEach(c => {
            html += `<option value="${c.id}">${c.nome} (${c.cpf})</option>`;
        });
        html += `</select></div>
                <div>
                    <label for="livro-devolver">Livro Alugado</label>
                    <select id="livro-devolver" required disabled>
                        <option value="">Selecione um cliente primeiro</option>
                    </select>
                </div>
                <div class="full-width">
                    <button type="submit" class="perigo">Confirmar Devolução</button>
                </div>
            </form>
        </div>`;
        contentArea.innerHTML = html;

        const selectCliente = document.getElementById('cliente-devolver');
        const selectLivro = document.getElementById('livro-devolver');

        selectCliente.addEventListener('change', async function() {
            const clienteId = parseInt(this.value);
            if (!clienteId) {
                selectLivro.disabled = true;
                selectLivro.innerHTML = '<option value="">Selecione um cliente primeiro</option>';
                return;
            }
            const alugueisAtivos = await db.alugueis.where('cliente_id').equals(clienteId).filter(a => a.status === 'ativo').toArray();
            selectLivro.disabled = false;
            selectLivro.innerHTML = '<option value="">Selecione o livro...</option>';
            alugueisAtivos.forEach(a => {
                selectLivro.innerHTML += `<option value="${a.id}">${a.livro}</option>`;
            });
            if (alugueisAtivos.length === 0) {
                selectLivro.innerHTML = '<option value="">Nenhum livro alugado</option>';
                selectLivro.disabled = true;
            }
        });

        document.getElementById('form-devolver').addEventListener('submit', async (e) => {
            e.preventDefault();
            const aluguelId = parseInt(document.getElementById('livro-devolver').value);
            if (!aluguelId) {
                notificar('Selecione um livro para devolver.', 'erro');
                return;
            }
            const aluguel = await db.alugueis.get(aluguelId);
            if (!aluguel || aluguel.status !== 'ativo') {
                notificar('Este aluguel não está ativo.', 'erro');
                return;
            }

            const hoje = new Date().toISOString().split('T')[0];
            let diasAtraso = 0, multa = 0;
            if (aluguel.data_devolucao_prevista) {
                const prevista = new Date(aluguel.data_devolucao_prevista + 'T00:00:00');
                const real = new Date(hoje + 'T00:00:00');
                if (real > prevista) {
                    const diffMs = real - prevista;
                    diasAtraso = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    multa = diasAtraso * MULTA_POR_DIA;
                }
            }

            if (diasAtraso > 0) {
                const confirmado = await exibirModalMulta(diasAtraso, multa);
                if (!confirmado) {
                    notificar('Devolução cancelada.', 'aviso');
                    return;
                }
            } else {
                if (!confirm('Devolução dentro do prazo. Confirmar?')) return;
            }

            await db.alugueis.update(aluguelId, {
                status: 'devolvido',
                data_devolucao_real: hoje,
                dias_atraso: diasAtraso,
                multa: multa
            });

            notificar(`Livro "${aluguel.livro}" devolvido com sucesso! Multa: R$ ${multa.toFixed(2)}.`);
            renderDevolver();
        });
    }

    // ===== AUXILIARES =====
    function notificar(mensagem, tipo = 'sucesso') {
        const notif = document.getElementById('notificacao');
        notif.textContent = mensagem;
        notif.className = 'notificacao ' + (tipo === 'erro' ? 'erro' : '');
        notif.style.display = 'block';
        setTimeout(() => { notif.style.display = 'none'; }, 4000);
    }

    window.mascararCPF = function(input) {
        let cpf = input.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        let formatado = cpf;
        if (cpf.length > 3) formatado = cpf.substring(0, 3) + '.' + cpf.substring(3);
        if (cpf.length > 6) formatado = formatado.substring(0, 7) + '.' + cpf.substring(6);
        if (cpf.length > 9) formatado = formatado.substring(0, 11) + '-' + cpf.substring(9);
        input.value = formatado;
    };

    // ===== LOGIN DO ADMIN =====
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value.trim();

        const valido = BIBLIOTECARIOS.some(b => b.usuario === user && b.senha === pass);

        if (valido) {
            sessionStorage.setItem('logado', 'true');
            sessionStorage.setItem('perfil', 'bibliotecario');
            sessionStorage.setItem('usuario', user);
            loginModal.style.display = 'none';
            adminNomeSpan.textContent = user;
            loginError.style.display = 'none';
            document.getElementById('login-form').reset();
            document.querySelector('a[data-section="usuarios"]')?.click();
        } else {
            loginError.style.display = 'block';
        }
    });

    // ===== LOGOUT =====
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = 'index.html';
    });

    // ===== TEMA =====
    const temaBtn = document.getElementById('tema-btn');
    if (temaBtn) {
        const temaSalvo = localStorage.getItem('tema-admin') || 'claro';
        if (temaSalvo === 'escuro') {
            document.body.classList.add('tema-escuro');
            temaBtn.textContent = '☀️';
        }
        temaBtn.addEventListener('click', function() {
            document.body.classList.toggle('tema-escuro');
            const isEscuro = document.body.classList.contains('tema-escuro');
            this.textContent = isEscuro ? '☀️' : '🌙';
            localStorage.setItem('tema-admin', isEscuro ? 'escuro' : 'claro');
        });
    }

    // ================================================================
    // NAVEGAÇÃO (ATUALIZADA)
    // ================================================================
    const menuLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            const titles = {
                'usuarios': 'Usuários',
                'relatorio': 'Relatório',
                'catalogo': 'Catálogo',
                'adicionar-livros': 'Adicionar Livros',
                'alugar': 'Alugar Livro',
                'devolver': 'Devolver'
            };
            sectionTitle.textContent = titles[section] || section;

            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            switch (section) {
                case 'usuarios': renderUsuarios(); break;
                case 'relatorio': renderRelatorio(); break;
                case 'catalogo': renderCatalogo(); break;
                case 'adicionar-livros': renderAdicionarLivros(); break;
                case 'alugar': renderAlugar(); break;
                case 'devolver': renderDevolver(); break;
                default: contentArea.innerHTML = '<p>Seção em desenvolvimento.</p>';
            }
        });
    });

    // ================================================================
    // INICIALIZAÇÃO
    // ================================================================
    if (sessionStorage.getItem('logado') === 'true' && sessionStorage.getItem('perfil') === 'bibliotecario') {
        loginModal.style.display = 'none';
        adminNomeSpan.textContent = sessionStorage.getItem('usuario');
        document.querySelector('a[data-section="usuarios"]')?.click();
    } else {
        loginModal.style.display = 'flex';
        contentArea.innerHTML = '<p>Faça login para acessar o sistema.</p>';
    }
});