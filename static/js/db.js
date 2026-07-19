// ==========================================
// db.js – Configuração do Dexie (global)
// ==========================================

// Cria a instância do banco apenas uma vez
window.db = new Dexie('BibliotecaDB');

// ===== VERSÃO 7 – inclui campos de multa =====
db.version(7).stores({
    clientes: '++id, cpf, nome, apelido, foto, livros_lidos, media_estrelas, lendo_agora, bio, nascimento',
    alugueis: '++id, cliente_id, status, livro, dias_atraso, multa',
    livros: '++id, titulo',
    solicitacoes: '++id, usuario_id, titulo, autor, editora, comentario, data, status, resposta',
    avaliacoes: '++id, livro, usuario_id, nota, comentario, data',
    frases: '++id, texto, autor'
});

// ==========================================
// 1. LISTA DE LIVROS (100 títulos)
// ==========================================
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

// ==========================================
// 2. LISTA DE FRASES
// ==========================================
const FRASES_INICIAIS = [
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

// ==========================================
// 3. USUÁRIOS FIXOS (10)
// ==========================================
const USUARIOS_FIXOS = [
    { nome: 'Julia Akemi', apelido: 'Juch', cpf: '111.111.111-11', foto: 'ju.jpg', livros_lidos: 29, media_estrelas: 4.5, lendo_agora: 'Evangelion', senha: '1234' },
    { nome: 'Gustavo Pelepe', apelido: 'Guspelepe', cpf: '222.222.222-22', foto: 'gu.jpg', livros_lidos: 10, media_estrelas: 3.5, lendo_agora: 'Haikyu', senha: '1234' },
    { nome: 'Ronaldo Karas', apelido: 'Karas', cpf: '333.333.333-33', foto: 'karas.jpg', livros_lidos: 12, media_estrelas: 4.0, lendo_agora: 'Python Avançado', senha: '1234' },
    { nome: 'Douglas Becker', apelido: 'Douglas404', cpf: '444.444.444-44', foto: 'douglas.jpg', livros_lidos: 14, media_estrelas: 3.0, lendo_agora: 'O Hobbit', senha: '1234' },
    { nome: 'Mariana Oliveira', apelido: 'Mary', cpf: '555.555.555-55', foto: 'mariana.jpg', livros_lidos: 18, media_estrelas: 4.2, lendo_agora: 'Dom Casmurro', senha: '1234' },
    { nome: 'Felipe Santos', apelido: 'Felps', cpf: '666.666.666-66', foto: 'felipe.jpg', livros_lidos: 9, media_estrelas: 3.8, lendo_agora: 'One Piece', senha: '1234' },
    { nome: 'Camila Ferreira', apelido: 'Cami', cpf: '777.777.777-77', foto: 'camila.jpg', livros_lidos: 26, media_estrelas: 4.9, lendo_agora: 'Orgulho e Preconceito', senha: '1234' },
    { nome: 'Lucas Almeida', apelido: 'Luquinhas', cpf: '888.888.888-88', foto: 'lucas.jpg', livros_lidos: 16, media_estrelas: 4.1, lendo_agora: 'Clean Code', senha: '1234' },
    { nome: 'Beatriz Costa', apelido: 'Bia', cpf: '999.999.999-99', foto: 'bia.jpg', livros_lidos: 21, media_estrelas: 4.7, lendo_agora: 'Percy Jackson', senha: '1234' },
    { nome: 'Henrique Martins', apelido: 'HMartins', cpf: '101.010.101-01', foto: 'henrique.jpg', livros_lidos: 13, media_estrelas: 3.9, lendo_agora: '1984', senha: '1234' }
];

// ==========================================
// 4. TÍTULOS POPULARES e COMENTÁRIOS (para avaliações)
// ==========================================
const TITULOS_POPULARES = [
    'Berserk vol. 32', 'One Piece vol. 100', 'Attack on Titan vol. 1', 
    'Demon Slayer vol. 1', 'Death Note vol. 1', 'Fullmetal Alchemist vol. 1',
    'Naruto vol. 1', 'Dragon Ball vol. 1', 'Sailor Moon vol. 1',
    'Ghost in the Shell', 'Akira', 'Vagabond vol. 1', 'Monster vol. 1',
    '20th Century Boys vol. 1', 'Gantz vol. 1', 'Tokyo Ghoul vol. 1',
    'Jujutsu Kaisen vol. 1', 'Chainsaw Man vol. 1', 'Spy x Family vol. 1',
    'My Hero Academia vol. 1', 'Hunter x Hunter vol. 1',
    'Watchmen', 'Sandman vol. 1', 'The Walking Dead vol. 1', 'V for Vendetta',
    'Batman: O Cavaleiro das Trevas', 'Batman: Ano Um', 'Superman: As Quatro Estações',
    'Spider-Man: Azul', 'X-Men: Dias de um Futuro Esquecido', 'Hellboy vol. 1',
    'Preacher vol. 1', 'Fables vol. 1', 'Saga vol. 1', 'Monstress vol. 1',
    'Paper Girls vol. 1', 'Descender vol. 1', 'Locke & Key vol. 1',
    'Duna - Frank Herbert', 'Fundação - Isaac Asimov', 'Neuromancer - William Gibson',
    'O Nome do Vento - Patrick Rothfuss', 'O Temor do Sábio - Patrick Rothfuss',
    'A Roda do Tempo vol. 1 - Robert Jordan', 'O Caminho dos Reis - Brandon Sanderson',
    'Palavras de Radiância - Brandon Sanderson', 'O Último Reino - Bernard Cornwell',
    'Os Pilares da Terra - Ken Follett', 'O Trono de Vidro - Sarah J. Maas',
    'Corte de Espinhos e Rosas - Sarah J. Maas', 'Six of Crows - Leigh Bardugo',
    'A Queda dos Deuses - Dan Simmons', 'Hyperion - Dan Simmons',
    'A Máquina do Tempo - H.G. Wells', 'O Mundo Perdido - Arthur Conan Doyle',
    'O Conto da Aia - Margaret Atwood', 'Os Testamentos - Margaret Atwood',
    'O Circo da Noite - Erin Morgenstern', 'A Biblioteca da Meia-Noite - Matt Haig',
    'Projeto Hail Mary - Andy Weir', 'O Marciano - Andy Weir',
    'A Quinta Onda - Rick Yancey', 'A Maze Runner - James Dashner'
];

const COMENTARIOS = [
    'Adorei!', 'Muito bom.', 'Interessante.', 'Recomendo.', 'Poderia ser melhor.',
    'Fantástico!', 'Leitura obrigatória.', 'Não gostei muito.', 'Excelente!', 'Mediano.',
    'Surpreendente!', 'Foi fraco.', 'Clássico!', 'Emocionante.', 'Divertido.',
    'Profundo.', 'Leve e gostoso.', 'Viciante.', 'Esperava mais.', 'Perfeito!',
    'Um dos melhores que já li!', 'Não é para qualquer um.', 'Me fez pensar muito.',
    'Ação do começo ao fim.', 'Final decepcionante.', 'Gostei da escrita.',
    'Personagens incríveis.', 'Mundo muito bem construído.', 'Ritmo lento demais.'
];

// ==========================================
// 5. FUNÇÃO DE SEED (usuários fixos + avaliações)
// ==========================================
async function seedDatabase() {
    try {
        const existing = await db.clientes.where('foto').notEqual('').toArray();
        if (existing.length >= 10) {
            console.warn(`⏭️ Já existem ${existing.length} usuários. Pulando seed.`);
            return;
        }

        if (existing.length > 0) {
            for (let u of existing) await db.clientes.delete(u.id);
            const ids = existing.map(u => u.id);
            await db.avaliacoes.where('usuario_id').anyOf(ids).delete();
            console.warn('🗑️ Usuários antigos removidos.');
        }

        console.warn('🌱 Criando 10 usuários fixos...');

        for (const usuario of USUARIOS_FIXOS) {
            const id = await db.clientes.add({
                nome: usuario.nome,
                apelido: usuario.apelido,
                cpf: usuario.cpf,
                foto: `static/src/avatares/${usuario.foto}`,
                livros_lidos: usuario.livros_lidos,
                media_estrelas: usuario.media_estrelas,
                lendo_agora: usuario.lendo_agora,
                senha: usuario.senha,
                nascimento: '1990-01-01',
                bio: ''
            });

            // Gera 5-8 avaliações para cada
            const numAval = Math.floor(Math.random() * 4) + 5;
            for (let j = 0; j < numAval; j++) {
                const livro = TITULOS_POPULARES[Math.floor(Math.random() * TITULOS_POPULARES.length)];
                const nota = parseFloat((Math.random() * 4 + 1).toFixed(1));
                const coment = COMENTARIOS[Math.floor(Math.random() * COMENTARIOS.length)];
                const dias = Math.floor(Math.random() * 60);
                const data = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                await db.avaliacoes.add({
                    livro,
                    usuario_id: id,
                    nota,
                    comentario: coment,
                    data
                });
            }
        }

        // Avaliações extras para o usuário teste
        const usuarioTeste = await db.clientes.where('cpf').equals('111.222.333-44').first();
        if (usuarioTeste) {
            const numAvalTeste = Math.floor(Math.random() * 4) + 4;
            for (let j = 0; j < numAvalTeste; j++) {
                const livro = TITULOS_POPULARES[Math.floor(Math.random() * TITULOS_POPULARES.length)];
                const nota = parseFloat((Math.random() * 4 + 1).toFixed(1));
                const coment = COMENTARIOS[Math.floor(Math.random() * COMENTARIOS.length)];
                const dias = Math.floor(Math.random() * 30);
                const data = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                await db.avaliacoes.add({
                    livro,
                    usuario_id: usuarioTeste.id,
                    nota,
                    comentario: coment,
                    data
                });
            }
        }

        console.warn('✅ Seed concluído.');
    } catch (err) {
        console.error('❌ Erro no seed:', err);
    }
}

// ==========================================
// 6. FUNÇÃO PARA POPULAR FRASES
// ==========================================
async function popularFrases() {
    const count = await db.frases.count();
    if (count === 0) {
        await db.frases.bulkAdd(FRASES_INICIAIS);
        console.warn('📝 Frases inicializadas.');
    }
}

// ==========================================
// 7. INICIALIZAÇÃO DO BANCO
// ==========================================
db.on('ready', async () => {
    try {
        console.warn('🔧 Inicializando banco...');

        // 1. Livros
        const countLivros = await db.livros.count();
        if (countLivros === 0) {
            await db.livros.bulkAdd(LIVROS_INICIAIS);
            console.warn(`📚 ${LIVROS_INICIAIS.length} livros inicializados.`);
        } else {
            console.warn(`📚 Já existem ${countLivros} livros. Pulando.`);
        }

        // 2. Cliente padrão
        const clientePadrao = await db.clientes.where('cpf').equals('111.222.333-44').first();
        if (!clientePadrao) {
            await db.clientes.add({
                nome: 'Usuário Teste',
                apelido: 'Teste',
                cpf: '111.222.333-44',
                nascimento: '1990-01-01',
                senha: '123456',
                foto: '',
                livros_lidos: 0,
                media_estrelas: 0,
                lendo_agora: '',
                bio: ''
            });
            console.warn('👤 Cliente padrão criado.');
        } else if (clientePadrao.senha !== '123456') {
            await db.clientes.update(clientePadrao.id, { senha: '123456' });
        }

        // 3. Corrigir senhas antigas
        const semSenha = await db.clientes.filter(c => !c.senha).toArray();
        for (let c of semSenha) {
            await db.clientes.update(c.id, { senha: '123456' });
            console.warn(`🔑 Cliente "${c.nome}" recebeu senha padrão.`);
        }

        // 4. Seed de usuários fixos
        await seedDatabase();

        // 5. Frases
        await popularFrases();

        console.warn('✅ Banco de dados pronto.');
    } catch (err) {
        console.error('❌ Erro na inicialização:', err);
    }
});