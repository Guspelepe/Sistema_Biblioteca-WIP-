// ==========================================
// db.js – Configuração do Dexie (global)
// ==========================================

// Cria a instância do banco e atribui à variável global
window.db = new Dexie('BibliotecaDB');

db.version(3).stores({
    clientes: '++id, cpf',
    alugueis: '++id, cliente_id, status, livro',
    livros: '++id, titulo',
    solicitacoes: '++id, usuario_id'
});

// Lista inicial de livros (copie os 100 do seu código original aqui)
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


// Inicialização
db.on('ready', async () => {
    // Popula livros se estiver vazio
    const countLivros = await db.livros.count();
    if (countLivros === 0) {
        await db.livros.bulkAdd(LIVROS_INICIAIS);
        console.log('📚 Banco de livros inicializado.');
    }

    // Cria um cliente padrão se não houver nenhum cliente
    const countClientes = await db.clientes.count();
    if (countClientes === 0) {
        await db.clientes.add({
            nome: 'Usuário Teste',
            cpf: '111.222.333-44',
            nascimento: '1990-01-01',
            senha: '123456'
        });
        console.log('👤 Cliente padrão criado: CPF 111.222.333-44 / senha 123456');
    }

    // Corrige senhas de clientes antigos que não tenham senha
    const semSenha = await db.clientes.filter(c => !c.senha).toArray();
    for (let c of semSenha) {
        await db.clientes.update(c.id, { senha: '123456' });
        console.warn(`Cliente "${c.nome}" recebeu senha padrão "123456".`);
    }

    console.log('✅ Banco de dados pronto.');
});