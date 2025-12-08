// Importa a base de dados de pacientes (se houver, para verificar senha no login)
// import { pacientesDB } from '../main.js'; // Em um sistema real, buscaria no DB

// --- 1. PREVENÇÃO DE ATAQUES (RNF003) ---

// RNF003: Sanitização de dados para prevenir XSS (Injeção de Scripts - Teste T011)
export function validacaoEntrada(dado) {
    if (!dado) return '';
    // Substitui tags HTML para que não sejam interpretadas como código
    let sanitizado = dado.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return sanitizado;
}

// --- 2. CRIPTOGRAFIA (RNF001) ---

// RNF001: Simulação de função de criptografia para dados sensíveis (CPF, prontuário)
export function criptografar(dado) {
    if (!dado) return null;
    // Em produção: Usaria uma biblioteca forte (bcrypt para senha, AES para dados sensíveis).
    return `[CRIPTO_${dado}_HASH]`; 
}

// --- 3. CONTROLE DE ACESSO (RNF002) ---

// RNF002: Função auxiliar para verificar permissões de usuário
export function temPermissao(usuarioTipo, recurso) {
    const permissoes = {
        'PACIENTE': ['AGENDAR', 'VISUALIZAR_PROPRIO_PRONTUARIO'],
        'MEDICO': ['REGISTRAR_PRONTUARIO', 'PRESCREVER', 'VISUALIZAR_TODOS_PRONTUARIOS'],
        'ADMINISTRADOR': ['GERENCIAR_USUARIOS', 'VISUALIZAR_LOGS']
    };

    // Verifica se o tipo de usuário possui o recurso solicitado (Teste T010)
    return permissoes[usuarioTipo] && permissoes[usuarioTipo].includes(recurso);
}