import { validacaoEntrada } from '../utils/seguranca.js'; 

// Valida se o CPF é formalmente válido (RF002)
export function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); 
    
    // Validação básica de formato e sequência inválida
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    return true; 
}

// Valida e cadastra um novo paciente (RF001, RF002, RF003)
export function cadastrarPaciente(dadosPaciente) {
    
    // Valida se os campos obrigatórios estão preenchidos. (RF003)
    if (!dadosPaciente.nome || !dadosPaciente.cpf || !dadosPaciente.dataNascimento || !dadosPaciente.senha) {
        return { status: 'Erro', mensagem: 'Campos obrigatórios (Nome, CPF, Data de Nascimento, Senha) não preenchidos.' };
    }

    // Validação de CPF. (RF002)
    if (!validarCPF(dadosPaciente.cpf)) {
        return { status: 'Erro', mensagem: 'CPF inválido. Por favor, verifique o formato.' };
    }

    // Aplica sanitização em dados textuais antes de salvar (Prevenção de Ataques, RNF003) 
    dadosPaciente.nome = validacaoEntrada(dadosPaciente.nome);

    // Se passar nas validações, retorna sucesso (RF001)
    return { status: 'Sucesso', mensagem: 'Paciente cadastrado com sucesso.' };
}
