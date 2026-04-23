import AICommandBox from '@/components/planejamento/AICommandBox'
import { BrainCircuit, Lightbulb } from 'lucide-react'

export const metadata = {
  title: 'Planejamento IA – BuildMind',
  description: 'Use inteligência artificial para desdobrar tarefas de obra em sub-etapas e insumos',
}

export default function PlanejamentoPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <BrainCircuit size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Planejamento Inteligente</h1>
          </div>
          <p className="text-sm ml-12" style={{ color: 'var(--text-muted)' }}>
            Descreva qualquer atividade de obra e a IA desdobra em sub-tarefas, insumos e estimativas de prazo e custo.
          </p>
        </div>

        {/* Tips banner */}
        <div className="rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Lightbulb size={16} style={{ color: '#a5b4fc', marginTop: 2, flexShrink: 0 }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#a5b4fc' }}>Dica de uso</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Quanto mais detalhada a descrição, melhor o resultado. Inclua dimensões, pavimento, especificação do material e quantidade quando possível.
              <br />Exemplo: <em style={{ color: 'var(--text-primary)' }}>"Concretar 5 pilares 30x60cm no pavimento térreo com concreto fck 25 MPa"</em>
            </p>
          </div>
        </div>

        <AICommandBox />
      </div>
    </div>
  )
}
