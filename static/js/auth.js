import { db } from './db.js';

export const BIBLIOTECARIOS = [
    { usuario: "ana", senha: "ana123" },
    { usuario: "carlos", senha: "carlos456" }
];

export function verificarSessaoAdmin() {
    const logado = sessionStorage.getItem('logado') === 'true';
    const perfil = sessionStorage.getItem('perfil');
    if (!logado || perfil !== 'bibliotecario') {
        window.location.href = '../login.html'; // ou redirecione para login
        return false;
    }
    return true;
}

export function logout() {
    sessionStorage.clear();
    window.location.href = '../login.html';
}

// Função para obter o nome do admin logado
export function getAdminNome() {
    return sessionStorage.getItem('usuario') || 'Bibliotecário';
}