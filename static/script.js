// ============ CONFIGURAÇÃO DO BANCO (IndexedDB com Dexie) ============
const db = new Dexie('BibliotecaDB');

// Versão 3 – adiciona tabelas 'livros' e 'solicitacoes'
db.version(3).stores({
    clientes: '++id, cpf',
    alugueis: '++id, cliente_id, status, livro',
    livros: '++id, titulo',
    solicitacoes: '++id, usuario_id'
});

// Lista inicial de livros (será inserida apenas se a tabela estiver vazia)
const LIVROS_INICIAIS = [
    { titulo: "1984 - George Orwell", autor: "George Orwell", ano: 1949, editora: "Companhia das Letras" },
    { titulo: "A Bagaceira - José Américo de Almeida", autor: "José Américo de Almeida", ano: 1928, editora: "Record" },
    { titulo: "A Culpa é das Estrelas - John Green", autor: "John Green", ano: 2012, editora: "Intrínseca" },
    { titulo: "A Dança da Morte - Stephen King", autor: "Stephen King", ano: 1978, editora: "Suma" },
    { titulo: "A Divina Comédia - Dante Alighieri", autor: "Dante Alighieri", ano: 1320, editora: "34" },
    { titulo: "A Garota no Trem - Paula Hawkins", autor: "Paula Hawkins", ano: 2015, editora: "Record" },
    { titulo: "A Hora da Estrela - Clarice Lispector", autor: "Clarice Lispector", ano: 1977, editora: "Rocco" },
    { titulo: "A Menina que Roubava Livros - Markus Zusak", autor: "Markus Zusak", ano: 2005, editora: "Intrínseca" },
    { titulo: "A Metamorfose - Franz Kafka", autor: "Franz Kafka", ano: 1915, editora: "Companhia das Letras" },
    { titulo: "A Moreninha - Joaquim Manuel de Macedo", autor: "Joaquim Manuel de Macedo", ano: 1844, editora: "Ática" },
    { titulo: "A Náusea - Jean-Paul Sartre", autor: "Jean-Paul Sartre", ano: 1938, editora: "Nova Fronteira" },
    { titulo: "A Peste - Albert Camus", autor: "Albert Camus", ano: 1947, editora: "Record" },
    { titulo: "A Revolução dos Bichos - George Orwell", autor: "George Orwell", ano: 1945, editora: "Companhia das Letras" },
    { titulo: "A Seleção - Kiera Cass", autor: "Kiera Cass", ano: 2012, editora: "Seguinte" },
    { titulo: "A Sombra do Vento - Carlos Ruiz Zafón", autor: "Carlos Ruiz Zafón", ano: 2001, editora: "Suma" },
    { titulo: "Admirável Mundo Novo - Aldous Huxley", autor: "Aldous Huxley", ano: 1932, editora: "Globo" },
    { titulo: "Água Viva - Clarice Lispector", autor: "Clarice Lispector", ano: 1973, editora: "Rocco" },
    { titulo: "Angústia - Graciliano Ramos", autor: "Graciliano Ramos", ano: 1936, editora: "Record" },
    { titulo: "Anjos e Demônios - Dan Brown", autor: "Dan Brown", ano: 2000, editora: "Arqueiro" },
    { titulo: "Anna Kariênina - Liev Tolstói", autor: "Liev Tolstói", ano: 1877, editora: "Companhia das Letras" },
    { titulo: "Anne de Green Gables - Lucy Maud Montgomery", autor: "Lucy Maud Montgomery", ano: 1908, editora: "Principis" },
    { titulo: "As Aventuras de Tom Sawyer - Mark Twain", autor: "Mark Twain", ano: 1876, editora: "Penguin" },
    { titulo: "As Crônicas de Nárnia - C.S. Lewis", autor: "C.S. Lewis", ano: 1950, editora: "HarperCollins" },
    { titulo: "As Vinhas da Ira - John Steinbeck", autor: "John Steinbeck", ano: 1939, editora: "Record" },
    { titulo: "Brasil: Uma Biografia - Lilia M. Schwarcz & Heloisa M. Starling", autor: "Lilia M. Schwarcz", ano: 2015, editora: "Companhia das Letras" },
    { titulo: "Capitães da Areia - Jorge Amado", autor: "Jorge Amado", ano: 1937, editora: "Companhia das Letras" },
    { titulo: "Carrie, a Estranha - Stephen King", autor: "Stephen King", ano: 1974, editora: "Suma" },
    { titulo: "Casa-Grande & Senzala - Gilberto Freyre", autor: "Gilberto Freyre", ano: 1933, editora: "Global" },
    { titulo: "Cem Anos de Solidão - Gabriel García Márquez", autor: "Gabriel García Márquez", ano: 1967, editora: "Record" },
    { titulo: "Cidades de Papel - John Green", autor: "John Green", ano: 2008, editora: "Intrínseca" },
    { titulo: "Clube da Luta - Chuck Palahniuk", autor: "Chuck Palahniuk", ano: 1996, editora: "LeYa" },
    { titulo: "Crime e Castigo - Fiódor Dostoiévski", autor: "Fiódor Dostoiévski", ano: 1866, editora: "34" },
    { titulo: "Divergente - Veronica Roth", autor: "Veronica Roth", ano: 2011, editora: "Rocco" },
    { titulo: "Dom Casmurro - Machado de Assis", autor: "Machado de Assis", ano: 1899, editora: "Companhia das Letras" },
    { titulo: "Dom Quixote - Miguel de Cervantes", autor: "Miguel de Cervantes", ano: 1605, editora: "34" },
    { titulo: "Doutor Jivago - Boris Pasternak", autor: "Boris Pasternak", ano: 1957, editora: "Companhia das Letras" },
    { titulo: "Doutor Sono - Stephen King", autor: "Stephen King", ano: 2013, editora: "Suma" },
    { titulo: "Ensaio sobre a Cegueira - José Saramago", autor: "José Saramago", ano: 1995, editora: "Companhia das Letras" },
    { titulo: "Extraordinário - R.J. Palacio", autor: "R.J. Palacio", ano: 2012, editora: "Intrínseca" },
    { titulo: "Fahrenheit 451 - Ray Bradbury", autor: "Ray Bradbury", ano: 1953, editora: "Globo" },
    { titulo: "Fortaleza Digital - Dan Brown", autor: "Dan Brown", ano: 1998, editora: "Arqueiro" },
    { titulo: "Gabriela, Cravo e Canela - Jorge Amado", autor: "Jorge Amado", ano: 1958, editora: "Companhia das Letras" },
    { titulo: "Grande Sertão: Veredas - João Guimarães Rosa", autor: "João Guimarães Rosa", ano: 1956, editora: "Nova Fronteira" },
    { titulo: "Guerra e Paz - Liev Tolstói", autor: "Liev Tolstói", ano: 1869, editora: "Companhia das Letras" },
    { titulo: "Hamlet - William Shakespeare", autor: "William Shakespeare", ano: 1603, editora: "L&PM" },
    { titulo: "Harry Potter e a Pedra Filosofal - J.K. Rowling", autor: "J.K. Rowling", ano: 1997, editora: "Rocco" },
    { titulo: "Inferno - Dan Brown", autor: "Dan Brown", ano: 2013, editora: "Arqueiro" },
    { titulo: "Iracema - José de Alencar", autor: "José de Alencar", ano: 1865, editora: "Ática" },
    { titulo: "It: A Coisa - Stephen King", autor: "Stephen King", ano: 1986, editora: "Suma" },
    { titulo: "Jane Eyre - Charlotte Brontë", autor: "Charlotte Brontë", ano: 1847, editora: "Penguin" },
    { titulo: "Jogos Vorazes - Suzanne Collins", autor: "Suzanne Collins", ano: 2008, editora: "Rocco" },
    { titulo: "Lira dos Vinte Anos - Álvares de Azevedo", autor: "Álvares de Azevedo", ano: 1853, editora: "Ática" },
    { titulo: "Lolita - Vladimir Nabokov", autor: "Vladimir Nabokov", ano: 1955, editora: "Companhia das Letras" },
    { titulo: "Lucíola - José de Alencar", autor: "José de Alencar", ano: 1862, editora: "Ática" },
    { titulo: "Macunaíma - Mário de Andrade", autor: "Mário de Andrade", ano: 1928, editora: "Companhia das Letras" },
    { titulo: "Marina - Carlos Ruiz Zafón", autor: "Carlos Ruiz Zafón", ano: 1999, editora: "Suma" },
    { titulo: "Memorial de Aires - Machado de Assis", autor: "Machado de Assis", ano: 1908, editora: "Companhia das Letras" },
    { titulo: "Memórias Póstumas de Brás Cubas - Machado de Assis", autor: "Machado de Assis", ano: 1881, editora: "Companhia das Letras" },
    { titulo: "Moby Dick - Herman Melville", autor: "Herman Melville", ano: 1851, editora: "Cosac Naify" },
    { titulo: "Morte e Vida Severina - João Cabral de Melo Neto", autor: "João Cabral de Melo Neto", ano: 1955, editora: "Nova Fronteira" },
    { titulo: "Noite na Taverna - Álvares de Azevedo", autor: "Álvares de Azevedo", ano: 1855, editora: "Ática" },
    { titulo: "O Alienista - Machado de Assis", autor: "Machado de Assis", ano: 1882, editora: "Companhia das Letras" },
    { titulo: "O Apanhador no Campo de Centeio - J.D. Salinger", autor: "J.D. Salinger", ano: 1951, editora: "Editora do Autor" },
    { titulo: "O Auto da Compadecida - Ariano Suassuna", autor: "Ariano Suassuna", ano: 1955, editora: "Agir" },
    { titulo: "O Código Da Vinci - Dan Brown", autor: "Dan Brown", ano: 2003, editora: "Arqueiro" },
    { titulo: "O Conde de Monte Cristo - Alexandre Dumas", autor: "Alexandre Dumas", ano: 1844, editora: "Zahar" },
    { titulo: "O Cortiço - Aluísio Azevedo", autor: "Aluísio Azevedo", ano: 1890, editora: "Ática" },
    { titulo: "O Diário de Anne Frank - Anne Frank", autor: "Anne Frank", ano: 1947, editora: "Record" },
    { titulo: "O Estrangeiro - Albert Camus", autor: "Albert Camus", ano: 1942, editora: "Record" },
    { titulo: "O Grande Gatsby - F. Scott Fitzgerald", autor: "F. Scott Fitzgerald", ano: 1925, editora: "Penguin" },
    { titulo: "O Guarani - José de Alencar", autor: "José de Alencar", ano: 1857, editora: "Ática" },
    { titulo: "O Hobbit - J.R.R. Tolkien", autor: "J.R.R. Tolkien", ano: 1937, editora: "HarperCollins" },
    { titulo: "O Homem que Calculava - Malba Tahan", autor: "Malba Tahan", ano: 1938, editora: "Record" },
    { titulo: "O Iluminado - Stephen King", autor: "Stephen King", ano: 1977, editora: "Suma" },
    { titulo: "O Jogo do Anjo - Carlos Ruiz Zafón", autor: "Carlos Ruiz Zafón", ano: 2008, editora: "Suma" },
    { titulo: "O Lobo da Estepe - Hermann Hesse", autor: "Hermann Hesse", ano: 1927, editora: "Record" },
    { titulo: "O Morro dos Ventos Uivantes - Emily Brontë", autor: "Emily Brontë", ano: 1847, editora: "Penguin" },
    { titulo: "O Nome da Rosa - Umberto Eco", autor: "Umberto Eco", ano: 1980, editora: "Record" },
    { titulo: "O Pagador de Promessas - Dias Gomes", autor: "Dias Gomes", ano: 1960, editora: "Bertrand Brasil" },
    { titulo: "O Pequeno Príncipe - Antoine de Saint-Exupéry", autor: "Antoine de Saint-Exupéry", ano: 1943, editora: "Agir" },
    { titulo: "O Perfume - Patrick Süskind", autor: "Patrick Süskind", ano: 1985, editora: "Record" },
    { titulo: "O Povo Brasileiro - Darcy Ribeiro", autor: "Darcy Ribeiro", ano: 1995, editora: "Companhia das Letras" },
    { titulo: "O Processo - Franz Kafka", autor: "Franz Kafka", ano: 1925, editora: "Companhia das Letras" },
    { titulo: "O Quinze - Rachel de Queiroz", autor: "Rachel de Queiroz", ano: 1930, editora: "José Olympio" },
    { titulo: "O Senhor dos Anéis - J.R.R. Tolkien", autor: "J.R.R. Tolkien", ano: 1954, editora: "HarperCollins" },
    { titulo: "O Silêncio dos Inocentes - Thomas Harris", autor: "Thomas Harris", ano: 1988, editora: "Record" },
    { titulo: "O Sol é para Todos - Harper Lee", autor: "Harper Lee", ano: 1960, editora: "José Olympio" },
    { titulo: "O Símbolo Perdido - Dan Brown", autor: "Dan Brown", ano: 2009, editora: "Arqueiro" },
    { titulo: "O Tempo e o Vento - Érico Veríssimo", autor: "Érico Veríssimo", ano: 1949, editora: "Companhia das Letras" },
    { titulo: "Orgulho e Preconceito - Jane Austen", autor: "Jane Austen", ano: 1813, editora: "Penguin" },
    { titulo: "Os Miseráveis - Victor Hugo", autor: "Victor Hugo", ano: 1862, editora: "Martin Claret" },
    { titulo: "Os Sertões - Euclides da Cunha", autor: "Euclides da Cunha", ano: 1902, editora: "Companhia das Letras" },
    { titulo: "Poemas - Carlos Drummond de Andrade", autor: "Carlos Drummond de Andrade", ano: 2012, editora: "Companhia das Letras" },
    { titulo: "Pollyanna - Eleanor H. Porter", autor: "Eleanor H. Porter", ano: 1913, editora: "Autêntica" },
    { titulo: "Psicose - Robert Bloch", autor: "Robert Bloch", ano: 1959, editora: "Darkside" },
    { titulo: "Quincas Borba - Machado de Assis", autor: "Machado de Assis", ano: 1891, editora: "Companhia das Letras" },
    { titulo: "Raízes do Brasil - Sérgio Buarque de Holanda", autor: "Sérgio Buarque de Holanda", ano: 1936, editora: "Companhia das Letras" },
    { titulo: "Ratos e Homens - John Steinbeck", autor: "John Steinbeck", ano: 1937, editora: "Record" },
    { titulo: "Romeu e Julieta - William Shakespeare", autor: "William Shakespeare", ano: 1597, editora: "L&PM" },
    { titulo: "São Bernardo - Graciliano Ramos", autor: "Graciliano Ramos", ano: 1934, editora: "Record" },
    { titulo: "Senhora - José de Alencar", autor: "José de Alencar", ano: 1875, editora: "Ática" },
    { titulo: "Sidarta - Hermann Hesse", autor: "Hermann Hesse", ano: 1922, editora: "Record" },
    { titulo: "Ulisses - James Joyce", autor: "James Joyce", ano: 1922, editora: "Companhia das Letras" },
    { titulo: "Vidas Secas - Graciliano Ramos", autor: "Graciliano Ramos", ano: 1938, editora: "Record" }
];

// Inicialização: popula livros se a tabela estiver vazia e corrige senhas de clientes
db.on('ready', async () => {
    const count = await db.livros.count();
    if (count === 0) {
        await db.livros.bulkAdd(LIVROS_INICIAIS);
        console.log('Banco de livros inicializado com sucesso.');
    }
    const semSenha = await db.clientes.filter(c => !c.senha).toArray();
    for (let c of semSenha) {
        await db.clientes.update(c.id, { senha: '123456' });
        console.warn(`Cliente "${c.nome}" recebeu senha padrão "123456".`);
    }
});

// ============ AUTENTICAÇÃO ============
const BIBLIOTECARIOS = [
    { usuario: "ana", senha: "ana123" },
    { usuario: "carlos", senha: "carlos456" }
];

async function fazerLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;
    const perfil = document.querySelector('input[name="perfil"]:checked').value;

    if (perfil === 'bibliotecario') {
        if (BIBLIOTECARIOS.some(b => b.usuario === usuario && b.senha === senha)) {
            sessionStorage.setItem('logado', 'true');
            sessionStorage.setItem('perfil', 'bibliotecario');
            sessionStorage.setItem('usuario', usuario);
            document.getElementById('erro-login').style.display = 'none';
            document.getElementById('form-login').reset();
            mostrar('inicio');
        } else {
            document.getElementById('erro-login').style.display = 'block';
        }
    } else if (perfil === 'usuario') {
        const cpfLimpo = usuario.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) {
            document.getElementById('erro-login').style.display = 'block';
            return;
        }
        const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        const cliente = await db.clientes.where({ cpf: cpfFormatado }).first();
        if (cliente && cliente.senha === senha) {
            sessionStorage.setItem('logado', 'true');
            sessionStorage.setItem('perfil', 'usuario');
            sessionStorage.setItem('usuario', cliente.nome);
            sessionStorage.setItem('usuarioId', cliente.id);
            sessionStorage.setItem('cpf', cliente.cpf);
            document.getElementById('erro-login').style.display = 'none';
            document.getElementById('form-login').reset();
            mostrar('painel-usuario');
        } else {
            document.getElementById('erro-login').style.display = 'block';
        }
    }
}

function logout() {
    sessionStorage.clear();
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById('login').classList.add('ativa');
}

// ============ NOTIFICAÇÕES ============
function notificar(mensagem, tipo = 'sucesso') {
    const notif = document.getElementById('notificacao');
    notif.textContent = mensagem;
    notif.className = 'notificacao ' + (tipo === 'erro' ? 'erro' : '');
    notif.style.display = 'block';
    setTimeout(() => { notif.style.display = 'none'; }, 4000);
}

// ============ MÁSCARA DE CPF ============
function mascararCPF(input) {
    let cpf = input.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.substring(0, 11);
    let formatado = cpf;
    if (cpf.length > 3) formatado = cpf.substring(0, 3) + '.' + cpf.substring(3);
    if (cpf.length > 6) formatado = formatado.substring(0, 7) + '.' + cpf.substring(6);
    if (cpf.length > 9) formatado = formatado.substring(0, 11) + '-' + cpf.substring(9);
    input.value = formatado;
}

// ============ NAVEGAÇÃO (RESTRITA POR PERFIL) ============
function mostrar(id) {
    const logado = sessionStorage.getItem('logado') === 'true';
    const perfil = sessionStorage.getItem('perfil');
    if (!logado && id !== 'login') {
        document.getElementById('login').classList.add('ativa');
        return;
    }

    const telasProibidas = ['inicio', 'aluguel-opcao', 'cadastro-novo', 'pedido', 'devolucao', 'gerenciar-livros', 'ver-solicitacoes'];
    if (perfil === 'usuario' && telasProibidas.includes(id)) {
        notificar('Acesso restrito.', 'erro');
        id = 'painel-usuario';
    }

    document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
    document.getElementById('notificacao').style.display = 'none';

    if (id === 'inicio') {
        limparFormularios();
        document.getElementById('nome-usuario').textContent = sessionStorage.getItem('usuario');
    }
    if (id === 'painel-usuario') {
        document.getElementById('nome-leitor').textContent = sessionStorage.getItem('usuario');
        carregarPainelUsuario();
    }
    if (id === 'livros-disponiveis') carregarLivrosDisponiveis();
    if (id === 'meus-alugueis') carregarMeusAlugueis();
    if (id === 'pedido') carregarSelectClientes();
    if (id === 'devolucao') {
        document.getElementById('nome-cliente-devolucao').value = '';
        document.getElementById('info-devolucao').style.display = 'none';
        document.getElementById('lista-clientes-devolucao').style.display = 'none';
        document.getElementById('opcoes-clientes').innerHTML = '';
    }
    if (id === 'historico') carregarHistorico();
    if (id === 'gerenciar-livros') carregarGerenciarLivros();
    if (id === 'ver-solicitacoes') carregarSolicitacoesAdmin();
}

function limparFormularios() {
    document.querySelectorAll('input:not([readonly]), select').forEach(el => {
        if (el.type !== 'submit' && el.type !== 'button') el.value = '';
    });
    document.getElementById('data-devolucao').value = '';
    document.getElementById('info-devolucao').style.display = 'none';
    document.getElementById('lista-livros').innerHTML = '';
    document.getElementById('lista-livros').style.display = 'none';
    document.getElementById('filtro-livro').value = '';
    document.getElementById('sem-clientes').style.display = 'none';
}

// ============ PAINEL DO USUÁRIO ============
async function carregarPainelUsuario() {
    const idUsuario = parseInt(sessionStorage.getItem('usuarioId'));
    const aluguelAtivo = await db.alugueis.where({ cliente_id: idUsuario, status: 'ativo' }).first();
    const acoesDiv = document.getElementById('acoes-usuario');
    if (aluguelAtivo) {
        acoesDiv.style.display = 'block';
        document.getElementById('livro-ativo-usuario').textContent = aluguelAtivo.livro;
        document.getElementById('devolucao-prevista-usuario').textContent = aluguelAtivo.data_devolucao_prevista;
        acoesDiv.setAttribute('data-aluguel-id', aluguelAtivo.id);
    } else {
        acoesDiv.style.display = 'none';
        acoesDiv.removeAttribute('data-aluguel-id');
    }
}

async function renovarComoUsuario() {
    const aluguelId = parseInt(document.getElementById('acoes-usuario').getAttribute('data-aluguel-id'));
    if (!aluguelId) return;
    const aluguel = await db.alugueis.get(aluguelId);
    if (!aluguel || aluguel.status !== 'ativo') {
        notificar('Nenhum empréstimo ativo.', 'erro');
        return;
    }
    const partes = aluguel.data_devolucao_prevista.split('/');
    const dataAtual = new Date(partes[2], partes[1] - 1, partes[0]);
    dataAtual.setDate(dataAtual.getDate() + 7);
    const novaData = dataAtual.toLocaleDateString('pt-BR');
    await db.alugueis.update(aluguelId, { data_devolucao_prevista: novaData });
    notificar(`Empréstimo renovado até ${novaData}.`);
    carregarPainelUsuario();
}

async function devolverComoUsuario() {
    const aluguelId = parseInt(document.getElementById('acoes-usuario').getAttribute('data-aluguel-id'));
    if (!aluguelId) return;
    const aluguel = await db.alugueis.get(aluguelId);
    if (!aluguel || aluguel.status !== 'ativo') {
        notificar('Nenhum empréstimo ativo.', 'erro');
        return;
    }
    await db.alugueis.update(aluguelId, {
        status: 'devolvido',
        data_devolucao_real: new Date().toISOString().split('T')[0]
    });
    notificar(`Livro "${aluguel.livro}" devolvido com sucesso.`);
    carregarPainelUsuario();
}

// ============ LISTAGEM DE LIVROS COM CAPA E STATUS (CORRIGIDO) ============
async function carregarLivrosDisponiveis() {
    const container = document.getElementById('lista-disponiveis');
    container.innerHTML = '';

    // Busca todos os aluguéis ativos
    const alugueisAtivos = await db.alugueis.where({ status: 'ativo' }).toArray();

    // Cria um Set com os títulos dos livros alugados (apenas a parte antes do " - ")
    const livrosAlugados = new Set(
        alugueisAtivos.map(a => a.livro.split(' - ')[0].trim().toLowerCase())
    );

    // Pega a lista de livros cadastrados no banco (tabela livros)
    const livrosDB = await db.livros.toArray();

    if (livrosDB.length === 0) {
        container.innerHTML = '<p class="sem-dados">Nenhum livro cadastrado.</p>';
        return;
    }

    let html = '<div class="grade-livros">';
    for (const livro of livrosDB) {
        // Extrai o título simplificado (antes do " - ") e normaliza
        const tituloSimplificado = livro.titulo.split(' - ')[0].trim().toLowerCase();
        const disponivel = !livrosAlugados.has(tituloSimplificado);
        const statusClass = disponivel ? 'status-disponivel' : 'status-alugado';
        const statusTexto = disponivel ? 'Disponível' : 'Alugado';

        const caminhoCapa = `../src/${encodeURIComponent(livro.titulo)}.jpg`;

        html += `
            <div class="card-livro">
                <div class="capa-miniatura">
                    <img src="${caminhoCapa}" 
                         alt="Capa de ${livro.titulo}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="placeholder-capa-mini" style="display:none;">📚</div>
                </div>
                <div class="info-livro-card">
                    <h4>${livro.titulo}</h4>
                    <span class="${statusClass}">${statusTexto}</span>
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

async function carregarMeusAlugueis() {
    const idUsuario = parseInt(sessionStorage.getItem('usuarioId'));
    const container = document.getElementById('tabela-meus-alugueis');
    const alugueis = await db.alugueis.where({ cliente_id: idUsuario }).toArray();

    if (alugueis.length === 0) {
        container.innerHTML = '<p class="sem-dados">Você não possui histórico de aluguéis.</p>';
        return;
    }
    alugueis.sort((a, b) => new Date(b.data_locacao) - new Date(a.data_locacao));

    let tabela = `<table class="tabela-historico">
        <thead><tr><th>Livro</th><th>Data Locação</th><th>Prev. Devolução</th><th>Status</th><th>Devolução Real</th></tr></thead><tbody>`;
    alugueis.forEach(aluguel => {
        const dataLocacao = aluguel.data_locacao.split('-').reverse().join('/');
        const statusClass = aluguel.status === 'ativo' ? 'status-ativo' : 'status-devolvido';
        const statusTexto = aluguel.status === 'ativo' ? 'Ativo' : 'Devolvido';
        const devReal = aluguel.data_devolucao_real ? aluguel.data_devolucao_real.split('-').reverse().join('/') : '-';
        tabela += `<tr>
            <td>${aluguel.livro}</td>
            <td>${dataLocacao}</td>
            <td>${aluguel.data_devolucao_prevista}</td>
            <td class="${statusClass}">${statusTexto}</td>
            <td>${devReal}</td>
        </tr>`;
    });
    tabela += '</tbody></table>';
    container.innerHTML = tabela;
}

// ============ FUNÇÕES DE BIBLIOTECÁRIO (CLIENTES E ALUGUÉIS) ============
async function carregarSelectClientes(selectedId = null) {
    const select = document.getElementById('cliente-select');
    const clientes = await db.clientes.toArray();
    select.innerHTML = '<option value="">Selecione o cliente...</option>';
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = `${cliente.nome} (CPF: ${cliente.cpf})`;
        if (cliente.id == selectedId) option.selected = true;
        select.appendChild(option);
    });
    const semClientes = clientes.length === 0;
    document.getElementById('sem-clientes').style.display = semClientes ? 'block' : 'none';
    document.getElementById('btn-confirmar-aluguel').disabled = semClientes;
}

async function cadastrar() {
    const nome = document.getElementById('nome').value.trim();
    const cpfBruto = document.getElementById('cpf').value.replace(/\D/g, '');
    const nascimento = document.getElementById('nascimento').value;
    const senha = document.getElementById('senha-cliente').value;

    if (!nome || !cpfBruto || !nascimento || !senha) {
        notificar('Preencha todos os campos, incluindo a senha.', 'erro');
        return;
    }
    if (cpfBruto.length !== 11) {
        notificar('CPF inválido. Digite os 11 números.', 'erro');
        return;
    }
    const cpfFormatado = cpfBruto.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    const existente = await db.clientes.where({ cpf: cpfFormatado }).first();
    if (existente) {
        notificar('CPF já cadastrado.', 'erro');
        return;
    }
    const id = await db.clientes.put({ nome, cpf: cpfFormatado, nascimento, senha });
    notificar(`Cliente ${nome} cadastrado com sucesso!`);
    document.getElementById('form-cadastro').reset();
    prepararPedido(id);
}

async function prepararPedido(clienteId = null) {
    const clientes = await db.clientes.toArray();
    if (clientes.length === 0 && !clienteId) {
        notificar('Nenhum cliente cadastrado. Cadastre um novo cliente primeiro.', 'erro');
        mostrar('aluguel-opcao');
        return;
    }
    await carregarSelectClientes(clienteId);
    mostrar('pedido');
}

function calcularDevolucao() {
    const dataLocacao = document.getElementById('data-locacao').value;
    const campoDevolucao = document.getElementById('data-devolucao');
    if (dataLocacao) {
        const data = new Date(dataLocacao + 'T00:00:00');
        data.setDate(data.getDate() + 7);
        campoDevolucao.value = data.toLocaleDateString('pt-BR');
    } else {
        campoDevolucao.value = '';
    }
}

async function confirmarAluguel() {
    const clienteId = parseInt(document.getElementById('cliente-select').value);
    const livroTitulo = document.getElementById('livro').value.trim();
    const dataLocacao = document.getElementById('data-locacao').value;
    const dataDevolucao = document.getElementById('data-devolucao').value;
    if (!clienteId || !livroTitulo || !dataLocacao) {
        notificar('Preencha todos os campos do pedido.', 'erro');
        return;
    }
    const cliente = await db.clientes.get(clienteId);
    if (!cliente) {
        notificar('Cliente não encontrado.', 'erro');
        return;
    }
    const aluguelAtivoCliente = await db.alugueis.where({ cliente_id: clienteId, status: 'ativo' }).first();
    if (aluguelAtivoCliente) {
        notificar(`O cliente ${cliente.nome} já possui um livro alugado. Devolva primeiro.`, 'erro');
        return;
    }
    const livroJaAlugado = await db.alugueis.where({ livro: livroTitulo, status: 'ativo' }).first();
    if (livroJaAlugado) {
        notificar(`O livro "${livroTitulo}" já está alugado no momento.`, 'erro');
        return;
    }
    await db.alugueis.put({
        cliente_id: clienteId,
        livro: livroTitulo,
        data_locacao: dataLocacao,
        data_devolucao_prevista: dataDevolucao,
        status: 'ativo'
    });
    notificar(`Aluguel registrado! "${livroTitulo}" para ${cliente.nome}. Devolução prevista: ${dataDevolucao}`);
    document.getElementById('form-pedido').reset();
    document.getElementById('data-devolucao').value = '';
    mostrar('inicio');
}

async function buscarCliente() {
    const nomeBusca = document.getElementById('nome-cliente-devolucao').value.trim().toLowerCase();
    if (nomeBusca === '') {
        notificar('Digite um nome para buscar.', 'erro');
        return;
    }
    const todosClientes = await db.clientes.toArray();
    const clientes = todosClientes.filter(c => c.nome.toLowerCase().includes(nomeBusca));
    if (clientes.length === 0) {
        notificar('Cliente não encontrado.', 'erro');
        document.getElementById('info-devolucao').style.display = 'none';
        document.getElementById('lista-clientes-devolucao').style.display = 'none';
        return;
    }
    if (clientes.length === 1) {
        await exibirInfoDevolucao(clientes[0]);
        document.getElementById('lista-clientes-devolucao').style.display = 'none';
    } else {
        document.getElementById('info-devolucao').style.display = 'none';
        const opcoesDiv = document.getElementById('opcoes-clientes');
        opcoesDiv.innerHTML = '';
        clientes.forEach(cliente => {
            const btn = document.createElement('button');
            btn.textContent = `${cliente.nome} (CPF: ${cliente.cpf})`;
            btn.style.marginBottom = '8px';
            btn.addEventListener('click', async () => {
                await exibirInfoDevolucao(cliente);
                document.getElementById('lista-clientes-devolucao').style.display = 'none';
            });
            opcoesDiv.appendChild(btn);
        });
        document.getElementById('lista-clientes-devolucao').style.display = 'block';
    }
}

async function exibirInfoDevolucao(cliente) {
    const aluguel = await db.alugueis.where({ cliente_id: cliente.id, status: 'ativo' }).first();
    const infoDiv = document.getElementById('info-devolucao');
    const livroSpan = document.getElementById('livro-alugado');
    if (aluguel) {
        livroSpan.textContent = `"${aluguel.livro}" (Cliente: ${cliente.nome})`;
        infoDiv.setAttribute('data-aluguel-id', aluguel.id);
    } else {
        livroSpan.textContent = `Nenhum livro alugado ativo para ${cliente.nome}.`;
        infoDiv.removeAttribute('data-aluguel-id');
    }
    infoDiv.style.display = 'block';
}

async function devolver() {
    const infoDiv = document.getElementById('info-devolucao');
    const aluguelId = parseInt(infoDiv.getAttribute('data-aluguel-id'));
    if (!aluguelId) {
        notificar('Nenhum empréstimo ativo para devolução.', 'erro');
        return;
    }
    const aluguel = await db.alugueis.get(aluguelId);
    if (!aluguel || aluguel.status !== 'ativo') {
        notificar('Empréstimo não encontrado ou já devolvido.', 'erro');
        return;
    }
    await db.alugueis.update(aluguelId, {
        status: 'devolvido',
        data_devolucao_real: new Date().toISOString().split('T')[0]
    });
    notificar(`Livro "${aluguel.livro}" devolvido com sucesso!`);
    document.getElementById('nome-cliente-devolucao').value = '';
    infoDiv.style.display = 'none';
    infoDiv.removeAttribute('data-aluguel-id');
    document.getElementById('lista-clientes-devolucao').style.display = 'none';
}

async function carregarHistorico() {
    const container = document.getElementById('tabela-historico');
    try {
        const [alugueis, clientes] = await Promise.all([
            db.alugueis.toArray(),
            db.clientes.toArray()
        ]);

        if (alugueis.length === 0) {
            container.innerHTML = '<p class="sem-dados">Nenhum aluguel registrado.</p>';
            return;
        }
        const mapaClientes = {};
        clientes.forEach(c => { mapaClientes[c.id] = c; });
        alugueis.sort((a, b) => new Date(b.data_locacao) - new Date(a.data_locacao));

        let tabela = `<table class="tabela-historico">
            <thead><tr><th>Cliente</th><th>Livro</th><th>Data Locação</th><th>Prev. Devolução</th><th>Status</th><th>Devolução Real</th></tr></thead><tbody>`;
        alugueis.forEach(aluguel => {
            const cliente = mapaClientes[aluguel.cliente_id] || { nome: 'Cliente removido' };
            const dataLocacao = aluguel.data_locacao.split('-').reverse().join('/');
            const statusClass = aluguel.status === 'ativo' ? 'status-ativo' : 'status-devolvido';
            const statusTexto = aluguel.status === 'ativo' ? 'Ativo' : 'Devolvido';
            const devolucaoReal = aluguel.data_devolucao_real ? aluguel.data_devolucao_real.split('-').reverse().join('/') : '-';
            tabela += `<tr>
                <td>${cliente.nome}</td>
                <td>${aluguel.livro}</td>
                <td>${dataLocacao}</td>
                <td>${aluguel.data_devolucao_prevista}</td>
                <td class="${statusClass}">${statusTexto}</td>
                <td>${devolucaoReal}</td>
            </tr>`;
        });
        tabela += '</tbody></table>';
        container.innerHTML = tabela;
    } catch (erro) {
        console.error('Erro ao carregar histórico:', erro);
        container.innerHTML = '<p class="sem-dados">Erro ao carregar dados.</p>';
    }
}

// ============ NOVAS FUNÇÕES: GERENCIAR LIVROS (ADMIN) ============
async function carregarGerenciarLivros() {
    const container = document.getElementById('tabela-livros-admin');
    const livros = await db.livros.toArray();
    if (livros.length === 0) {
        container.innerHTML = '<p class="sem-dados">Nenhum livro cadastrado.</p>';
        return;
    }
    let html = `<table class="tabela-historico">
        <thead><tr><th>Título</th><th>Autor</th><th>Ano</th><th>Editora</th><th>Ação</th></tr></thead><tbody>`;
    livros.forEach(livro => {
        html += `<tr>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.ano}</td>
            <td>${livro.editora}</td>
            <td><button onclick="removerLivro(${livro.id})" style="background:#e74c3c; padding:6px 12px; font-size:0.8rem;">Remover</button></td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function adicionarLivro() {
    const titulo = document.getElementById('novo-titulo').value.trim();
    const autor = document.getElementById('novo-autor').value.trim();
    const ano = parseInt(document.getElementById('novo-ano').value);
    const editora = document.getElementById('novo-editora').value.trim();

    if (!titulo || !autor || !ano || !editora) {
        notificar('Preencha todos os campos.', 'erro');
        return;
    }

    const existente = await db.livros.where({ titulo }).first();
    if (existente) {
        notificar('Já existe um livro com este título.', 'erro');
        return;
    }

    await db.livros.add({ titulo, autor, ano, editora });
    notificar(`Livro "${titulo}" adicionado com sucesso.`);
    document.getElementById('form-add-livro').reset();
    carregarGerenciarLivros();
}

async function removerLivro(id) {
    if (!confirm('Tem certeza que deseja remover este livro?')) return;
    await db.livros.delete(id);
    notificar('Livro removido.');
    carregarGerenciarLivros();
}

// ============ SOLICITAÇÕES (USUÁRIO) ============
async function enviarSolicitacao() {
    const titulo = document.getElementById('solic-titulo').value.trim();
    const autor = document.getElementById('solic-autor').value.trim();
    const justificativa = document.getElementById('solic-justificativa').value.trim();
    const usuarioId = parseInt(sessionStorage.getItem('usuarioId'));

    if (!titulo) {
        notificar('Informe pelo menos o título do livro.', 'erro');
        return;
    }

    await db.solicitacoes.add({
        usuario_id: usuarioId,
        titulo,
        autor: autor || 'Não informado',
        justificativa: justificativa || 'Nenhuma',
        data: new Date().toISOString().split('T')[0]
    });
    notificar('Solicitação enviada com sucesso!');
    document.getElementById('form-solicitacao').reset();
    mostrar('painel-usuario');
}

async function carregarSolicitacoesAdmin() {
    const container = document.getElementById('lista-solicitacoes-admin');
    const solicitacoes = await db.solicitacoes.toArray();
    const clientes = await db.clientes.toArray();
    const mapaClientes = {};
    clientes.forEach(c => { mapaClientes[c.id] = c; });

    if (solicitacoes.length === 0) {
        container.innerHTML = '<p class="sem-dados">Nenhuma solicitação.</p>';
        return;
    }

    let html = '<div style="text-align:left;">';
    solicitacoes.forEach(sol => {
        const cliente = mapaClientes[sol.usuario_id] || { nome: 'Usuário removido' };
        html += `
            <div style="background:#f9f5ed; border-left:4px solid var(--marrom); padding:15px; margin-bottom:15px; border-radius:8px;">
                <p><strong>Livro:</strong> ${sol.titulo}</p>
                <p><strong>Autor:</strong> ${sol.autor}</p>
                <p><strong>Solicitante:</strong> ${cliente.nome} (CPF: ${cliente.cpf || 'N/D'})</p>
                <p><strong>Justificativa:</strong> ${sol.justificativa}</p>
                <p><strong>Data:</strong> ${sol.data}</p>
            </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ============ PESQUISA DE LIVROS (USA BANCO) ============
async function filtrarLivros() {
    const filtro = document.getElementById('filtro-livro').value.trim().toLowerCase();
    const listaDiv = document.getElementById('lista-livros');
    listaDiv.innerHTML = '';
    if (filtro === '') {
        listaDiv.style.display = 'none';
        return;
    }

    const livros = await db.livros.toArray();
    function removerArtigos(titulo) {
        return titulo.replace(/^(O |A |Os |As |Um |Uma |The )/i, '').trim();
    }

    let resultados = livros.filter(livro =>
        removerArtigos(livro.titulo).toLowerCase().includes(filtro)
    );
    resultados.sort((a, b) => {
        const tituloA = removerArtigos(a.titulo).toLowerCase();
        const tituloB = removerArtigos(b.titulo).toLowerCase();
        const aComeca = tituloA.startsWith(filtro);
        const bComeca = tituloB.startsWith(filtro);
        if (aComeca && !bComeca) return -1;
        if (!aComeca && bComeca) return 1;
        return tituloA.localeCompare(tituloB);
    });

    if (resultados.length === 0) {
        listaDiv.innerHTML = '<div class="sem-resultados">Nenhum livro encontrado</div>';
        listaDiv.style.display = 'block';
        return;
    }
    resultados.forEach(livro => {
        const item = document.createElement('div');
        item.className = 'item-livro';
        const regex = new RegExp(`(${filtro})`, 'gi');
        item.innerHTML = livro.titulo.replace(regex, '<strong>$1</strong>');
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('livro').value = livro.titulo.split(' - ')[0];
            document.getElementById('filtro-livro').value = '';
            listaDiv.innerHTML = '';
            listaDiv.style.display = 'none';
            atualizarCapa(livro.titulo);
            atualizarInfoLivro(livro);
        });
        listaDiv.appendChild(item);
    });
    listaDiv.style.display = 'block';
}

// ============ CAPA E INFORMAÇÕES ============
let timeoutCapa = null;

function atualizarCapa(titulo) {
    const img = document.getElementById('capa-livro');
    const placeholder = document.getElementById('placeholder-capa');
    if (!titulo) {
        img.style.display = 'none';
        placeholder.style.display = 'block';
        placeholder.textContent = '📚 Capa';
        return;
    }
    const caminho = `../src/${encodeURIComponent(titulo)}.jpg`;
    img.onload = () => {
        img.style.display = 'block';
        placeholder.style.display = 'none';
    };
    img.onerror = () => {
        img.style.display = 'none';
        placeholder.textContent = '📷 Capa não encontrada';
        placeholder.style.display = 'block';
    };
    img.src = caminho;
}

async function atualizarInfoLivro(livro) {
    const infoDiv = document.getElementById('info-livro');
    const autorSpan = document.getElementById('info-autor');
    const anoSpan = document.getElementById('info-ano');
    const editoraSpan = document.getElementById('info-editora');
    const placeholder = document.getElementById('info-placeholder');

    if (!livro) {
        autorSpan.textContent = '—';
        anoSpan.textContent = '—';
        editoraSpan.textContent = '—';
        infoDiv.classList.remove('com-dados');
        placeholder.style.display = 'block';
        return;
    }

    const livroDB = await db.livros.where({ titulo: livro.titulo || livro }).first();
    if (livroDB) {
        autorSpan.textContent = livroDB.autor;
        anoSpan.textContent = livroDB.ano;
        editoraSpan.textContent = livroDB.editora;
        infoDiv.classList.add('com-dados');
        placeholder.style.display = 'none';
    } else {
        autorSpan.textContent = 'Não disponível';
        anoSpan.textContent = 'Não disponível';
        editoraSpan.textContent = 'Não disponível';
        infoDiv.classList.add('com-dados');
        placeholder.style.display = 'none';
    }
}

// Evento do campo de livro (busca por título enquanto digita)
document.getElementById('livro').addEventListener('input', async function() {
    clearTimeout(timeoutCapa);
    const termo = this.value.trim();
    timeoutCapa = setTimeout(async () => {
        const livros = await db.livros.toArray();
        const livroEncontrado = livros.find(l =>
            l.titulo.toLowerCase().startsWith(termo.toLowerCase())
        );
        if (livroEncontrado) {
            atualizarCapa(livroEncontrado.titulo);
            atualizarInfoLivro(livroEncontrado);
        } else {
            atualizarCapa(null);
            atualizarInfoLivro(null);
        }
    }, 500);
});

// Fechar lista de livros ao clicar fora
document.addEventListener('click', function(event) {
    const listaDiv = document.getElementById('lista-livros');
    if (!event.target.closest('.busca-livros')) {
        listaDiv.style.display = 'none';
    }
});

// ============ VERIFICAÇÃO DE SESSÃO AO CARREGAR ============
window.addEventListener('DOMContentLoaded', () => {
    const logado = sessionStorage.getItem('logado') === 'true';
    const perfil = sessionStorage.getItem('perfil');
    if (logado) {
        document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
        if (perfil === 'bibliotecario') {
            document.getElementById('inicio').classList.add('ativa');
            document.getElementById('nome-usuario').textContent = sessionStorage.getItem('usuario');
        } else if (perfil === 'usuario') {
            document.getElementById('painel-usuario').classList.add('ativa');
            document.getElementById('nome-leitor').textContent = sessionStorage.getItem('usuario');
            carregarPainelUsuario();
        }
    } else {
        document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
        document.getElementById('login').classList.add('ativa');
    }
});