// Estes dados precisam ser exportados para o main.js usá-los no fluxo de teste de bloqueio
export const agendamentosDB = [
    // Horário Ocupado para MED001 em 2025-12-15 (Teste de Bloqueio T005)
    { profissionalId: 'MED001', data: '2025-12-15', horario: '10:00', status: 'Agendado', pacienteId: 'PAC101' },
    // Horário Ocupado para MED004 em 2025-12-20
    { profissionalId: 'MED004', data: '2025-12-20', horario: '14:00', status: 'Agendado', pacienteId: 'PAC102' }
];

export const profissionaisDB = [
    { id: 'MED001', nome: 'Dra. Ana Costa', especialidade: 'Clínica Geral' },
    { id: 'MED002', nome: 'Dr. Pedro Souza', especialidade: 'Cardiologia' },
    { id: 'MED003', nome: 'Dra. Sofia Mendes', especialidade: 'Clínica Geral' },
    { id: 'MED004', nome: 'Dr. Lucas Ribeiro', especialidade: 'Dermatologia' },
    { id: 'MED005', nome: 'Dra. Isabela Lima', especialidade: 'Cardiologia' }
];

const horariosPadrao = ['09:00', '10:00', '11:00', '14:00', '15:00']; 

// --- FUNÇÕES DE LÓGICA (EXPORTADAS) ---

// RF006: Lista os horários disponíveis para um profissional em uma data.
export function listarHorariosDisponiveis(profissionalId, data) {
    const todosHorarios = horariosPadrao;
    
    // Filtra os agendamentos ocupados
    const horariosOcupados = agendamentosDB
        .filter(a => 
            a.profissionalId === profissionalId && 
            a.data === data && 
            a.status === 'Agendado'
        )
        .map(a => a.horario);
        
    // Retorna apenas os horários que não estão ocupados (RF006)
    return todosHorarios.filter(h => !horariosOcupados.includes(h));
}

// RF005, RF006: Tenta agendar um atendimento.
export function agendarAtendimento(pacienteId, profissionalId, data, horario) {
    
    const disponiveis = listarHorariosDisponiveis(profissionalId, data);
    
    // RF006: O sistema deve bloquear os horários ocupados.
    if (!disponiveis.includes(horario)) {
        return { status: 'Erro', mensagem: 'Horário indisponível ou já foi reservado.' };
    }
    
    // Simulação de registro de novo agendamento
    const novoAgendamento = { pacienteId, profissionalId, data, horario, status: 'Agendado' };
    agendamentosDB.push(novoAgendamento); 
    
    return { status: 'Sucesso', mensagem: 'Consulta agendada com sucesso.' };
}

// RF007: Permite que o paciente cancele uma consulta.
export function cancelarConsulta(consultaId) {
    const index = agendamentosDB.findIndex(a => a.id === consultaId && a.status === 'Agendado');
    
    if (index === -1) {
        return { status: 'Erro', mensagem: 'Consulta não encontrada ou já cancelada.' };
    }
    
    // RF007: Atualiza o status e libera o horário
    agendamentosDB[index].status = 'Cancelada';
    return { status: 'Sucesso', mensagem: 'Consulta cancelada e horário liberado.' };
}