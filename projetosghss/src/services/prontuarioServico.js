// Simulação de base de prontuários
const prontuariosDB = []; 
const agendamentosDB = []; // Simulação de consulta à base de agendamentos

// C006 / RF008 / RF009: Registra o prontuário e conclui o atendimento.
export function registrarAtendimento(consultaId, medicoId, dadosProntuario) {
    
    // Simula a busca do agendamento para verificar se o médico é o responsável
    const consulta = agendamentosDB.find(a => a.id === consultaId && a.profissionalId === medicoId);

    if (!consulta) {
        return { status: 'Erro', mensagem: 'Consulta não encontrada ou acesso negado.' };
    }
    
    // RF009: Salva as informações clínicas
    prontuariosDB.push({ consultaId, medicoId, dataRegistro: new Date(), ...dadosProntuario });

    // RF008: Marca o atendimento como concluído
    consulta.status = 'Concluída'; 
    
    return { status: 'Sucesso', mensagem: 'Prontuário e atendimento registrados (RF008, RF009).' };
}

// C007 / RF014: Emite a receita digital.
export function emitirPrescricao(consultaId, medicoId, itensPrescricao) {
    // Simula a verificação de permissão e geração de documento
    
    const prescricao = {
        id: Math.random(),
        consultaId,
        medicoId,
        dataEmissao: new Date(),
        itens: itensPrescricao
    };

    // RF014: Simula a geração e assinatura digital
    // database.prescricoes.save(prescricao);

    return { status: 'Sucesso', mensagem: 'Prescrição Digital emitida (RF014).' };
}