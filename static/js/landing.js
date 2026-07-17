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

    // ===== LÓGICA DE LOGIN (mesma de antes) =====
    const form = document.getElementById('login-form');
    const erro = document.getElementById('erro');

    if (sessionStorage.getItem('logado') === 'true') {
        const perfil = sessionStorage.getItem('perfil');
        if (perfil === 'bibliotecario') {
            window.location.href = 'admin.html';
        } else if (perfil === 'usuario') {
            window.location.href = 'user.html';
        }
        return;
    }

    if (typeof db === 'undefined') {
        console.error('Banco de dados não encontrado!');
        erro.textContent = 'Erro ao carregar o banco de dados. Recarregue a página.';
        erro.style.display = 'block';
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        erro.style.display = 'none';

        const identificador = document.getElementById('identificador').value.trim();
        const senha = document.getElementById('senha').value.trim();

        // ===== 1. Login bibliotecário =====
        if (identificador === 'ACESSORESTRITO' && senha === '1234') {
            sessionStorage.setItem('logado', 'true');
            sessionStorage.setItem('perfil', 'bibliotecario');
            sessionStorage.setItem('usuario', 'Bibliotecário');
            window.location.href = 'admin.html';
            return;
        }

        // ===== 2. Login usuário comum =====
        const cpfLimpo = identificador.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) {
            erro.textContent = 'CPF deve conter 11 dígitos.';
            erro.style.display = 'block';
            return;
        }

        try {
            const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            const cliente = await db.clientes.where({ cpf: cpfFormatado }).first();

            if (cliente && cliente.senha === senha) {
                sessionStorage.setItem('logado', 'true');
                sessionStorage.setItem('perfil', 'usuario');
                sessionStorage.setItem('usuario', cliente.nome);
                sessionStorage.setItem('usuarioId', cliente.id);
                sessionStorage.setItem('cpf', cliente.cpf);
                window.location.href = 'user.html';
            } else {
                erro.textContent = 'CPF ou senha inválidos.';
                erro.style.display = 'block';
            }
        } catch (err) {
            console.error('Erro no login:', err);
            erro.textContent = 'Erro ao conectar com o banco de dados. Tente novamente.';
            erro.style.display = 'block';
        }
    });
});