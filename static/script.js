// ============ CONFIGURAÇÃO DO BANCO (IndexedDB com Dexie) ============
const db = new Dexie('BibliotecaDB');

// Versão 2 – adiciona suporte ao campo "senha" nos clientes (sem novo índice)
db.version(2).stores({
    clientes: '++id, cpf',
    alugueis: '++id, cliente_id, status, livro'
});

// Atualiza clientes antigos que não possuem senha
db.open().then(async () => {
    const semSenha = await db.clientes.filter(c => !c.senha).toArray();
    for (let c of semSenha) {
        await db.clientes.update(c.id, { senha: '123456' });
        console.warn(`Cliente "${c.nome}" recebeu senha padrão "123456".`);
    }
});

// ============ LISTA DE LIVROS POPULARES (mantida igual) ============
const livrosPopulares = [
    "1984 - George Orwell", "A Bagaceira - José Américo de Almeida", "A Culpa é das Estrelas - John Green",
    "A Dança da Morte - Stephen King", "A Divina Comédia - Dante Alighieri", "A Garota no Trem - Paula Hawkins",
    "A Hora da Estrela - Clarice Lispector", "A Menina que Roubava Livros - Markus Zusak", "A Metamorfose - Franz Kafka",
    "A Moreninha - Joaquim Manuel de Macedo", "A Náusea - Jean-Paul Sartre", "A Peste - Albert Camus",
    "A Revolução dos Bichos - George Orwell", "A Seleção - Kiera Cass", "A Sombra do Vento - Carlos Ruiz Zafón",
    "Admirável Mundo Novo - Aldous Huxley", "Água Viva - Clarice Lispector", "Angústia - Graciliano Ramos",
    "Anjos e Demônios - Dan Brown", "Anna Kariênina - Liev Tolstói", "Anne de Green Gables - Lucy Maud Montgomery",
    "As Aventuras de Tom Sawyer - Mark Twain", "As Crônicas de Nárnia - C.S. Lewis", "As Vinhas da Ira - John Steinbeck",
    "Brasil: Uma Biografia - Lilia M. Schwarcz & Heloisa M. Starling", "Capitães da Areia - Jorge Amado", "Carrie, a Estranha - Stephen King",
    "Casa-Grande & Senzala - Gilberto Freyre", "Cem Anos de Solidão - Gabriel García Márquez", "Cidades de Papel - John Green",
    "Clube da Luta - Chuck Palahniuk", "Crime e Castigo - Fiódor Dostoiévski", "Divergente - Veronica Roth",
    "Dom Casmurro - Machado de Assis", "Dom Quixote - Miguel de Cervantes", "Doutor Jivago - Boris Pasternak",
    "Doutor Sono - Stephen King", "Ensaio sobre a Cegueira - José Saramago", "Extraordinário - R.J. Palacio",
    "Fahrenheit 451 - Ray Bradbury", "Fortaleza Digital - Dan Brown", "Gabriela, Cravo e Canela - Jorge Amado",
    "Grande Sertão: Veredas - João Guimarães Rosa", "Guerra e Paz - Liev Tolstói", "Hamlet - William Shakespeare",
    "Harry Potter e a Pedra Filosofal - J.K. Rowling", "Inferno - Dan Brown", "Iracema - José de Alencar",
    "It: A Coisa - Stephen King", "Jane Eyre - Charlotte Brontë", "Jogos Vorazes - Suzanne Collins",
    "Lira dos Vinte Anos - Álvares de Azevedo", "Lolita - Vladimir Nabokov", "Lucíola - José de Alencar",
    "Macunaíma - Mário de Andrade", "Marina - Carlos Ruiz Zafón", "Memorial de Aires - Machado de Assis",
    "Memórias Póstumas de Brás Cubas - Machado de Assis", "Moby Dick - Herman Melville", "Morte e Vida Severina - João Cabral de Melo Neto",
    "Noite na Taverna - Álvares de Azevedo", "O Alienista - Machado de Assis", "O Apanhador no Campo de Centeio - J.D. Salinger",
    "O Auto da Compadecida - Ariano Suassuna", "O Código Da Vinci - Dan Brown", "O Conde de Monte Cristo - Alexandre Dumas",
    "O Cortiço - Aluísio Azevedo", "O Diário de Anne Frank - Anne Frank", "O Estrangeiro - Albert Camus",
    "O Grande Gatsby - F. Scott Fitzgerald", "O Guarani - José de Alencar", "O Hobbit - J.R.R. Tolkien",
    "O Homem que Calculava - Malba Tahan", "O Iluminado - Stephen King", "O Jogo do Anjo - Carlos Ruiz Zafón",
    "O Lobo da Estepe - Hermann Hesse", "O Morro dos Ventos Uivantes - Emily Brontë", "O Nome da Rosa - Umberto Eco",
    "O Pagador de Promessas - Dias Gomes", "O Pequeno Príncipe - Antoine de Saint-Exupéry", "O Perfume - Patrick Süskind",
    "O Povo Brasileiro - Darcy Ribeiro", "O Processo - Franz Kafka", "O Quinze - Rachel de Queiroz",
    "O Senhor dos Anéis - J.R.R. Tolkien", "O Silêncio dos Inocentes - Thomas Harris", "O Sol é para Todos - Harper Lee",
    "O Símbolo Perdido - Dan Brown", "O Tempo e o Vento - Érico Veríssimo", "Orgulho e Preconceito - Jane Austen",
    "Os Miseráveis - Victor Hugo", "Os Sertões - Euclides da Cunha", "Poemas - Carlos Drummond de Andrade",
    "Pollyanna - Eleanor H. Porter", "Psicose - Robert Bloch", "Quincas Borba - Machado de Assis",
    "Raízes do Brasil - Sérgio Buarque de Holanda", "Ratos e Homens - John Steinbeck", "Romeu e Julieta - William Shakespeare",
    "São Bernardo - Graciliano Ramos", "Senhora - José de Alencar", "Sidarta - Hermann Hesse",
    "Ulisses - James Joyce", "Vidas Secas - Graciliano Ramos"
];

// ============ INFORMAÇÕES DOS LIVROS ============
const livrosInfo = {
    "1984 - George Orwell": { autor: "George Orwell", ano: 1949, editora: "Companhia das Letras" },
    "A Bagaceira - José Américo de Almeida": { autor: "José Américo de Almeida", ano: 1928, editora: "Record" },
    // ... (mantenha todos os dados existentes aqui) ...
    "Vidas Secas - Graciliano Ramos": { autor: "Graciliano Ramos", ano: 1938, editora: "Record" }
};

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

    // Usuário comum não pode acessar telas do bibliotecário
    const telasProibidas = ['inicio', 'aluguel-opcao', 'cadastro-novo', 'pedido', 'devolucao'];
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

async function carregarLivrosDisponiveis() {
    const container = document.getElementById('lista-disponiveis');
    const alugueisAtivos = await db.alugueis.where({ status: 'ativo' }).toArray();
    const livrosAlugados = alugueisAtivos.map(a => a.livro);
    const disponiveis = livrosPopulares.filter(l => !livrosAlugados.includes(l));

    if (disponiveis.length === 0) {
        container.innerHTML = '<p class="sem-dados">Todos os livros estão alugados no momento.</p>';
        return;
    }
    let html = '<ul style="list-style: none; padding-left: 0;">';
    disponiveis.forEach(livro => {
        html += `<li style="margin-bottom: 8px;">📖 ${livro}</li>`;
    });
    html += '</ul>';
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

// ============ FUNÇÕES DE BIBLIOTECÁRIO (MANTIDAS) ============
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

// ============ PESQUISA DE LIVROS ============
function filtrarLivros() {
    const filtro = document.getElementById('filtro-livro').value.trim().toLowerCase();
    const listaDiv = document.getElementById('lista-livros');
    listaDiv.innerHTML = '';
    if (filtro === '') {
        listaDiv.style.display = 'none';
        return;
    }
    function removerArtigos(titulo) {
        return titulo.replace(/^(O |A |Os |As |Um |Uma |The )/i, '').trim();
    }
    let resultados = livrosPopulares.filter(livro => {
        return removerArtigos(livro).toLowerCase().includes(filtro);
    });
    resultados.sort((a, b) => {
        const tituloA = removerArtigos(a).toLowerCase();
        const tituloB = removerArtigos(b).toLowerCase();
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
        item.innerHTML = livro.replace(regex, '<strong>$1</strong>');
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('livro').value = livro.split(' - ')[0];
            document.getElementById('filtro-livro').value = '';
            listaDiv.innerHTML = '';
            listaDiv.style.display = 'none';
            atualizarCapa(livro);
            atualizarInfoLivro(livro);
        });
        listaDiv.appendChild(item);
    });
    listaDiv.style.display = 'block';
}

document.addEventListener('click', function(event) {
    const listaDiv = document.getElementById('lista-livros');
    if (!event.target.closest('.busca-livros')) {
        listaDiv.style.display = 'none';
    }
});

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
    const caminho = `../src/${titulo}.jpg`;
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

function atualizarInfoLivro(tituloCompleto) {
    const infoDiv = document.getElementById('info-livro');
    const autorSpan = document.getElementById('info-autor');
    const anoSpan = document.getElementById('info-ano');
    const editoraSpan = document.getElementById('info-editora');
    const placeholder = document.getElementById('info-placeholder');

    if (!tituloCompleto) {
        autorSpan.textContent = '—';
        anoSpan.textContent = '—';
        editoraSpan.textContent = '—';
        infoDiv.classList.remove('com-dados');
        placeholder.style.display = 'block';
        return;
    }

    const dados = livrosInfo[tituloCompleto];
    if (dados) {
        autorSpan.textContent = dados.autor;
        anoSpan.textContent = dados.ano;
        editoraSpan.textContent = dados.editora;
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

document.getElementById('livro').addEventListener('input', function() {
    clearTimeout(timeoutCapa);
    const termo = this.value.trim();
    timeoutCapa = setTimeout(() => {
        const livroEncontrado = livrosPopulares.find(livro =>
            livro.toLowerCase().startsWith(termo.toLowerCase())
        );
        if (livroEncontrado) {
            atualizarCapa(livroEncontrado);
            atualizarInfoLivro(livroEncontrado);
        } else {
            atualizarCapa(null);
            atualizarInfoLivro(null);
        }
    }, 500);
});

// ============ VERIFICAÇÃO DE SESSÃO ============
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