// Importa a função de validação de CPF
import { validarCPF } from './cadastroServico.js'; 

// RF004: Permite a edição dos dados cadastrais.
export function atualizarDadosPaciente(pacientesDB, idPaciente, novosDados) {
    const index = pacientesDB.findIndex(p => p.id === idPaciente);

    if (index === -1) {
        return { status: 'Erro', mensagem: 'Paciente não encontrado.' };
    }

    // Se o CPF for alterado, revalida
    if (novosDados.cpf && !validarCPF(novosDados.cpf)) {
        return { status: 'Erro', mensagem: 'Novo CPF inválido.' };
    }
    
    // Simula a atualização no banco (RF004)
    Object.assign(pacientesDB[index], novosDados);
    
    return { status: 'Sucesso', mensagem: 'Dados atualizados com sucesso (RF004).' };
}