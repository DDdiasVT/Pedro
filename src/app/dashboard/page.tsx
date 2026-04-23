'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  AlertCircle, 
  ChevronRight, 
  Building2,
  Calendar,
  Filter,
  X
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { mockHistorico } from '@/lib/mock-data'
import { formatCurrency, cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [obras, setObras] = useState<any[]>([])
  const [obraAtiva, setObraAtiva] = useState<any>(null)
  const [tarefas, setTarefas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAiModal, setShowAiModal] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: listObras } = await supabase.from('obras').select('*')
      if (listObras && listObras.length > 0) {
        setObras(listObras)
        setObraAtiva(listObras[0])
        
        const { data: listTarefas } = await supabase
          .from('tarefas')
          .select('*')
          .eq('obra_id', listObras[0].id)
        
        setTarefas(listTarefas || [])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading || !obraAtiva) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Carregando Banco de Dados...</p>
        </div>
      </div>
    )
  }

  const kpis = [
    { label: 'IDC (Custo)', value: '1.02', trend: '+0.02', status: 'bom', icon: DollarSign, desc: 'Eficiência de custos' },
    { label: 'IDP (Prazo)', value: '0.92', trend: '-0.05', status: 'alerta', icon: Clock, desc: 'Desempenho de cronograma' },
    { label: 'Progresso', value: `${obraAtiva.progresso_total}%`, trend: '+5%', status: 'bom', icon: TrendingUp, desc: 'Conclusão física' },
    { label: 'Custo Real', value: formatCurrency(obraAtiva.custo_real), trend: 'Estável', status: 'bom', icon: DollarSign, desc: 'Gasto acumulado' },
  ]

  const ocorrenciasCriticas = [
    { id: 1, tarefa: 'Impermeabilização Fundação', msg: 'Atraso na entrega da manta asfáltica', nivel: 'alta' },
    { id: 2, tarefa: 'Alvenaria 3º Andar', msg: 'Falta de 3 serventes na equipe Civil', nivel: 'media' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header com Seletor de Obra */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Painel de Controle</h1>
          <p className="text-sm text-zinc-500 mt-1">Visão holística do desempenho das suas construções.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <Building2 size={16} className="text-indigo-400" />
            <select 
              className="bg-transparent text-sm font-bold text-white outline-none pr-4 cursor-pointer"
              value={obraAtiva.id}
              onChange={(e) => setObraAtiva(obras.find(o => o.id === e.target.value) || obras[0])}
            >
              {obras.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
          </div>
          <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                kpi.status === 'bom' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                <kpi.icon size={24} />
              </div>
              <span className={cn(
                "text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest",
                kpi.trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-white mb-1">{kpi.value}</h3>
            <p className="text-[10px] text-zinc-600 font-medium">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts & Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden" 
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle at top right, rgba(99,102,241,0.05), transparent)', pointerEvents: 'none' }} />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white">Curva S - Previsto vs. Real</h3>
                <p className="text-xs text-zinc-500">Acompanhamento financeiro acumulado</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Previsto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Real</span>
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockHistorico}>
                  <defs>
                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="mes" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#52525b', fontSize: 10, fontWeight: 'bold' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#52525b', fontSize: 10 }}
                    tickFormatter={(val) => `R$${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="custo_previsto" 
                    stroke="#6366f1" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPrev)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="custo_real" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorReal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ocorrencias Recentes */}
            <div className="rounded-3xl p-6 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Ocorrências Críticas</h3>
                <Link href="/tarefas" className="text-[10px] font-bold text-indigo-400 hover:underline">Ver todas</Link>
              </div>
              <div className="space-y-3">
                {ocorrenciasCriticas.map(oc => (
                  <div key={oc.id} className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <AlertCircle size={16} className={oc.nivel === 'alta' ? 'text-rose-500' : 'text-amber-500'} />
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">{oc.tarefa}</p>
                      <p className="text-xs text-white font-medium mt-0.5">{oc.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Efetivo Resumo */}
            <div className="rounded-3xl p-6 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Efetivo de Campo</h3>
                <Link href="/funcionarios" className="text-[10px] font-bold text-indigo-400 hover:underline">Detalhes</Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-white">24</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Funcionários Presentes</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Users size={28} />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-zinc-500">Próprio</span>
                  <span className="text-white">18</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-zinc-500">Terceirizado</span>
                  <span className="text-white">6</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Obras Ativas & Progress */}
        <div className="space-y-8">
          <div className="rounded-3xl p-6 space-y-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Calendar size={16} className="text-indigo-400" /> Próximas Entregas
            </h3>
            <div className="space-y-6">
              {tarefas.filter(t => t.status === 'em_andamento' || t.status === 'pendente').slice(0, 4).map(t => (
                <div key={t.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate max-w-[150px]">{t.nome}</p>
                    <span className="text-[10px] font-black text-zinc-500">{t.percentual_conclusao}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${t.percentual_conclusao}%`, 
                        background: t.status === 'atrasado' ? '#ef4444' : 'var(--accent)' 
                      }} 
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase">Previsto: {t.data_fim_previsto}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              Ver Cronograma Completo <ChevronRight size={14} />
            </button>
          </div>

          <div className="rounded-3xl p-6 space-y-4" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-3 rounded-2xl bg-white/10 w-fit">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-black text-white leading-tight">Insight da IA BuildMind</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Baseado no IDP de 0.92, a concretagem da laje do 4º pavimento pode sofrer um atraso de 3 dias se o efetivo da Equipe Civil não for reforçado até sexta-feira.
            </p>
            <button 
              onClick={() => setShowAiModal(true)}
              className="w-full py-2 rounded-xl bg-white text-indigo-600 text-[10px] font-black uppercase shadow-lg transition-all active:scale-95"
            >
              Ver Análise Completa
            </button>
          </div>
        </div>

      </div>

      {/* AI Detailed Analysis Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl rounded-[32px] p-8 space-y-6 shadow-2xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Análise Preditiva Completa</h2>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Diagnóstico da IA</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Identificamos uma queda de 8% na produtividade da Equipe Civil nos últimos 5 dias, coincidindo com 4 faltas registradas. No ritmo atual, a tarefa <strong>"Laje do 4º Pavimento"</strong> não será iniciada na data prevista.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Impacto Financeiro</p>
                  <p className="text-lg font-bold text-white">R$ 4.200,00</p>
                  <p className="text-[10px] text-zinc-500">Estimativa de custos extras</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Ações Sugeridas</p>
                  <p className="text-sm font-bold text-emerald-400">+2 Pedreiros</p>
                  <p className="text-[10px] text-zinc-500">Reforço técnico</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Plano de Mitigação:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Remanejar pessoal da Equipe de Fundações.</li>
                  <li className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Autorizar horas extras estratégicas esta semana.</li>
                  <li className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Antecipar entrega de insumos críticos em 24h.</li>
                </ul>
              </div>
            </div>

            <button 
              onClick={() => setShowAiModal(false)}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg"
            >
              Entendido, vou aplicar na obra
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
