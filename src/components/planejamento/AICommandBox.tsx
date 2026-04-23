'use client'

import { useState } from 'react'
import { BrainCircuit, Loader2, ChevronDown, ChevronUp, Plus, Package, Clock, DollarSign, Sparkles, Send } from 'lucide-react'
import type { RespostaIA } from '@/types'
import { formatCurrency } from '@/lib/utils'

async function gerarPlanejamento(tarefa: string): Promise<RespostaIA> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tarefa }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(err.error || `Erro ${res.status}`)
  }

  return res.json()
}


export default function AICommandBox() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<RespostaIA | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [expandedTask, setExpandedTask] = useState<number | null>(0)
  const [savedTasks, setSavedTasks] = useState<string[]>([])
  const [historico, setHistorico] = useState<RespostaIA[]>([])

  const exemplos = ['Concretar 5 pilares', 'Assentar alvenaria 3º andar', 'Instalar tubulação hidráulica', 'Revestimento cerâmico fachada']

  const handleGerar = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResultado(null)
    setErro(null)
    try {
      const res = await gerarPlanejamento(input)
      setResultado(res)
      setHistorico(prev => [res, ...prev.slice(0, 9)]) // Mantém os últimos 10
      setExpandedTask(0)
    } catch (e: any) {
      setErro(e.message || 'Erro ao gerar planejamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar: History */}
      <div className="lg:col-span-1 space-y-4">
        <div className="rounded-xl p-4 h-full flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <div className="flex items-center gap-2 mb-4 text-white">
            <Clock size={16} className="text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Histórico</h3>
          </div>
          
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[600px] pr-2">
            {historico.length === 0 ? (
              <div className="py-8 text-center opacity-30">
                <p className="text-[10px] uppercase font-black">Nenhum registro</p>
              </div>
            ) : (
              historico.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setResultado(item)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all group",
                    resultado?.tarefa_principal === item.tarefa_principal 
                      ? "bg-indigo-500/10 border-indigo-500/40" 
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <p className="text-xs font-bold text-white truncate">{item.tarefa_principal}</p>
                  <div className="flex items-center justify-between mt-1 opacity-50 group-hover:opacity-100">
                    <span className="text-[9px] uppercase font-black">{item.prazo_total_dias} dias</span>
                    <span className="text-[9px] uppercase font-black text-indigo-400">{formatCurrency(item.custo_estimado_total)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
          
          {historico.length > 0 && (
            <button 
              onClick={() => setHistorico([])}
              className="mt-4 text-[10px] font-bold text-zinc-500 hover:text-rose-400 transition-colors uppercase flex items-center justify-center gap-2"
            >
              <Trash2 size={12} /> Limpar Histórico
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Input & Result */}
      <div className="lg:col-span-3 space-y-5">
        {/* Input Box */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid rgba(99,102,241,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <BrainCircuit size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Comando de IA</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Descreva a tarefa e a IA gera o planejamento completo</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Sparkles size={11} />Gemini
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {exemplos.map((ex) => (
                <button key={ex} onClick={() => setInput(ex)} className="text-xs px-3 py-1.5 rounded-full transition-all" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {ex}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <textarea
                id="ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Concretar 5 pilares no pavimento térreo usando concreto fck 25..."
                rows={3}
                className="input-dark flex-1 resize-none text-sm"
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGerar() }}
              />
              <button id="ai-generate-btn" onClick={handleGerar} disabled={loading || !input.trim()} className="btn-primary self-end px-5 py-3">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} />Gerar</>}
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Ctrl+Enter para gerar</p>
          </div>
        </div>

        {/* Error */}
        {erro && !loading && (
          <div className="rounded-xl px-5 py-4 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <span style={{ color: '#f87171', fontSize: 18 }}>⚠️</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#f87171' }}>Erro ao gerar planejamento</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{erro}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl p-8 flex flex-col items-center gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div style={{ position: 'relative', width: 64, height: 64 }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <BrainCircuit size={28} style={{ color: '#6366f1' }} />
              </div>
              <div className="absolute inset-0 rounded-full spin-slow" style={{ border: '2px solid transparent', borderTopColor: '#6366f1' }} />
            </div>
            <p className="text-sm font-semibold text-white">Processando com IA…</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Analisando e gerando sub-tarefas e insumos</p>
          </div>
        )}

        {/* Result */}
        {resultado && !loading && (
          <div className="space-y-4">
            <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} style={{ color: '#a5b4fc' }} />
                <h3 className="text-sm font-semibold text-white">Plano: <span style={{ color: '#a5b4fc' }}>{resultado.tarefa_principal}</span></h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { icon: <Package size={14} />, label: 'Sub-tarefas', value: resultado.sub_tarefas.length },
                  { icon: <Clock size={14} />, label: 'Prazo Total', value: `${resultado.prazo_total_dias} dias` },
                  { icon: <DollarSign size={14} />, label: 'Custo Est.', value: formatCurrency(resultado.custo_estimado_total) },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg p-3 text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                    <div className="flex justify-center mb-1" style={{ color: 'var(--text-muted)' }}>{item.icon}</div>
                    <p className="text-base font-bold text-white">{item.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg px-4 py-3 text-xs leading-relaxed" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                ⚠️ {resultado.observacoes}
              </div>
            </div>

            {resultado.sub_tarefas.map((st, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                <button className="w-full flex items-center gap-3 px-5 py-4 text-left" onClick={() => setExpandedTask(expandedTask === idx ? null : idx)}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>{idx + 1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{st.nome}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{st.projeto} · {st.duracao_dias} dias</p>
                  </div>
                  <span className="text-xs font-medium mr-2" style={{ color: '#10b981' }}>{formatCurrency(st.insumos.reduce((s, i) => s + i.custo_estimado, 0))}</span>
                  {expandedTask === idx ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                </button>

                {expandedTask === idx && (
                  <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <p className="text-xs my-3" style={{ color: 'var(--text-secondary)' }}>{st.descricao}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Insumos necessários</p>
                    <div className="space-y-2">
                      {st.insumos.map((ins, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                          <div>
                            <p className="text-xs font-medium text-white">{ins.nome}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{ins.quantidade} {ins.unidade}</p>
                          </div>
                          <span className="text-xs font-semibold" style={{ color: '#a5b4fc' }}>{formatCurrency(ins.custo_estimado)}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setSavedTasks(p => p.includes(st.nome) ? p.filter(t => t !== st.nome) : [...p, st.nome])}
                      className="mt-3 w-full rounded-lg py-2.5 text-xs font-semibold transition-all"
                      style={{ background: savedTasks.includes(st.nome) ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)', border: `1px solid ${savedTasks.includes(st.nome) ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}`, color: savedTasks.includes(st.nome) ? '#34d399' : '#a5b4fc', cursor: 'pointer' }}
                    >
                      {savedTasks.includes(st.nome) ? '✓ Adicionada ao Kanban' : '+ Adicionar ao Kanban'}
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button className="btn-primary w-full justify-center py-3"><Plus size={16} />Salvar todo o plano na obra</button>
          </div>
        )}
      </div>
    </div>
  )
}
