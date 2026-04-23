export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluido' | 'atrasado'
export type StatusObra = 'em_andamento' | 'concluida' | 'pausada' | 'planejamento'

export interface Obra {
  id: string
  nome: string
  descricao: string
  data_inicio: string
  data_fim_previsto: string
  orcamento_total: number
  custo_real: number
  progresso_total: number
  status: StatusObra
  responsavel: string
  localizacao: string
}

export interface Tarefa {
  id: string
  obra_id: string
  projeto?: string // Ex: Projeto 1 - Estacas, Infraestrutura, etc.
  parent_id?: string
  nome: string
  descricao: string
  responsavel: string
  data_inicio: string
  data_fim_previsto: string
  data_fim_real?: string
  percentual_conclusao: number
  status: StatusTarefa
  peso: number
  sub_tarefas?: Tarefa[]
  ocorrencias?: Ocorrencia[]
}

export interface Ocorrencia {
  id: string
  tarefa_id: string
  data_hora: string
  descricao: string
  importancia: 'baixa' | 'media' | 'alta' | 'critica'
  usuario: string
  incluir_no_relatorio: boolean
}

export interface Insumo {
  id: string
  obra_id: string
  tarefa_id?: string
  nome: string
  unidade: string
  quantidade_prevista: number
  quantidade_real: number
  custo_unitario: number
  fornecedor: string
  categoria: string
}

export interface CustoHistorico {
  mes: string
  custo_previsto: number
  custo_real: number
}

export interface KPIs {
  idc: number
  idp: number
  progresso_total: number
  custo_real: number
  orcamento_total: number
  tarefas_total: number
  tarefas_concluidas: number
  tarefas_atrasadas: number
}

export interface SubTarefaIA {
  nome: string
  projeto: string // Categoria/Etapa do projeto
  descricao: string
  duracao_dias: number
  insumos: InsumoIA[]
}

export interface InsumoIA {
  nome: string
  unidade: string
  quantidade: number
  custo_estimado: number
}

export interface RespostaIA {
  tarefa_principal: string
  sub_tarefas: SubTarefaIA[]
  prazo_total_dias: number
  custo_estimado_total: number
  observacoes: string
}

export interface RegistroDiario {
  id: string
  obra_id: string
  data: string
  clima: 'ensolarado' | 'nublado' | 'chuvoso'
  temperatura?: string
  observacoes: string
  falhas_obstaculos: string
  fotos: FotoRegistro[]
  mao_de_obra_total: number
}

export interface FotoRegistro {
  id: string
  url: string
  legenda: string
  categoria: 'progresso' | 'seguranca' | 'falha' | 'material'
  timestamp: string
}

export interface Funcionario {
  id: string
  nome: string
  cargo: string
  equipe: string // Ex: Equipe Civil, Equipe Hidráulica
  tipo: 'proprio' | 'terceirizado'
  salario_base?: number
  ativo: boolean
}

export interface RegistroPresenca {
  id: string
  funcionario_id: string
  data: string
  status: 'presente' | 'falta' | 'atestado' | 'ferias'
}
