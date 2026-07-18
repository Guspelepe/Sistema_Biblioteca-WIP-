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

/**
 * Valida um CPF verificando os dígitos verificadores.
 * @param {string} cpf - CPF com ou sem pontuação (ex.: "529.982.247-25")
 * @returns {boolean} true se for um CPF válido.
 */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // remove tudo que não é número

    if (cpf.length !== 11) return false;

    // Rejeita sequências de dígitos iguais (ex.: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}