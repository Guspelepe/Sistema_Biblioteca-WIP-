// ============================================================
// admin-app.js – Painel do bibliotecário (login obrigatório)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Admin app iniciado.');

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

    // Limpa qualquer sessão anterior que não seja de bibliotecário
    if (sessionStorage.getItem('perfil') !== 'bibliotecario') {
        sessionStorage.removeItem('logado');
        sessionStorage.removeItem('perfil');
        sessionStorage.removeItem('usuario');
    }

    // ===== FUNÇÕES DE RENDERIZAÇÃO =====
    async function renderUsuarios() {
        await aguardarBanco();
        const clientes = await db.clientes.toArray();
        const alugueisAtivos = await db.alugueis.where({ status: 'ativo' }).toArray();
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

    async function renderRelatorio() {
        await aguardarBanco();
        const alugueis = await db.alugueis.toArray();
        const clientes = await db.clientes.toArray();
        const mapaClientes = {};
        clientes.forEach(c => { mapaClientes[c.id] = c.nome; });

        alugueis.sort((a, b) => new Date(b.data_locacao) - new Date(a.data_locacao));
        const recentes = alugueis.slice(0, 20);

        let html = `<div class="card"><h3>Últimas Movimentações</h3>`;
        if (recentes.length === 0) {
            html += `<p>Nenhum aluguel registrado ainda.</p>`;
        } else {
            html += `<table>
                <thead><tr><th>Cliente</th><th>Livro</th><th>Data Locação</th><th>Status</th><th>Devolução Real</th></tr></thead><tbody>`;
            recentes.forEach(a => {
                const nomeCliente = mapaClientes[a.cliente_id] || 'Desconhecido';
                const status = a.status === 'ativo' ? 'Ativo' : 'Devolvido';
                const statusClass = a.status === 'ativo' ? 'status-ativo' : 'status-devolvido';
                const dataLoc = a.data_locacao.split('-').reverse().join('/');
                const devReal = a.data_devolucao_real ? a.data_devolucao_real.split('-').reverse().join('/') : '-';
                html += `<tr>
                    <td>${nomeCliente}</td>
                    <td>${a.livro}</td>
                    <td>${dataLoc}</td>
                    <td class="${statusClass}">${status}</td>
                    <td>${devReal}</td>
                </tr>`;
            });
            html += `</tbody></table>`;
        }
        html += `</div>`;
        contentArea.innerHTML = html;
    }

    async function renderAlugar() {
        await aguardarBanco();
        const clientes = await db.clientes.toArray();
        const livros = await db.livros.toArray();

        let html = `<div class="card"><h3>Realizar Aluguel</h3>`;
        html += `<form id="form-alugar">
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
        </form>`;
        html += `</div>`;
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
            const dataDevolucaoPrevista = document.getElementById('data-devolucao-prevista').value;
            const dataDevolucaoPrevistaIso = document.getElementById('data-devolucao-prevista-iso').value;

            if (!clienteId || !livroTitulo || !dataLocacao) {
                notificar('Preencha todos os campos.', 'erro');
                return;
            }

            const aluguelAtivo = await db.alugueis.where({ cliente_id: clienteId, status: 'ativo' }).first();
            if (aluguelAtivo) {
                notificar('Cliente já possui um livro alugado.', 'erro');
                return;
            }

            const livroAlugado = await db.alugueis.where({ livro: livroTitulo, status: 'ativo' }).first();
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
            const alugueisAtivos = await db.alugueis.where({ cliente_id: clienteId, status: 'ativo' }).toArray();
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
            await db.alugueis.update(aluguelId, {
                status: 'devolvido',
                data_devolucao_real: new Date().toISOString().split('T')[0]
            });
            notificar(`Livro "${aluguel.livro}" devolvido com sucesso!`);
            renderDevolver();
        });
    }

    function renderCadastroUsuario() {
        let html = `<div class="card"><h3>Cadastrar Novo Usuário</h3>
            <form id="form-cadastro-usuario">
                <div>
                    <label for="nome">Nome Completo</label>
                    <input type="text" id="nome" required>
                </div>
                <div>
                    <label for="cpf">CPF</label>
                    <input type="text" id="cpf" placeholder="000.000.000-00" required maxlength="14" oninput="mascararCPF(this)">
                </div>
                <div>
                    <label for="nascimento">Data de Nascimento</label>
                    <input type="date" id="nascimento" required>
                </div>
                <div>
                    <label for="senha-cliente">Senha</label>
                    <input type="password" id="senha-cliente" placeholder="Mínimo 4 caracteres" required>
                </div>
                <div class="full-width">
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
        </div>`;
        contentArea.innerHTML = html;

        document.getElementById('form-cadastro-usuario').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const cpfBruto = document.getElementById('cpf').value.replace(/\D/g, '');
            const nascimento = document.getElementById('nascimento').value;
            const senha = document.getElementById('senha-cliente').value;

            if (!nome || cpfBruto.length !== 11 || !nascimento || !senha) {
                notificar('Preencha todos os campos corretamente.', 'erro');
                return;
            }
            const cpfFormatado = cpfBruto.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            const existente = await db.clientes.where({ cpf: cpfFormatado }).first();
            if (existente) {
                notificar('CPF já cadastrado.', 'erro');
                return;
            }
            await db.clientes.add({ nome, cpf: cpfFormatado, nascimento, senha });
            notificar(`Usuário ${nome} cadastrado com sucesso!`);
            document.getElementById('form-cadastro-usuario').reset();
            renderUsuarios();
        });
    }

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

    // ===== NAVEGAÇÃO =====
    const menuLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            const titles = {
                'usuarios': 'Usuários',
                'catalogo': 'Catálogo',
                'relatorio': 'Relatório',
                'alugar': 'Alugar Livro',
                'devolver': 'Devolver Livro',
                'cadastro-usuario': 'Novo Usuário'
            };
            sectionTitle.textContent = titles[section] || section;
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            switch (section) {
                case 'usuarios': renderUsuarios(); break;
                case 'catalogo': renderCatalogo(); break;
                case 'relatorio': renderRelatorio(); break;
                case 'alugar': renderAlugar(); break;
                case 'devolver': renderDevolver(); break;
                case 'cadastro-usuario': renderCadastroUsuario(); break;
                default: contentArea.innerHTML = '<p>Seção em desenvolvimento.</p>';
            }
        });
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

    // ===== INICIALIZAÇÃO =====
    if (sessionStorage.getItem('logado') === 'true' && sessionStorage.getItem('perfil') === 'bibliotecario') {
        loginModal.style.display = 'none';
        adminNomeSpan.textContent = sessionStorage.getItem('usuario');
        document.querySelector('a[data-section="usuarios"]')?.click();
    } else {
        loginModal.style.display = 'flex';
        contentArea.innerHTML = '<p>Faça login para acessar o sistema.</p>';
    }
});