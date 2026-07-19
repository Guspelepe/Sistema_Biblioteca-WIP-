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

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}

/**
 * Converte string de data (ISO yyyy-mm-dd ou brasileiro dd/mm/aaaa) para objeto Date.
 * Retorna null se a data for inválida.
 */
function parseData(str) {
    if (!str) return null;
    if (str.includes('-') && str.length === 10) {
        const d = new Date(str + 'T00:00:00');
        return isNaN(d) ? null : d;
    }
    if (str.includes('/')) {
        const partes = str.split('/');
        if (partes.length === 3) {
            const d = new Date(partes[2], partes[1] - 1, partes[0]);
            return isNaN(d) ? null : d;
        }
    }
    return null;
}

/**
 * Exibe modal de multa com créditos da equipe.
 * @param {number} diasAtraso
 * @param {number} multa
 * @returns {Promise<boolean>} true se confirmado, false se cancelado
 */
function exibirModalMulta(diasAtraso, multa) {
    return new Promise((resolve) => {
        const existente = document.getElementById('modal-multa');
        if (existente) existente.remove();

        const modal = document.createElement('div');
        modal.id = 'modal-multa';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;';
        modal.innerHTML = `
            <div style="background:#fff; padding:30px; border-radius:8px; max-width:450px; width:90%; text-align:center;">
                <h3 style="color:#e74c3c;">⚠️ Devolução com Atraso</h3>
                <p>Atraso de <strong>${diasAtraso} dia(s)</strong>.</p>
                <p>Multa: <strong>R$ ${multa.toFixed(2)}</strong></p>
                <button id="btn-pagar" style="margin:10px; padding:10px 20px; background:#27ae60; color:#fff; border:none; border-radius:5px; cursor:pointer;">Pagar</button>
                <button id="btn-cancelar" style="margin:10px; padding:10px 20px; background:#e74c3c; color:#fff; border:none; border-radius:5px; cursor:pointer;">Cancelar</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-cancelar').onclick = () => { modal.remove(); resolve(false); };
        document.getElementById('btn-pagar').onclick = () => {
            modal.querySelector('div').innerHTML = `
                <h3>👨‍💻 Desenvolvido por:</h3>
                <div style="text-align:left; margin:20px 0;">
                    <p><a href="https://github.com/Guspelepe" target="_blank">@Guspelepe</a> - Gustavo Pelepe</p>
                    <p><a href="https://github.com/ronaldokaras" target="_blank">@ronaldokaras</a> - Ronaldo Karas</p>
                    <p><a href="https://github.com/douglasbecker404" target="_blank">@douglasbecker404</a> - Douglas Becker</p>
                </div>
                <button id="btn-confirmar-devolucao" style="margin:10px; padding:10px 20px; background:#3498db; color:#fff; border:none; border-radius:5px; cursor:pointer;">Confirmar Devolução</button>
                <button id="btn-voltar" style="margin:10px; padding:10px 20px; background:#95a5a6; color:#fff; border:none; border-radius:5px; cursor:pointer;">Voltar</button>
            `;
            document.getElementById('btn-confirmar-devolucao').onclick = () => { modal.remove(); resolve(true); };
            document.getElementById('btn-voltar').onclick = () => { modal.remove(); resolve(false); };
        };
    });
}

/**
 * Realiza logout limpando a sessão e redirecionando para index.html
 */
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}