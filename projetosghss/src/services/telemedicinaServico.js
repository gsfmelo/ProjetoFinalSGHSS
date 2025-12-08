// Simulação de base de dados para checar quem agendou a consulta
const consultasAgendadasDB = [
    { id: 100, pacienteId: 'PAC101', profissionalId: 'MED001', tipo: 'Telemedicina' },
    { id: 500, pacienteId: 'PAC102', profissionalId: 'MED002', tipo: 'Telemedicina' } // Usado para Teste T010
];

// Função auxiliar para simular geração de token seguro (RNF001)
const gerarTokenSala = (consultaId) => {
    // RNF001: Token Criptográfico para Sala Segura
    return `TOKEN_CRIPTO-${consultaId}-${Math.random().toString(36).substring(2, 10)}`;
};


// RF010, RF011, RNF002: Inicia a sala e verifica o acesso.
export function iniciarTeleconsulta(consultaId, usuarioLogadoId, tipoUsuario) {
    
    const consulta = consultasAgendadasDB.find(c => c.id == consultaId); // Usa == para evitar problemas de tipo
    
    if (!consulta) {
        return { status: 'Erro', mensagem: 'Consulta não encontrada.' };
    }

    // RF011 & RNF002: Validação de Identidade e Controle de Acesso
    if (tipoUsuario === 'PACIENTE' && consulta.pacienteId !== usuarioLogadoId) {
        // Teste T010 valida este bloqueio
        return { status: 'Acesso Negado', mensagem: 'Acesso negado. Usuário não é o paciente agendado.' };
    }
    
    // RF010 & RNF001: Geração da URL da sala protegida.
    const tokenSeguro = gerarTokenSala(consultaId);
    const urlSala = `https://telemedicina.vidaplus.com/${tokenSeguro}`;
    
    return { 
        status: 'Sucesso', 
        mensagem: 'Sala virtual protegida estabelecida.',
        url: urlSala 
    };
}
