// ==========================================
// db.js – Configuração do Dexie (global)
// ==========================================

window.db = new Dexie('BibliotecaDB');

// ===== VERSÃO 5 =====
db.version(5).stores({
    clientes: '++id, cpf, nome, apelido, foto, livros_lidos, media_estrelas, lendo_agora',
    alugueis: '++id, cliente_id, status, livro',
    livros: '++id, titulo',
    solicitacoes: '++id, usuario_id',
    avaliacoes: '++id, livro, usuario_id, nota, comentario, data'
});

// ===== LISTA COMPLETA DE 100 LIVROS (mesma de antes) =====
const LIVROS_INICIAIS = [
    // ... mantém os 100 livros que você já tem (não vou repetir para não alongar)
    // ... mas você precisa manter a lista completa aqui
];

// ===== LISTA DE TÍTULOS POPULARES PARA AVALIAÇÕES (expandida) =====
const TITULOS_POPULARES = [
    // Mangás
    'Berserk vol. 32', 'One Piece vol. 100', 'Attack on Titan vol. 1', 
    'Demon Slayer vol. 1', 'Death Note vol. 1', 'Fullmetal Alchemist vol. 1',
    'Naruto vol. 1', 'Dragon Ball vol. 1', 'Sailor Moon vol. 1',
    'Ghost in the Shell', 'Akira', 'Vagabond vol. 1', 'Monster vol. 1',
    '20th Century Boys vol. 1', 'Gantz vol. 1', 'Tokyo Ghoul vol. 1',
    'Jujutsu Kaisen vol. 1', 'Chainsaw Man vol. 1', 'Spy x Family vol. 1',
    'My Hero Academia vol. 1', 'Hunter x Hunter vol. 1',

    // HQs
    'Watchmen', 'Sandman vol. 1', 'The Walking Dead vol. 1', 'V for Vendetta',
    'Batman: O Cavaleiro das Trevas', 'Batman: Ano Um', 'Superman: As Quatro Estações',
    'Spider-Man: Azul', 'X-Men: Dias de um Futuro Esquecido', 'Hellboy vol. 1',
    'Preacher vol. 1', 'Fables vol. 1', 'Saga vol. 1', 'Monstress vol. 1',
    'Paper Girls vol. 1', 'Descender vol. 1', 'Locke & Key vol. 1',

    // Livros de ficção / fantasia / sci-fi
    'Duna - Frank Herbert', 'Fundação - Isaac Asimov', 'Neuromancer - William Gibson',
    'O Nome do Vento - Patrick Rothfuss', 'O Temor do Sábio - Patrick Rothfuss',
    'A Roda do Tempo vol. 1 - Robert Jordan', 'O Caminho dos Reis - Brandon Sanderson',
    'Palavras de Radiância - Brandon Sanderson', 'O Último Reino - Bernard Cornwell',
    'Os Pilares da Terra - Ken Follett', 'O Trono de Vidro - Sarah J. Maas',
    'Corte de Espinhos e Rosas - Sarah J. Maas', 'Six of Crows - Leigh Bardugo',
    'A Queda dos Deuses - Dan Simmons', 'Hyperion - Dan Simmons',
    'A Máquina do Tempo - H.G. Wells', 'O Mundo Perdido - Arthur Conan Doyle',

    // Clássicos modernos
    'O Conto da Aia - Margaret Atwood', 'Os Testamentos - Margaret Atwood',
    'O Circo da Noite - Erin Morgenstern', 'A Biblioteca da Meia-Noite - Matt Haig',
    'Projeto Hail Mary - Andy Weir', 'O Marciano - Andy Weir',
    'A Quinta Onda - Rick Yancey', 'A Maze Runner - James Dashner',
];

// ===== USUÁRIOS FIXOS =====
const USUARIOS_FIXOS = [
    { nome: 'Julia Akemi', apelido: 'Juch', cpf: '111.111.111-11', foto: 'ju.jpg', livros_lidos: 25, media_estrelas: 4.5, lendo_agora: 'Evangelion', senha: '1234' },
    { nome: 'Gustavo Pelepe', apelido: 'Guspelepe', cpf: '222.222.222-22', foto: 'gu.jpg', livros_lidos: 10, media_estrelas: 3.5, lendo_agora: 'Haikyu', senha: '1234' },
    { nome: 'Ronaldo Karas', apelido: 'Karas', cpf: '333.333.333-33', foto: 'karas.jpg', livros_lidos: 12, media_estrelas: 4.0, lendo_agora: 'Python Avançado', senha: '1234' },
    { nome: 'Douglas Becker', apelido: 'Douglas404', cpf: '444.444.444-44', foto: 'douglas.jpg', livros_lidos: 14, media_estrelas: 3.0, lendo_agora: 'O Hobbit', senha: '1234' },
    { nome: 'Mariana Oliveira', apelido: 'Mary', cpf: '555.555.555-55', foto: 'mariana.jpg', livros_lidos: 18, media_estrelas: 4.2, lendo_agora: 'Dom Casmurro', senha: '1234' },
    { nome: 'Felipe Santos', apelido: 'Felps', cpf: '666.666.666-66', foto: 'felipe.jpg', livros_lidos: 9, media_estrelas: 3.8, lendo_agora: 'One Piece', senha: '1234' },
    { nome: 'Camila Ferreira', apelido: 'Cami', cpf: '777.777.777-77', foto: 'camila.jpg', livros_lidos: 30, media_estrelas: 4.9, lendo_agora: 'Orgulho e Preconceito', senha: '1234' },
    { nome: 'Lucas Almeida', apelido: 'Luquinhas', cpf: '888.888.888-88', foto: 'lucas.jpg', livros_lidos: 16, media_estrelas: 4.1, lendo_agora: 'Clean Code', senha: '1234' },
    { nome: 'Beatriz Costa', apelido: 'Bia', cpf: '999.999.999-99', foto: 'bia.jpg', livros_lidos: 21, media_estrelas: 4.7, lendo_agora: 'Percy Jackson', senha: '1234' },
    { nome: 'Henrique Martins', apelido: 'HMartins', cpf: '101.010.101-01', foto: 'henrique.jpg', livros_lidos: 13, media_estrelas: 3.9, lendo_agora: '1984', senha: '1234' }
];

// ===== COMENTÁRIOS PARA AVALIAÇÕES =====
const COMENTARIOS = [
    'Adorei!', 'Muito bom.', 'Interessante.', 'Recomendo.', 'Poderia ser melhor.',
    'Fantástico!', 'Leitura obrigatória.', 'Não gostei muito.', 'Excelente!', 'Mediano.',
    'Surpreendente!', 'Foi fraco.', 'Clássico!', 'Emocionante.', 'Divertido.',
    'Profundo.', 'Leve e gostoso.', 'Viciante.', 'Esperava mais.', 'Perfeito!',
    'Um dos melhores que já li!', 'Não é para qualquer um.', 'Me fez pensar muito.',
    'Ação do começo ao fim.', 'Final decepcionante.', 'Gostei da escrita.',
    'Personagens incríveis.', 'Mundo muito bem construído.', 'Ritmo lento demais.'
];

// ===== FUNÇÃO PARA GERAR AVALIAÇÕES EXTRAS =====
async function gerarAvaliacoesExtras() {
    try {
        const usuarios = await db.clientes.toArray();
        if (usuarios.length === 0) return;

        // Verifica quantas avaliações existem no total
        const totalAvaliacoes = await db.avaliacoes.count();
        if (totalAvaliacoes > 80) {
            console.log(`⏭️ Já existem ${totalAvaliacoes} avaliações. Pulando geração extra.`);
            return;
        }

        console.log(`🌱 Gerando avaliações extras para popular a comunidade...`);
        const novasAvaliacoes = [];

        for (const usuario of usuarios) {
            // Cada usuário gera mais 2-4 avaliações extras
            const numExtras = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numExtras; i++) {
                const livro = TITULOS_POPULARES[Math.floor(Math.random() * TITULOS_POPULARES.length)];
                const nota = parseFloat((Math.random() * 4 + 1).toFixed(1));
                const comentario = COMENTARIOS[Math.floor(Math.random() * COMENTARIOS.length)];
                const diasAtras = Math.floor(Math.random() * 60); // até 60 dias atrás
                const data = new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                novasAvaliacoes.push({
                    livro,
                    usuario_id: usuario.id,
                    nota,
                    comentario,
                    data
                });
            }
        }

        if (novasAvaliacoes.length > 0) {
            await db.avaliacoes.bulkAdd(novasAvaliacoes);
            console.log(`✅ ${novasAvaliacoes.length} avaliações extras adicionadas.`);
        }
    } catch (err) {
        console.error('❌ Erro ao gerar avaliações extras:', err);
    }
}

// ===== FUNÇÃO DE SEED (USUÁRIOS FIXOS) =====
async function seedDatabase() {
    try {
        const existing = await db.clientes.where('foto').notEqual('').toArray();
        if (existing.length >= 10) {
            console.log(`⏭️ Já existem ${existing.length} usuários. Pulando seed.`);
            // Mesmo que pule a criação, ainda gera avaliações extras
            await gerarAvaliacoesExtras();
            return;
        }

        if (existing.length > 0) {
            for (let u of existing) await db.clientes.delete(u.id);
            const ids = existing.map(u => u.id);
            await db.avaliacoes.where('usuario_id').anyOf(ids).delete();
            console.log('🗑️ Usuários antigos removidos.');
        }

        console.log('🌱 Criando 10 usuários fixos...');

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
                nascimento: '1990-01-01'
            });

            // Gera 5-8 avaliações por usuário (em vez de 2-4)
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

        // Gera avaliações extras para o Usuário Teste (se existir)
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

        console.log('✅ Seed concluído.');
        // Gera mais algumas avaliações extras para todos os usuários
        await gerarAvaliacoesExtras();

    } catch (err) {
        console.error('❌ Erro no seed:', err);
    }
}

// ===== INICIALIZAÇÃO =====
db.on('ready', async () => {
    try {
        console.log('🔧 Inicializando...');

        // 1. Livros
        const countLivros = await db.livros.count();
        if (countLivros === 0) {
            await db.livros.bulkAdd(LIVROS_INICIAIS);
            console.log('📚 Livros inicializados.');
        }

        // 2. Cliente padrão
        const clientePadrao = await db.clientes.where('cpf').equals('111.222.333-44').first();
        if (!clientePadrao) {
            await db.clientes.add({
                nome: 'Usuário Teste',
                apelido: 'Teste',
                cpf: '111.222.333-44',
                nascimento: '1990-01-01',
                senha: '123456'
            });
            console.log('👤 Cliente padrão criado.');
        } else if (clientePadrao.senha !== '123456') {
            await db.clientes.update(clientePadrao.id, { senha: '123456' });
        }

        // 3. Corrigir senhas
        const semSenha = await db.clientes.filter(c => !c.senha).toArray();
        for (let c of semSenha) {
            await db.clientes.update(c.id, { senha: '123456' });
        }

        // 4. Seed + avaliações extras
        await seedDatabase();

        console.log('✅ Banco pronto.');
    } catch (err) {
        console.error('❌ Erro:', err);
    }
});