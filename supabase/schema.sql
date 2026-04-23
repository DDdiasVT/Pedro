-- BUILDMIND DATABASE SCHEMA

-- 1. Obras
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim_previsto DATE NOT NULL,
  orcamento_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  custo_real DECIMAL(15,2) NOT NULL DEFAULT 0,
  progresso_total INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planejamento',
  responsavel TEXT,
  localizacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Funcionários
CREATE TABLE funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  equipe TEXT,
  tipo TEXT NOT NULL, -- 'proprio' ou 'terceirizado'
  salario_base DECIMAL(15,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tarefas
CREATE TABLE tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  projeto TEXT, -- ex: 'Fundaçao', 'Estrutura'
  parent_id UUID REFERENCES tarefas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  responsavel TEXT,
  data_inicio DATE,
  data_fim_previsto DATE,
  data_fim_real DATE,
  percentual_conclusao INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pendente',
  peso INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Ocorrências das Tarefas
CREATE TABLE ocorrencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tarefa_id UUID REFERENCES tarefas(id) ON DELETE CASCADE,
  data_hora TIMESTAMP WITH TIME ZONE DEFAULT now(),
  descricao TEXT NOT NULL,
  importancia TEXT DEFAULT 'media',
  usuario TEXT,
  incluir_no_relatorio BOOLEAN DEFAULT true
);

-- 5. Insumos
CREATE TABLE insumos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  tarefa_id UUID REFERENCES tarefas(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  unidade TEXT NOT NULL,
  quantidade_prevista DECIMAL(15,3) NOT NULL,
  quantidade_real DECIMAL(15,3) DEFAULT 0,
  custo_unitario DECIMAL(15,2) NOT NULL,
  fornecedor TEXT,
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Diário de Obra (Cabeçalho do dia)
CREATE TABLE registros_diarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  clima TEXT,
  temperatura TEXT,
  observacoes TEXT,
  falhas_obstaculos TEXT,
  mao_de_obra_total INTEGER DEFAULT 0,
  UNIQUE(obra_id, data)
);

-- 7. Fotos do Diário
CREATE TABLE fotos_diario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registro_diario_id UUID REFERENCES registros_diarios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  legenda TEXT,
  categoria TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Presença de Funcionários
CREATE TABLE registros_presenca (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL, -- 'presente', 'falta', 'atestado'
  UNIQUE(funcionario_id, data)
);

-- 9. Histórico de Planejamento IA (Opcional, para persistência)
CREATE TABLE historico_ia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id TEXT,
  pergunta TEXT NOT NULL,
  resposta JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Realtime para tudo
ALTER PUBLICATION supabase_realtime ADD TABLE tarefas;
ALTER PUBLICATION supabase_realtime ADD TABLE ocorrencias;
ALTER PUBLICATION supabase_realtime ADD TABLE registros_presenca;
ALTER PUBLICATION supabase_realtime ADD TABLE insumos;
