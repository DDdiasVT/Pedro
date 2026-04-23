
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mpnmifbhbnmphtkedqtm.supabase.co';
const supabaseAnonKey = 'sb_publishable_X9PD3JR0no3TYe6cxzIHWA_nAA8HFwE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Iniciando preenchimento do banco...');

  // 1. Inserir Obra
  const { data: obra, error: errObra } = await supabase
    .from('obras')
    .insert([
      {
        nome: 'Residencial Vila Nova – Bloco A',
        descricao: 'Construção de edifício residencial de 12 andares',
        data_inicio: '2024-01-10',
        data_fim_previsto: '2025-12-20',
        orcamento_total: 2500000,
        custo_real: 840000,
        progresso_total: 65,
        status: 'em_andamento',
        responsavel: 'Eng. Pedro Silva',
        localizacao: 'Av. Paulista, 1000 - SP'
      }
    ])
    .select()
    .single();

  if (errObra) return console.error('Erro obra:', errObra);
  console.log('Obra criada:', obra.nome);

  // 2. Inserir Funcionários
  const { error: errFuncs } = await supabase
    .from('funcionarios')
    .insert([
      { nome: 'Ricardo Souza', cargo: 'Mestre de Obras', equipe: 'Geral', tipo: 'proprio' },
      { nome: 'João Pedro', cargo: 'Pedreiro', equipe: 'Equipe Civil', tipo: 'proprio' },
      { nome: 'Mateus Lima', cargo: 'Servente', equipe: 'Equipe Civil', tipo: 'proprio' },
      { nome: 'Carlos Oliveira', cargo: 'Eletricista', equipe: 'Equipe Elétrica', tipo: 'terceirizado' },
      { nome: 'Ana Paula', cargo: 'Engenheira Residente', equipe: 'Gestão', tipo: 'proprio' }
    ]);
  if (errFuncs) console.error('Erro funcionários:', errFuncs);
  else console.log('Funcionários criados.');

  // 3. Inserir Tarefas Iniciais
  const { error: errTarefas } = await supabase
    .from('tarefas')
    .insert([
      { obra_id: obra.id, projeto: 'Projeto 1 - Estrutura', nome: 'Concretar Pilares – Térreo', percentual_conclusao: 100, status: 'concluido', data_inicio: '2024-04-01', data_fim_previsto: '2024-04-15' },
      { obra_id: obra.id, projeto: 'Projeto 2 - Alvenaria', nome: 'Alvenaria – 3º Andar', percentual_conclusao: 75, status: 'em_andamento', data_inicio: '2024-04-10', data_fim_previsto: '2024-05-10' },
      { obra_id: obra.id, projeto: 'Projeto 0 - Fundação', nome: 'Impermeabilização Fundação', percentual_conclusao: 20, status: 'atrasado', data_inicio: '2024-03-20', data_fim_previsto: '2024-04-05' }
    ]);
  if (errTarefas) console.error('Erro tarefas:', errTarefas);
  else console.log('Tarefas criadas.');

  console.log('Banco de dados pronto para uso!');
}

seed();
