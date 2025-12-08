// Arquivo: main.js (INTERATIVO E ROBUSTO)

// Módulos nativos do Node.js para interação com o terminal
import * as readline from 'node:readline/promises'; 
import { stdin as input, stdout as output } from 'node:process';

// Importação dos Serviços (Lógica de Qualidade)
import { cadastrarPaciente } from './src/services/cadastroServico.js';
import { agendarAtendimento, listarHorariosDisponiveis } from './src/services/agendamentoServico.js';
import { iniciarTeleconsulta } from './src/services/telemedicinaServico.js';

// Configuração da interface de leitura
const rl = readline.createInterface({ input, output });

// --- 1. BASES DE DADOS SIMULADAS (PARA GERENCIAMENTO DE ESTADO) ---

const profissionaisDB = [
    { id: 'MED001', nome: 'Dra. Ana Costa', especialidade: 'Clínica Geral' },
    { id: 'MED002', nome: 'Dr. Pedro Souza', especialidade: 'Cardiologia' },
    { id: 'MED003', nome: 'Dra. Sofia Mendes', especialidade: 'Clínica Geral' },
    { id: 'MED004', nome: 'Dr. Lucas Ribeiro', especialidade: 'Dermatologia' },
    { id: 'MED005', nome: 'Dra. Isabela Lima', especialidade: 'Cardiologia' }
];

let pacientesDB = []; // Onde os novos pacientes serão armazenados (RF001)

// Simulação de agendamentos para teste de bloqueio (RF006)
const agendamentosDB = [
    // Horário Ocupado para MED001 em 2025-12-15 (Teste de Bloqueio T005)
    { profissionalId: 'MED001', data: '2025-12-15', horario: '10:00', status: 'Agendado', pacienteId: 'PAC101' },
    // Horário Ocupado para MED004 em 2025-12-20
    { profissionalId: 'MED004', data: '2025-12-20', horario: '14:00', status: 'Agendado', pacienteId: 'PAC102' }
];


// --- 2. FUNÇÕES AUXILIARES DE FLUXO E AUTENTICAÇÃO ---

let ultimoIdPaciente = 100;

async function fluxoCadastro() {
    console.log("\n--- NOVO CADASTRO DE PACIENTE (RF001, RF002) ---");

    const nome = await rl.question('1. Nome Completo: ');
    const email = await rl.question('2. E-mail: ');
    const celular = await rl.question('3. Número de Celular: ');
    const cpf = await rl.question('4. CPF: ');
    const dataNascimento = await rl.question('5. Data de Nascimento (AAAA-MM-DD): ');
    const senha = await rl.question('6. Crie sua Senha: ');

    const dadosCadastro = { nome, email, telefone: celular, cpf, dataNascimento, senha };

    // Chamada à lógica de QUALIDADE do serviço (validação de CPF, campos obrigatórios)
    const resultadoValidacao = cadastrarPaciente(dadosCadastro); 
    
    if (resultadoValidacao.status === 'Sucesso') {
        // Se passar nas validações do serviço (RF002, RF003), simula o armazenamento
        ultimoIdPaciente++;
        const novoPaciente = {
            id: `PAC${ultimoIdPaciente}`,
            ...dadosCadastro,
            // RNF001: Simula que a senha e o CPF seriam CRIPTOGRAFADOS
            senha: `HASH_${senha}`, 
            cpf: `CRIPTO_${cpf}`, 
            tipo: 'PACIENTE'
        };
        pacientesDB.push(novoPaciente);
        console.log(`\n✅ Sucesso! Paciente ${novoPaciente.id} cadastrado. Use o CPF '${cpf}' e a senha para login.`);
    } else {
        console.log(`\n❌ ERRO: ${resultadoValidacao.mensagem}`);
    }
}

async function fluxoLogin() {
    console.log("\n--- LOGIN DO PACIENTE ---");
    const cpf = await rl.question('CPF para Login: ');
    const senha = await rl.question('Senha: ');

    // Simula a busca e a comparação com os dados "criptografados"
    const pacienteLogado = pacientesDB.find(p => p.cpf === `CRIPTO_${cpf}` && p.senha === `HASH_${senha}`);
    
    if (pacienteLogado) {
        console.log(`\n🎉 Login bem-sucedido. Bem-vindo(a), ${pacienteLogado.nome}!`);
        return pacienteLogado;
    } else {
        console.log("\n❌ Erro: CPF ou senha incorretos.");
        return null;
    }
}

function listarEspecialidades() {
    const especialidades = [...new Set(profissionaisDB.map(p => p.especialidade))];
    console.log("\nEspecialidades Disponíveis:");
    especialidades.forEach((e, index) => console.log(`${index + 1}. ${e}`));
    return especialidades;
}

function listarProfissionaisPorEspecialidade(especialidade) {
    return profissionaisDB.filter(p => p.especialidade === especialidade);
}

// --- 3. FLUXOS DE SERVIÇO (AGORA RECEBEM O USUÁRIO LOGADO) ---

async function simularAgendamento(usuarioLogado) {
    console.log("\n--- SIMULAÇÃO DE AGENDAMENTO (RF005, RF006, RNF004) ---");

    // 1. SELEÇÃO DA ESPECIALIDADE (MELHOR USABILIDADE)
    const especialidades = listarEspecialidades();
    const escolhaIndex = await rl.question('1. Digite o número da especialidade desejada: ');
    const especialidadeSelecionada = especialidades[parseInt(escolhaIndex) - 1];

    if (!especialidadeSelecionada) {
        console.log("Opção inválida.");
        return;
    }

    // 2. LISTAGEM DE PROFISSIONAIS NA ESPECIALIDADE
    const medicosEspecialidade = listarProfissionaisPorEspecialidade(especialidadeSelecionada);
    console.log(`\nProfissionais em ${especialidadeSelecionada}:`);
    medicosEspecialidade.forEach(p => {
        console.log(`ID: ${p.id} | Nome: ${p.nome}`); // Mostra o ID para seleção (como em um formulário)
    });
    
    const profissionalId = await rl.question('2. Digite o ID do profissional desejado (Ex: MED001): ');
    const profissionalEncontrado = medicosEspecialidade.find(p => p.id === profissionalId);

    if (!profissionalEncontrado) {
        console.log("Erro: ID de profissional não encontrado na lista.");
        return;
    }
    
    // 3. SELEÇÃO DE DATA E HORÁRIO (RF005/RF006)
    const data = await rl.question('3. Data da Consulta (Ex: 2025-12-15): ');

    // Chamada à função que lista horários disponíveis (RF006)
    // OBS: Você precisará adaptar a função listarHorariosDisponiveis no seu agendamentoServico.js 
    // para buscar na lista agendamentosDB que definimos no topo do main.js.
    
    // ATENÇÃO: Se as funções de agendamento não puderem acessar agendamentosDB, você deve movê-lo para o serviço
    // ou passá-lo como parâmetro para rodar o teste de bloqueio T005.

    const horariosDisponiveis = listarHorariosDisponiveis(profissionalId, data);
    
    if (horariosDisponiveis.length === 0) {
        console.log("\n[RESULTADO]: Não há horários disponíveis. Tente outro dia.");
        return;
    }
    
    console.log(`\nHorários Disponíveis (RF006): ${horariosDisponiveis.join(', ')}`);
    const horario = await rl.question('4. Escolha o Horário (apenas os listados): ');

    if (!horariosDisponiveis.includes(horario)) {
         console.log("\n[RESULTADO DO SISTEMA]: ERRO! Horário digitado não está disponível na lista.");
         return;
    }

    // 4. CHAMADA FINAL (RF005)
    const resultado = agendarAtendimento(usuarioLogado.id, profissionalId, data, horario);

    console.log("\n[RESULTADO DO SISTEMA]:");
    console.log(`Status: ${resultado.status}`);
    console.log(`Mensagem: ${resultado.mensagem}`);
    
    if (resultado.status === 'Sucesso') {
        // Se for sucesso, adiciona na base de dados simulada para bloquear futuros agendamentos (T005)
        agendamentosDB.push({ profissionalId, data, horario, status: 'Agendado', pacienteId: usuarioLogado.id });
    }
}


async function simularTeleconsulta(usuarioLogado) {
    console.log("\n--- SIMULAÇÃO DE TELECONSULTA (RF011, RNF002) ---");

    // O sistema listaria as consultas agendadas para o usuarioLogado.id...
    console.log(`Você está logado como: ${usuarioLogado.id}`);
    const consultaId = await rl.question('1. ID da Consulta que deseja acessar (Ex: 500 para falha de acesso): ');
    
    // Chama a função de serviço (inclui RF011: Identificação de Acesso)
    const resultado = iniciarTeleconsulta(consultaId, usuarioLogado.id, usuarioLogado.tipo);

    console.log("\n[RESULTADO DO SISTEMA]:");
    console.log(`Status: ${resultado.status}`);
    console.log(`Mensagem: ${resultado.mensagem}`);
    if (resultado.url) {
        console.log(`URL da Sala: ${resultado.url}`);
    }
}


// --- Função Principal (Main) ---

async function main() {
    // ... (Código da função main que gerencia o menu e o loop, conforme o envio anterior)
    console.log("\n=======================================================");
    console.log("PROJETO SGHSS: SIMULADOR INTERATIVO DE QUALIDADE DE SOFTWARE");
    console.log("=======================================================");

    let continuar = true;
    let usuarioLogado = null; 

    while (continuar) {
        if (!usuarioLogado) {
            console.log("\n[STATUS: DESLOGADO]");
            console.log("1. Novo Cadastro");
            console.log("2. Login");
            console.log("5. Sair");
            
            const escolha = await rl.question('Escolha a opção (1, 2, ou 5): ');
            
            switch (escolha.trim()) {
                case '1':
                    await fluxoCadastro();
                    break;
                case '2':
                    usuarioLogado = await fluxoLogin();
                    break;
                case '5':
                    continuar = false;
                    break;
                default:
                    console.log("Opção inválida.");
            }
        } else {
            // -- MENUS DE AÇÕES (REQUER AUTENTICAÇÃO) --
            console.log(`\n[STATUS: LOGADO como ${usuarioLogado.nome}]`);
            console.log("3. Agendar Consulta (RF005, RF006)");
            console.log("4. Iniciar Teleconsulta (RF011, RNF002)");
            console.log("6. Logout");
            console.log("7. Sair do Sistema");

            const escolha = await rl.question('Escolha a opção (3, 4, 6, ou 7): ');

            switch (escolha.trim()) {
                case '3':
                    await simularAgendamento(usuarioLogado); // Passa o usuário logado
                    break;
                case '4':
                    await simularTeleconsulta(usuarioLogado); // Passa o usuário logado
                    break;
                case '6':
                    usuarioLogado = null;
                    console.log("Sessão encerrada.");
                    break;
                case '7':
                    continuar = false;
                    break;
                default:
                    console.log("Opção inválida.");
            }
        }
    }
    rl.close();
    console.log("Simulação de SGHSS encerrada.");
}

// Inicia a aplicação
main();