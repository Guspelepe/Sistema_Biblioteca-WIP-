// ============================================================
// landing.js – Página de login e registro (com carrossel)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. CARROSSEL DE IMAGENS
    // ==========================================
    const imagens = [
        'static/src/menu/menu1.jpg',
        'static/src/menu/menu2.jpg',
        'static/src/menu/menu3.jpg',
        'static/src/menu/menu4.jpg',
        'static/src/menu/menu5.jpg',
        'static/src/menu/menu6.jpg',
        'static/src/menu/menu7.jpg',
        'static/src/menu/menu8.jpg'
    ];

    let imgIndex = 0;
    const imgElement = document.getElementById('imagem-destaque');
    let imgInterval = null;

    function trocarImagem() {
        if (!imgElement) return;
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgIndex = (imgIndex + 1) % imagens.length;
            imgElement.src = imagens[imgIndex];
            imgElement.alt = 'Imagem de leitor';
            imgElement.style.opacity = '1';
        }, 400);
    }

    function iniciarCarrosselImagens() {
        if (imgElement) {
            imgElement.src = imagens[0];
            imgElement.alt = 'Imagem de leitor';
            imgElement.style.opacity = '1';
            imgElement.style.transition = 'opacity 0.5s ease';
            if (imgInterval) clearInterval(imgInterval);
            imgInterval = setInterval(trocarImagem, 5000);
        }
    }

    // ==========================================
    // 2. CARROSSEL DE FRASES
    // ==========================================
    const FRASES_FALLBACK = [
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

    let frases = [];
    let fraseIndex = 0;
    const fraseContainer = document.getElementById('frase-destaque');
    let fraseInterval = null;

    async function carregarFrases() {
        try {
            await aguardarBanco();
            const frasesDB = await db.frases.toArray();
            if (frasesDB.length > 0) {
                frases = frasesDB;
            } else {
                frases = FRASES_FALLBACK;
            }
        } catch (e) {
            console.warn('Erro ao carregar frases do banco, usando fallback:', e);
            frases = FRASES_FALLBACK;
        }
        if (frases.length === 0) {
            frases = [{ texto: "A leitura é uma aventura sem fim.", autor: "Desconhecido" }];
        }
        exibirFrasePorIndex(0);
    }

    function exibirFrasePorIndex(index) {
        if (!fraseContainer || frases.length === 0) return;
        const frase = frases[index % frases.length];
        fraseContainer.style.opacity = '0';
        setTimeout(() => {
            fraseContainer.innerHTML = `"${frase.texto}"<br><span style="font-size:0.9rem; font-weight:300; opacity:0.85;">— ${frase.autor}</span>`;
            fraseContainer.style.opacity = '1';
        }, 300);
    }

    function trocarFrase() {
        if (frases.length === 0) return;
        fraseIndex = (fraseIndex + 1) % frases.length;
        exibirFrasePorIndex(fraseIndex);
    }

    function iniciarCarrosselFrases() {
        if (fraseContainer) {
            fraseContainer.style.transition = 'opacity 0.5s ease';
            carregarFrases().then(() => {
                if (fraseInterval) clearInterval(fraseInterval);
                fraseInterval = setInterval(trocarFrase, 5000);
            });
        }
    }

    // ==========================================
    // 3. ELEMENTOS DOM
    // ==========================================
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

    // ===== INICIA OS CARROSSÉIS =====
    iniciarCarrosselImagens();
    iniciarCarrosselFrases();

    // ===== BUSCA USUÁRIO =====
    async function buscarUsuarioPorIdentificador(identificador) {
        console.warn('🔍 Buscando por:', identificador);
        const cpfLimpo = identificador.replace(/\D/g, '');

        if (cpfLimpo.length === 11) {
            const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            try {
                const cliente = await db.clientes.where('cpf').equals(cpfFormatado).first();
                if (cliente) {
                    console.warn('✅ Encontrado por CPF:', cliente.nome);
                    return cliente;
                }
            } catch (e) { console.warn('Erro CPF:', e); }
        }

        try {
            const cliente = await db.clientes.where('apelido').equalsIgnoreCase(identificador).first();
            if (cliente) {
                console.warn('✅ Encontrado por apelido:', cliente.nome);
                return cliente;
            }
        } catch (e) { console.warn('Erro apelido:', e); }

        try {
            const cliente = await db.clientes.where('nome').equalsIgnoreCase(identificador).first();
            if (cliente) {
                console.warn('✅ Encontrado por nome:', cliente.nome);
                return cliente;
            }
        } catch (e) { console.warn('Erro nome:', e); }

        console.warn('🔍 Fallback manual...');
        const todos = await db.clientes.toArray();
        const cliente = todos.find(c => {
            const matchCpf = c.cpf && c.cpf.replace(/\D/g, '') === cpfLimpo;
            const matchNick = c.apelido && c.apelido.toLowerCase() === identificador.toLowerCase();
            const matchNome = c.nome && c.nome.toLowerCase() === identificador.toLowerCase();
            return matchCpf || matchNick || matchNome;
        });
        if (cliente) console.warn('✅ Encontrado no fallback:', cliente.nome);
        else console.warn('❌ Nenhum cliente encontrado.');
        return cliente || null;
    }

    // ===== LOGIN (COM BACKDOOR DO BIBLIOTECÁRIO) =====
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        erroLogin.classList.remove('visible');
        erroLogin.style.display = 'none';

        const identificador = document.getElementById('identificador').value.trim();
        const senha = document.getElementById('senha').value.trim();

        // ===== BACKDOOR DO BIBLIOTECÁRIO =====
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
                console.warn('✅ Login bem-sucedido! Redirecionando para user.html');
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
        const spanCpf = document.getElementById('msg-cpf');
        const spanNick = document.getElementById('msg-nick');
        if (spanCpf) spanCpf.textContent = '';
        if (spanNick) spanNick.textContent = '';
    });

    btnFecharRegistro.addEventListener('click', function() {
        modalRegistro.classList.remove('active');
    });

    modalRegistro.addEventListener('click', function(e) {
        if (e.target === modalRegistro) modalRegistro.classList.remove('active');
    });

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    document.getElementById('reg-cpf').addEventListener('blur', async function() {
        const cpfBruto = this.value.replace(/\D/g, '');
        const span = document.getElementById('msg-cpf');
        if (!span) return;
        if (cpfBruto.length === 11 && validarCPF(cpfBruto)) {
            await aguardarBanco();
            const cpfFormatado = cpfBruto.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            const existente = await db.clientes.where('cpf').equals(cpfFormatado).first();
            span.textContent = existente ? '❌ CPF já cadastrado.' : '✅ CPF disponível.';
            span.style.color = existente ? '#e74c3c' : '#27ae60';
        } else {
            span.textContent = cpfBruto.length > 0 ? '❌ CPF inválido.' : '';
            span.style.color = '#e74c3c';
        }
    });

    document.getElementById('reg-nick').addEventListener('blur', async function() {
        const nick = this.value.trim();
        const span = document.getElementById('msg-nick');
        if (!span) return;
        if (!nick) {
            span.textContent = '';
            return;
        }
        await aguardarBanco();
        const todos = await db.clientes.toArray();
        const existente = todos.find(c => c.apelido && c.apelido.toLowerCase() === nick.toLowerCase());
        span.textContent = existente ? '❌ Apelido já está em uso.' : '✅ Apelido disponível.';
        span.style.color = existente ? '#e74c3c' : '#27ae60';
    });

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
        const nascimento = document.getElementById('reg-nascimento').value;

        if (!nome || !nick || cpfBruto.length !== 11 || !nascimento || !senha || senha.length < 4) {
            erroRegistro.textContent = 'Preencha todos os campos corretamente (senha mínimo 4 caracteres).';
            erroRegistro.classList.add('visible');
            erroRegistro.style.display = 'block';
            return;
        }

        if (!validarCPF(cpfBruto)) {
            erroRegistro.textContent = 'CPF inválido. Verifique os dígitos.';
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
                senha, nascimento: nascimento,
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

    console.warn('✅ Landing page carregada com carrossel.');
});