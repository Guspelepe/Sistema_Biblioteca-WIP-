// ============================================================
// landing.js – Página de login e registro
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== IMAGEM ALEATÓRIA =====
    const imagens = [
        'static/src/menu/senhorlendo.jpg',
        'static/src/menu/garotalendo.jpg'
    ];
    const imgElement = document.getElementById('imagem-destaque');
    if (imgElement) {
        const randomIndex = Math.floor(Math.random() * imagens.length);
        imgElement.src = imagens[randomIndex];
        imgElement.alt = 'Imagem de leitor';
    }

    // ===== AGUARDA BANCO (definida antes de usar) =====
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

    // ===== EXIBE FRASE DO BANCO =====
    async function exibirFrase() {
        const container = document.getElementById('frase-destaque');
        if (!container) return;
        await aguardarBanco();
        try {
            const frases = await db.frases.toArray();
            if (frases.length === 0) {
                container.innerHTML = '"A leitura é uma aventura sem fim."';
                return;
            }
            const randomIndex = Math.floor(Math.random() * frases.length);
            const frase = frases[randomIndex];
            container.innerHTML = `"${frase.texto}"<br><span style="font-size:0.9rem; font-weight:300; opacity:0.85;">— ${frase.autor}</span>`;
        } catch (e) {
            console.warn('Erro ao carregar frase:', e);
            container.innerHTML = '"A leitura é uma aventura sem fim."';
        }
    }
    // Chama após o banco estar pronto (evita dupla execução)
    exibirFrase();

    // ===== ELEMENTOS DOM =====
    const formLogin = document.getElementById('login-form');
    const erroLogin = document.getElementById('erro');
    const btnAbrirRegistro = document.getElementById('btn-abrir-registro');
    const modalRegistro = document.getElementById('modal-registro');
    const formRegistro = document.getElementById('form-registro');
    const erroRegistro = document.getElementById('erro-registro');
    const btnFecharRegistro = document.getElementById('btn-fechar-registro');

    // ===== VERIFICA SESSÃO =====
    if (sessionStorage.getItem('logado') === 'true') {
        const perfil = sessionStorage.getItem('perfil');
        if (perfil === 'bibliotecario') {
            window.location.href = 'admin.html';
        } else if (perfil === 'usuario') {
            window.location.href = 'user.html';
        }
        return;
    }

    // ===== BUSCA USUÁRIO =====
    async function buscarUsuarioPorIdentificador(identificador) {
        console.log('🔍 Buscando por:', identificador);
        const cpfLimpo = identificador.replace(/\D/g, '');

        // 1. CPF
        if (cpfLimpo.length === 11) {
            const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            try {
                const cliente = await db.clientes.where('cpf').equals(cpfFormatado).first();
                if (cliente) {
                    console.log('✅ Encontrado por CPF:', cliente.nome);
                    return cliente;
                }
            } catch (e) { console.warn('Erro CPF:', e); }
        }

        // 2. Apelido
        try {
            const cliente = await db.clientes.where('apelido').equalsIgnoreCase(identificador).first();
            if (cliente) {
                console.log('✅ Encontrado por apelido:', cliente.nome);
                return cliente;
            }
        } catch (e) { console.warn('Erro apelido:', e); }

        // 3. Nome
        try {
            const cliente = await db.clientes.where('nome').equalsIgnoreCase(identificador).first();
            if (cliente) {
                console.log('✅ Encontrado por nome:', cliente.nome);
                return cliente;
            }
        } catch (e) { console.warn('Erro nome:', e); }

        // 4. Fallback manual
        console.log('🔍 Fallback manual...');
        const todos = await db.clientes.toArray();
        const cliente = todos.find(c => {
            const matchCpf = c.cpf && c.cpf.replace(/\D/g, '') === cpfLimpo;
            const matchNick = c.apelido && c.apelido.toLowerCase() === identificador.toLowerCase();
            const matchNome = c.nome && c.nome.toLowerCase() === identificador.toLowerCase();
            return matchCpf || matchNick || matchNome;
        });
        if (cliente) console.log('✅ Encontrado no fallback:', cliente.nome);
        else console.warn('❌ Nenhum cliente encontrado.');
        return cliente || null;
    }

    // ===== LOGIN (sem backdoor) =====
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        erroLogin.classList.remove('visible');
        erroLogin.style.display = 'none';

        const identificador = document.getElementById('identificador').value.trim();
        const senha = document.getElementById('senha').value.trim();

        try {
            await aguardarBanco();
            const cliente = await buscarUsuarioPorIdentificador(identificador);

            if (cliente && cliente.senha === senha) {
                sessionStorage.setItem('logado', 'true');
                sessionStorage.setItem('perfil', 'usuario');
                sessionStorage.setItem('usuario', cliente.nome);
                sessionStorage.setItem('usuarioId', cliente.id);
                sessionStorage.setItem('cpf', cliente.cpf);
                console.log('✅ Login bem-sucedido! Redirecionando para user.html');
                window.location.href = 'user.html';
            } else {
                erroLogin.textContent = 'Usuário ou senha inválidos.';
                erroLogin.classList.add('visible');
                erroLogin.style.display = 'block';
            }
        } catch (err) {
            console.error('Erro no login:', err);
            erroLogin.textContent = 'Erro ao conectar com o banco de dados. Tente novamente.';
            erroLogin.classList.add('visible');
            erroLogin.style.display = 'block';
        }
    });

    // ===== MODAL =====
    btnAbrirRegistro.addEventListener('click', function() {
        modalRegistro.classList.add('active');
        formRegistro.reset();
        erroRegistro.classList.remove('visible');
        erroRegistro.style.display = 'none';
    });

    btnFecharRegistro.addEventListener('click', function() {
        modalRegistro.classList.remove('active');
    });

    modalRegistro.addEventListener('click', function(e) {
        if (e.target === modalRegistro) modalRegistro.classList.remove('active');
    });

    // ===== MÁSCARA CPF =====
    window.mascararCPF = function(input) {
        let cpf = input.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        let formatado = cpf;
        if (cpf.length > 3) formatado = cpf.substring(0, 3) + '.' + cpf.substring(3);
        if (cpf.length > 6) formatado = formatado.substring(0, 7) + '.' + cpf.substring(6);
        if (cpf.length > 9) formatado = formatado.substring(0, 11) + '-' + cpf.substring(9);
        input.value = formatado;
    };

    // ===== REGISTRO =====
    formRegistro.addEventListener('submit', async function(e) {
        e.preventDefault();
        erroRegistro.classList.remove('visible');
        erroRegistro.style.display = 'none';

        const nome = document.getElementById('reg-nome').value.trim();
        const nick = document.getElementById('reg-nick').value.trim();
        const cpfBruto = document.getElementById('reg-cpf').value.replace(/\D/g, '');
        const senha = document.getElementById('reg-senha').value.trim();
        const foto = document.getElementById('reg-foto').value.trim() || '';

        if (!nome || !nick || cpfBruto.length !== 11 || !senha || senha.length < 4) {
            erroRegistro.textContent = 'Preencha todos os campos corretamente (senha mínimo 4 caracteres).';
            erroRegistro.classList.add('visible');
            erroRegistro.style.display = 'block';
            return;
        }

        try {
            await aguardarBanco();
            const cpfFormatado = cpfBruto.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

            const todos = await db.clientes.toArray();
            if (todos.find(c => c.cpf === cpfFormatado)) {
                erroRegistro.textContent = 'CPF já cadastrado.';
                erroRegistro.classList.add('visible');
                erroRegistro.style.display = 'block';
                return;
            }
            if (todos.find(c => c.apelido && c.apelido.toLowerCase() === nick.toLowerCase())) {
                erroRegistro.textContent = 'Apelido já está em uso. Escolha outro.';
                erroRegistro.classList.add('visible');
                erroRegistro.style.display = 'block';
                return;
            }

            const novoId = await db.clientes.add({
                nome, apelido: nick, cpf: cpfFormatado, foto: foto || '',
                senha, nascimento: '2000-01-01',
                livros_lidos: 0, media_estrelas: 0, lendo_agora: '', bio: ''
            });

            modalRegistro.classList.remove('active');
            sessionStorage.setItem('logado', 'true');
            sessionStorage.setItem('perfil', 'usuario');
            sessionStorage.setItem('usuario', nome);
            sessionStorage.setItem('usuarioId', novoId);
            sessionStorage.setItem('cpf', cpfFormatado);
            window.location.href = 'user.html';

        } catch (err) {
            console.error('Erro no registro:', err);
            erroRegistro.textContent = 'Erro ao cadastrar. Tente novamente.';
            erroRegistro.classList.add('visible');
            erroRegistro.style.display = 'block';
        }
    });

    // ===== MOSTRAR SENHA =====
    window.toggleSenha = function(inputId, botao) {
        const input = document.getElementById(inputId);
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            botao.textContent = '🙈';
        } else {
            input.type = 'password';
            botao.textContent = '👁️';
        }
    };

    console.log('✅ Landing page carregada.');
});