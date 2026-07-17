// ============================================================
// landing.js – Página de login e registro
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. IMAGEM ALEATÓRIA (senhorlendo.jpg / garotalendo.jpg)
    // ==========================================
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

    // ==========================================
    // 2. FRASES FAMOSAS DE LIVROS (30 frases)
    // ==========================================
    const FRASES = [
        { texto: "A leitura é uma forma de viajar sem sair do lugar.", autor: "Eça de Queirós" },
        { texto: "Ler é sonhar pela mão de outro.", autor: "Fernando Pessoa" },
        { texto: "O livro é um mestre que fala sem voz.", autor: "Provérbio chinês" },
        { texto: "A vida é muito curta para ser pequena.", autor: "Benjamin Disraeli" },
        { texto: "Não há nada mais prazeroso do que aprender.", autor: "Marcus Tullius Cicero" },
        { texto: "O que vale na vida não é o ponto de partida, mas a caminhada.", autor: "Milton Nascimento" },
        { texto: "A imaginação governa o mundo.", autor: "Napoleão Bonaparte" },
        { texto: "Quem lê vive muitas vidas.", autor: "George R.R. Martin" },
        { texto: "Um leitor vive mil vidas antes de morrer.", autor: "George R.R. Martin" },
        { texto: "A leitura é para a mente o que o exercício é para o corpo.", autor: "Joseph Addison" },
        { texto: "O importante é não parar de questionar.", autor: "Albert Einstein" },
        { texto: "A beleza está nos olhos de quem vê.", autor: "Oscar Wilde" },
        { texto: "A esperança é a última que morre.", autor: "Provérbio" },
        { texto: "Não existem limites para o conhecimento.", autor: "Carl Sagan" },
        { texto: "A verdade é como o sol: pode ser ofuscante, mas não pode ser negada.", autor: "Buda" },
        { texto: "Ler é abrir uma porta para o mundo.", autor: "Monteiro Lobato" },
        { texto: "O saber não ocupa lugar.", autor: "Provérbio" },
        { texto: "A vida é uma viagem, não um destino.", autor: "Ralph Waldo Emerson" },
        { texto: "O amor é a única força capaz de transformar um inimigo em amigo.", autor: "Martin Luther King" },
        { texto: "A verdadeira viagem de descobrimento não consiste em procurar novas paisagens, mas em ter novos olhos.", autor: "Marcel Proust" },
        { texto: "A leitura nos dá asas para voar.", autor: "Victor Hugo" },
        { texto: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.", autor: "Eleanor Roosevelt" },
        { texto: "A gentileza é a linguagem que o surdo ouve e o cego vê.", autor: "Mark Twain" },
        { texto: "A vida é o que acontece enquanto você faz planos.", autor: "John Lennon" },
        { texto: "Não tenha medo de ser feliz.", autor: "Chico Xavier" },
        { texto: "O destino não é uma questão de sorte, mas de escolha.", autor: "William Jennings Bryan" },
        { texto: "A criatividade é a inteligência se divertindo.", autor: "Albert Einstein" },
        { texto: "A força não vem da capacidade física, mas de uma vontade indomável.", autor: "Mahatma Gandhi" },
        { texto: "A jornada mais longa começa com um único passo.", autor: "Lao Tsé" },
        { texto: "O coração tem razões que a própria razão desconhece.", autor: "Blaise Pascal" }
    ];

    function exibirFrase() {
        const container = document.getElementById('frase-destaque');
        if (!container) return;
        const randomIndex = Math.floor(Math.random() * FRASES.length);
        const frase = FRASES[randomIndex];
        container.innerHTML = `"${frase.texto}"<br><span style="font-size:0.9rem; font-weight:300; opacity:0.85;">— ${frase.autor}</span>`;
    }

    // Chama a função para exibir uma frase aleatória
    exibirFrase();

    // ==========================================
    // 3. ELEMENTOS DO DOM
    // ==========================================
    const formLogin = document.getElementById('login-form');
    const erroLogin = document.getElementById('erro');
    const btnAbrirRegistro = document.getElementById('btn-abrir-registro');
    const modalRegistro = document.getElementById('modal-registro');
    const formRegistro = document.getElementById('form-registro');
    const erroRegistro = document.getElementById('erro-registro');
    const btnFecharRegistro = document.getElementById('btn-fechar-registro');

    // ==========================================
    // 4. VERIFICA SESSÃO (redireciona se já logado)
    // ==========================================
    if (sessionStorage.getItem('logado') === 'true') {
        const perfil = sessionStorage.getItem('perfil');
        if (perfil === 'bibliotecario') {
            window.location.href = 'admin.html';
        } else if (perfil === 'usuario') {
            window.location.href = 'user.html';
        }
        return;
    }

    // ==========================================
    // 5. FUNÇÃO PARA AGUARDAR O BANCO FICAR PRONTO
    // ==========================================
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

    // ==========================================
    // 6. FUNÇÃO PARA BUSCAR USUÁRIO (fallback manual)
    // ==========================================
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

        // 2. Busca por apelido (índice, fallback manual)
        try {
            const cliente = await db.clientes.where('apelido').equalsIgnoreCase(identificador).first();
            if (cliente) {
                console.log('✅ Encontrado por apelido:', cliente.nome);
                return cliente;
            }
        } catch (e) {
            console.warn('Índice "apelido" não encontrado, usando fallback manual.');
        }

        // 3. Busca por nome (índice, fallback manual)
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

    // ==========================================
    // 7. LOGIN
    // ==========================================
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        erroLogin.style.display = 'none';

        const identificador = document.getElementById('identificador').value.trim();
        const senha = document.getElementById('senha').value.trim();

        // Login do bibliotecário (credenciais fixas)
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
                erroLogin.classList.add('visible');
            }
        } catch (err) {
            console.error('Erro no login:', err);
            erroLogin.textContent = 'Erro ao conectar com o banco de dados. Tente novamente.';
            erroLogin.classList.add('visible');
        }
    });

    // ==========================================
    // 8. ABRIR / FECHAR MODAL DE REGISTRO
    // ==========================================
    btnAbrirRegistro.addEventListener('click', function() {
        modalRegistro.classList.add('active');
        formRegistro.reset();
        erroRegistro.style.display = 'none';
        erroRegistro.classList.remove('visible');
    });

    btnFecharRegistro.addEventListener('click', function() {
        modalRegistro.classList.remove('active');
    });

    modalRegistro.addEventListener('click', function(e) {
        if (e.target === modalRegistro) {
            modalRegistro.classList.remove('active');
        }
    });

    // ==========================================
    // 9. MÁSCARA DE CPF
    // ==========================================
    window.mascararCPF = function(input) {
        let cpf = input.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        let formatado = cpf;
        if (cpf.length > 3) formatado = cpf.substring(0, 3) + '.' + cpf.substring(3);
        if (cpf.length > 6) formatado = formatado.substring(0, 7) + '.' + cpf.substring(6);
        if (cpf.length > 9) formatado = formatado.substring(0, 11) + '-' + cpf.substring(9);
        input.value = formatado;
    };

    // ==========================================
    // 10. REGISTRO DE NOVO USUÁRIO
    // ==========================================
    formRegistro.addEventListener('submit', async function(e) {
        e.preventDefault();
        erroRegistro.style.display = 'none';
        erroRegistro.classList.remove('visible');

        const nome = document.getElementById('reg-nome').value.trim();
        const nick = document.getElementById('reg-nick').value.trim();
        const cpfBruto = document.getElementById('reg-cpf').value.replace(/\D/g, '');
        const senha = document.getElementById('reg-senha').value.trim();
        const foto = document.getElementById('reg-foto').value.trim() || '';

        if (!nome || !nick || cpfBruto.length !== 11 || !senha || senha.length < 4) {
            erroRegistro.textContent = 'Preencha todos os campos corretamente (senha mínimo 4 caracteres).';
            erroRegistro.classList.add('visible');
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
                erroRegistro.classList.add('visible');
                return;
            }

            const nickExistente = todos.find(c => c.apelido && c.apelido.toLowerCase() === nick.toLowerCase());
            if (nickExistente) {
                erroRegistro.textContent = 'Apelido já está em uso. Escolha outro.';
                erroRegistro.classList.add('visible');
                return;
            }

            // Cria o usuário
            const novoId = await db.clientes.add({
                nome,
                apelido: nick,
                cpf: cpfFormatado,
                foto: foto || '',
                senha,
                nascimento: '2000-01-01',
                livros_lidos: 0,
                media_estrelas: 0,
                lendo_agora: '',
                bio: ''
            });

            // Fecha o modal
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
            erroRegistro.classList.add('visible');
        }
    });

    // ==========================================
    // 11. FUNÇÃO PARA MOSTRAR/OCULTAR SENHA (global)
    // ==========================================
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