class Paciente {
    constructor(nome, cpf, dataNascimento, telefone, email) {
        // RF001: Campos obrigatórios para o cadastro
        this.nome = nome;
        this.cpf = cpf; // Criptografado no DB (RNF001)
        this.dataNascimento = dataNascimento; 
        
        // Outros dados
        this.telefone = telefone;
        this.email = email;
        this.prontuarios = []; // Relacionamento com prontuário
        this.dataCadastro = new Date();
    }
    
    // Métodos para gestão de dados do paciente
    atualizarDados(novosDados) {
        // Lógica de atualização
        // ...
    }
}