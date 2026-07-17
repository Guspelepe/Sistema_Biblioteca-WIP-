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

    // ===== ELEMENTOS DO DOM =====
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

    // ===== AGUARDA BANCO =====
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

    // ===== BUSCA USUÁRIO (fallback manual garantido) =====
    async function buscarUsuarioPorIdentificador(identificador) {
        console.log('🔍 Buscando por:', identificador);
        const cpfLimpo = identificador.replace(/\D/g, '');

        // 1. Busca por CPF
        if (cpfLimpo.length === 11) {
            const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            try {
                const cliente = await db.clientes.where('cpf').equals(cpfFormatado).first();
                if (cliente) {
                    console.log('✅ Encontrado por CPF:', cliente.nome);
                    return cliente;
                }
            } catch (e) {
                console.warn('Erro na busca por CPF:', e);
            }
        }

        // 2. Tenta por apelido (índice, fallback manual)
        try {
            const cliente = await db.clientes.where('apelido').equalsIgnoreCase(identificador).first();
            if (cliente) {
                console.log('✅ Encontrado por apelido:', cliente.nome);
                return cliente;
            }
        } catch (e) {
            console.warn('Índice "apelido" não encontrado, usando fallback manual.');
        }

        // 3. Tenta por nome (índice, fallback manual)
        try {
            const cliente = await db.clientes.where('nome').equalsIgnoreCase(identificador).first();
            if (cliente) {
                console.log('✅ Encontrado por nome:', cliente.nome);
                return cliente;
            }
        } catch (e) {
            console.warn('Índice "nome" não encontrado, usando fallback manual.');
        }

        // 4. FALLBACK: percorre todos os clientes
        console.log('🔍 Usando fallback manual (percorrendo todos os clientes)...');
        const todos = await db.clientes.toArray();
        console.log(`📋 ${todos.length} clientes carregados.`);
        const cliente = todos.find(c => {
            const matchCpf = c.cpf && c.cpf.replace(/\D/g, '') === cpfLimpo;
            const matchNick = c.apelido && c.apelido.toLowerCase() === identificador.toLowerCase();
            const matchNome = c.nome && c.nome.toLowerCase() === identificador.toLowerCase();
            return matchCpf || matchNick || matchNome;
        });

        if (cliente) {
            console.log('✅ Encontrado no fallback:', cliente.nome);
        } else {
            console.warn('❌ Nenhum cliente encontrado.');
        }
        return cliente || null;
    }

    // ===== LOGIN =====
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        erroLogin.style.display = 'none';

        const identificador = document.getElementById('identificador').value.trim();
        const senha = document.getElementById('senha').value.trim();

        // Bibliotecário
        if (identificador === 'ACESSORESTRITO' && senha === '1234') {
            sessionStorage.setItem('logado', 'true');
            sessionStorage.setItem('perfil', 'bibliotecario');
            sessionStorage.setItem('usuario', 'Bibliotecário');
            window.location.href = 'admin.html';
            return;
        }

        try {
            await aguardarBanco();
            const cliente = await buscarUsuarioPorIdentificador(identificador);

            if (cliente && cliente.senha === senha) {
                sessionStorage.setItem('logado', 'true');
                sessionStorage.setItem('perfil', 'usuario');
                sessionStorage.setItem('usuario', cliente.nome);
                sessionStorage.setItem('usuarioId', cliente.id);
                sessionStorage.setItem('cpf', cliente.cpf);
                window.location.href = 'user.html';
            } else {
                erroLogin.textContent = 'Usuário ou senha inválidos.';
                erroLogin.style.display = 'block';
            }
        } catch (err) {
            console.error('Erro no login:', err);
            erroLogin.textContent = 'Erro ao conectar com o banco de dados. Tente novamente.';
            erroLogin.style.display = 'block';
        }
    });

    // ===== ABRIR MODAL =====
    btnAbrirRegistro.addEventListener('click', function() {
        modalRegistro.classList.add('active');
        formRegistro.reset();
        erroRegistro.style.display = 'none';
    });

    // ===== FECHAR MODAL =====
    btnFecharRegistro.addEventListener('click', function() {
        modalRegistro.classList.remove('active');
    });
    modalRegistro.addEventListener('click', function(e) {
        if (e.target === modalRegistro) {
            modalRegistro.classList.remove('active');
        }
    });

    // ===== MÁSCARA DE CPF =====
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
        erroRegistro.style.display = 'none';

        const nome = document.getElementById('reg-nome').value.trim();
        const nick = document.getElementById('reg-nick').value.trim();
        const cpfBruto = document.getElementById('reg-cpf').value.replace(/\D/g, '');
        const senha = document.getElementById('reg-senha').value.trim();
        const foto = document.getElementById('reg-foto').value.trim() || '';

        if (!nome || !nick || cpfBruto.length !== 11 || !senha || senha.length < 4) {
            erroRegistro.textContent = 'Preencha todos os campos corretamente (senha mínimo 4 caracteres).';
            erroRegistro.style.display = 'block';
            return;
        }

        try {
            await aguardarBanco();

            const cpfFormatado = cpfBruto.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

            // Verifica duplicatas manualmente
            const todos = await db.clientes.toArray();
            const cpfExistente = todos.find(c => c.cpf === cpfFormatado);
            if (cpfExistente) {
                erroRegistro.textContent = 'CPF já cadastrado.';
                erroRegistro.style.display = 'block';
                return;
            }

            const nickExistente = todos.find(c => c.apelido && c.apelido.toLowerCase() === nick.toLowerCase());
            if (nickExistente) {
                erroRegistro.textContent = 'Apelido já está em uso. Escolha outro.';
                erroRegistro.style.display = 'block';
                return;
            }

            // Cria usuário
            const novoId = await db.clientes.add({
                nome,
                apelido: nick,
                cpf: cpfFormatado,
                foto: foto || '',
                senha,
                nascimento: '2000-01-01',
                livros_lidos: 0,
                media_estrelas: 0,
                lendo_agora: ''
            });

            modalRegistro.classList.remove('active');

            // Login automático
            sessionStorage.setItem('logado', 'true');
            sessionStorage.setItem('perfil', 'usuario');
            sessionStorage.setItem('usuario', nome);
            sessionStorage.setItem('usuarioId', novoId);
            sessionStorage.setItem('cpf', cpfFormatado);
            window.location.href = 'user.html';

        } catch (err) {
            console.error('Erro no registro:', err);
            erroRegistro.textContent = 'Erro ao cadastrar. Tente novamente.';
            erroRegistro.style.display = 'block';
        }
    });
});