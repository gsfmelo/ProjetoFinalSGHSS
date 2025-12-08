class Agendamento {
    constructor(pacienteId, profissionalId, data, horario, tipoConsulta) {
        // RF005 e RF006: Dados centrais para o agendamento
        this.id = Math.random().toString(36).substring(2, 9); // ID único
        this.pacienteId = pacienteId;
        this.profissionalId = profissionalId;
        this.data = data;
        this.horario = horario;
        this.tipoConsulta = tipoConsulta; // Ex: Telemedicina ou Presencial
        this.status = 'Agendado'; // RF007: Pode ser Cancelado

        // Dados de registro para a Telemedicina (RF013)
        this.dataRegistroTeleconsulta = null; 
    }
    
    // Método para ser usado pelo C007
    cancelar() {
        this.status = 'Cancelado';
    }
}