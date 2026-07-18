// ============================================================
// utils.js – Funções utilitárias globais
// ============================================================

function aguardarBanco() {
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

function notificar(mensagem, tipo = 'sucesso') {
    const notifUser = document.getElementById('notificacao-user');
    const notifAdmin = document.getElementById('notificacao');
    const notif = notifUser || notifAdmin;
    if (!notif) {
        console.warn('Elemento de notificação não encontrado.');
        return;
    }
    notif.textContent = mensagem;
    const baseClass = notifUser ? 'notificacao-user' : 'notificacao';
    notif.className = baseClass + (tipo === 'erro' ? ' erro' : '');
    notif.style.display = 'block';
    setTimeout(() => {
        notif.style.display = 'none';
    }, 4000);
}

function mascararCPF(input) {
    let cpf = input.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.substring(0, 11);
    let formatado = cpf;
    if (cpf.length > 3) formatado = cpf.substring(0, 3) + '.' + cpf.substring(3);
    if (cpf.length > 6) formatado = formatado.substring(0, 7) + '.' + cpf.substring(6);
    if (cpf.length > 9) formatado = formatado.substring(0, 11) + '-' + cpf.substring(9);
    input.value = formatado;
}

function toggleSenha(inputId, botao) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        botao.textContent = '🙈';
    } else {
        input.type = 'password';
        botao.textContent = '👁️';
    }
}