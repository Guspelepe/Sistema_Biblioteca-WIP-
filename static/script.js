// ============ CONFIGURAÇÃO DO BANCO (IndexedDB com Dexie) ============
const db = new Dexie('BibliotecaDB');
db.version(1).stores({
    clientes: '++id, cpf',
    alugueis: '++id, cliente_id, status, livro'
});

// ============ LISTA DE LIVROS POPULARES ============
const livrosPopulares = [
    "Dom Quixote - Miguel de Cervantes", "1984 - George Orwell", "Orgulho e Preconceito - Jane Austen",
    "O Senhor dos Anéis - J.R.R. Tolkien", "Cem Anos de Solidão - Gabriel García Márquez",
    "Harry Potter e a Pedra Filosofal - J.K. Rowling", "O Apanhador no Campo de Centeio - J.D. Salinger",
    "O Grande Gatsby - F. Scott Fitzgerald", "Crime e Castigo - Fiódor Dostoiévski",
    "Guerra e Paz - Liev Tolstói", "As Aventuras de Tom Sawyer - Mark Twain",
    "Moby Dick - Herman Melville", "Ulisses - James Joyce", "O Processo - Franz Kafka",
    "Ensaio sobre a Cegueira - José Saramago", "A Metamorfose - Franz Kafka",
    "O Pequeno Príncipe - Antoine de Saint-Exupéry", "A Divina Comédia - Dante Alighieri",
    "Hamlet - William Shakespeare", "Romeu e Julieta - William Shakespeare",
    "Os Miseráveis - Victor Hugo", "O Conde de Monte Cristo - Alexandre Dumas",
    "Jane Eyre - Charlotte Brontë", "O Morro dos Ventos Uivantes - Emily Brontë",
    "Anna Kariênina - Liev Tolstói", "A Revolução dos Bichos - George Orwell",
    "Fahrenheit 451 - Ray Bradbury", "Admirável Mundo Novo - Aldous Huxley",
    "O Sol é para Todos - Harper Lee", "O Lobo da Estepe - Hermann Hesse",
    "Sidarta - Hermann Hesse", "A Náusea - Jean-Paul Sartre", "O Estrangeiro - Albert Camus",
    "A Peste - Albert Camus", "Doutor Jivago - Boris Pasternak", "Lolita - Vladimir Nabokov",
    "Memórias Póstumas de Brás Cubas - Machado de Assis", "Dom Casmurro - Machado de Assis",
    "Grande Sertão: Veredas - João Guimarães Rosa", "Vidas Secas - Graciliano Ramos",
    "Capitães da Areia - Jorge Amado", "Gabriela, Cravo e Canela - Jorge Amado",
    "O Tempo e o Vento - Érico Veríssimo", "A Hora da Estrela - Clarice Lispector",
    "Água Viva - Clarice Lispector", "Memorial de Aires - Machado de Assis",
    "São Bernardo - Graciliano Ramos", "Angústia - Graciliano Ramos",
    "Macunaíma - Mário de Andrade", "O Cortiço - Aluísio Azevedo",
    "Lucíola - José de Alencar", "Senhora - José de Alencar", "Iracema - José de Alencar",
    "O Guarani - José de Alencar", "Quincas Borba - Machado de Assis",
    "O Alienista - Machado de Assis", "A Moreninha - Joaquim Manuel de Macedo",
    "Noite na Taverna - Álvares de Azevedo", "Lira dos Vinte Anos - Álvares de Azevedo",
    "Poemas - Carlos Drummond de Andrade", "Morte e Vida Severina - João Cabral de Melo Neto",
    "O Quinze - Rachel de Queiroz", "A Bagaceira - José Américo de Almeida",
    "O Auto da Compadecida - Ariano Suassuna", "O Pagador de Promessas - Dias Gomes",
    "Os Sertões - Euclides da Cunha", "Casa-Grande & Senzala - Gilberto Freyre",
    "Raízes do Brasil - Sérgio Buarque de Holanda", "O Povo Brasileiro - Darcy Ribeiro",
    "Brasil: Uma Biografia - Lilia M. Schwarcz & Heloisa M. Starling",
    "O Homem que Calculava - Malba Tahan", "Pollyanna - Eleanor H. Porter",
    "Anne de Green Gables - Lucy Maud Montgomery", "As Crônicas de Nárnia - C.S. Lewis",
    "O Hobbit - J.R.R. Tolkien", "Jogos Vorazes - Suzanne Collins",
    "Divergente - Veronica Roth", "A Seleção - Kiera Cass", "Cidades de Papel - John Green",
    "A Culpa é das Estrelas - John Green", "Extraordinário - R.J. Palacio",
    "O Diário de Anne Frank - Anne Frank", "A Menina que Roubava Livros - Markus Zusak",
    "O Código Da Vinci - Dan Brown", "Anjos e Demônios - Dan Brown",
    "Inferno - Dan Brown", "O Símbolo Perdido - Dan Brown", "Fortaleza Digital - Dan Brown",
    "A Garota no Trem - Paula Hawkins", "O Silêncio dos Inocentes - Thomas Harris",
    "Psicose - Robert Bloch", "O Iluminado - Stephen King", "It: A Coisa - Stephen King",
    "Doutor Sono - Stephen King", "Carrie, a Estranha - Stephen King",
    "A Dança da Morte - Stephen King", "O Nome da Rosa - Umberto Eco",
    "O Perfume - Patrick Süskind", "Clube da Luta - Chuck Palahniuk",
    "A Sombra do Vento - Carlos Ruiz Zafón", "O Jogo do Anjo - Carlos Ruiz Zafón",
    "Marina - Carlos Ruiz Zafón", "As Vinhas da Ira - John Steinbeck",
    "Ratos e Homens - John Steinbeck"
];

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

// ============ NAVEGAÇÃO ============
function mostrar(id) {
    document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
    document.getElementById('notificacao').style.display = 'none';

    if (id === 'inicio') limparFormularios();
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

// ============ FUNÇÕES DO BANCO ============
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
    if (!nome || !cpfBruto || !nascimento) {
        notificar('Preencha todos os campos.', 'erro');
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
    const id = await db.clientes.put({ nome, cpf: cpfFormatado, nascimento });
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

// ============ TELA DE HISTÓRICO ============
async function carregarHistorico() {
    const container = document.getElementById('tabela-historico');
    try {
        // Carregar todos os aluguéis e clientes para cruzar dados
        const [alugueis, clientes] = await Promise.all([
            db.alugueis.toArray(),
            db.clientes.toArray()
        ]);

        if (alugueis.length === 0) {
            container.innerHTML = '<p class="sem-dados">Nenhum aluguel registrado.</p>';
            return;
        }

        // Criar mapa de clientes para acesso rápido
        const mapaClientes = {};
        clientes.forEach(c => { mapaClientes[c.id] = c; });

        // Ordenar por data de locação (mais recente primeiro)
        alugueis.sort((a, b) => new Date(b.data_locacao) - new Date(a.data_locacao));

        let tabela = `<table class="tabela-historico">
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Livro</th>
                    <th>Data Locação</th>
                    <th>Prev. Devolução</th>
                    <th>Status</th>
                    <th>Devolução Real</th>
                </tr>
            </thead>
            <tbody>`;

        alugueis.forEach(aluguel => {
            const cliente = mapaClientes[aluguel.cliente_id] || { nome: 'Cliente removido' };
            const dataLocacao = aluguel.data_locacao.split('-').reverse().join('/');
            const statusClass = aluguel.status === 'ativo' ? 'status-ativo' : 'status-devolvido';
            const statusTexto = aluguel.status === 'ativo' ? 'Ativo' : 'Devolvido';
            const devolucaoReal = aluguel.data_devolucao_real 
                ? aluguel.data_devolucao_real.split('-').reverse().join('/') 
                : '-';

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