'use client'

import { useState, useMemo } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Filter, Edit3, Save, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { mockKPIs } from '@/lib/mock-data'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MOCK_HISTORICO = [
  { mes: 'Out', previsto: 150000, real: 145000 },
  { mes: 'Nov', previsto: 220000, real: 235000 },
  { mes: 'Dez', previsto: 180000, real: 178000 },
  { mes: 'Jan', previsto: 300000, real: 310000 },
  { mes: 'Fev', previsto: 250000, real: 240000 },
  { mes: 'Mar', previsto: 400000, real: 415000 },
  { mes: 'Abr', previsto: 350000, real: 342000 },
]

const MOCK_TRANSACOES = [
  { id: 'tx1', descricao: 'Compra de Cimento (500 sacos)', categoria: 'Materiais', valor: 15500, data: '2024-04-10', status: 'pago' },
  { id: 'tx2', descricao: 'Aluguel de Escavadeira', categoria: 'Equipamentos', valor: 4200, data: '2024-04-12', status: 'pago' },
  { id: 'tx3', descricao: 'Folha de Pagamento - Equipe Civil', categoria: 'Mão de Obra', valor: 32000, data: '2024-04-15', status: 'pago' },
  { id: 'tx4', descricao: 'Adiantamento Subempreiteiro Pintura', categoria: 'Mão de Obra', valor: 8000, data: '2024-04-18', status: 'pendente' },
  { id: 'tx5', descricao: 'Aço CA-50 10mm (2 toneladas)', categoria: 'Materiais', valor: 12400, data: '2024-04-20', status: 'pago' },
]

export default function FinanceiroPage() {
  const [mesFiltro, setMesFiltro] = useState('Abr')
  const [custoRealManual, setCustoRealManual] = useState(mockKPIs.custo_real)
  const [editingCusto, setEditingCusto] = useState(false)
  const [transacoes, setTransacoes] = useState(MOCK_TRANSACOES)

  const stats = useMemo(() => {
    const totalGasto = transacoes.filter(t => t.status === 'pago').reduce((acc, t) => acc + t.valor, 0)
    const totalPendente = transacoes.filter(t => t.status === 'pendente').reduce((acc, t) => acc + t.valor, 0)
    return { totalGasto, totalPendente }
  }, [transacoes])

  const handleUpdateValor = (id: string, novoValor: number) => {
    setTransacoes(prev => prev.map(t => t.id === id ? { ...t, valor: novoValor } : t))
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Controle Financeiro</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Monitore o fluxo de caixa, custos reais e comparativo com orçamento.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select 
              className="input-dark pl-9 py-2 text-xs font-bold outline-none pr-8"
              value={mesFiltro}
              onChange={e => setMesFiltro(e.target.value)}
            >
              {MOCK_HISTORICO.map(h => <option key={h.mes} value={h.mes}>{h.mes} / 2024</option>)}
            </select>
          </div>
          <button className="btn-primary py-2 text-xs"><Plus size={14} /> Lançar Despesa</button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Orçamento Total', value: mockKPIs.orcamento_total, icon: DollarSign, color: 'zinc' },
          { label: 'Custo Real Acumulado', value: custoRealManual, icon: TrendingDown, color: 'rose', editable: true },
          { label: 'Gasto no Mês', value: stats.totalGasto, icon: ArrowDownRight, color: 'amber' },
          { label: 'Saldo Restante', value: mockKPIs.orcamento_total - custoRealManual, icon: TrendingUp, color: 'emerald' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-5 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</span>
              <stat.icon size={16} className={`text-${stat.color}-400`} />
            </div>
            <div className="flex items-center justify-between">
              {stat.editable && editingCusto ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={custoRealManual}
                    onChange={e => setCustoRealManual(Number(e.target.value))}
                    className="bg-zinc-900 border border-indigo-500 rounded px-2 py-1 text-sm text-white w-32 outline-none"
                  />
                  <button onClick={() => setEditingCusto(false)} className="text-emerald-400 p-1"><Save size={16}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xl font-black text-white">{formatCurrency(stat.value)}</p>
                  {stat.editable && <button onClick={() => setEditingCusto(true)} className="text-zinc-600 hover:text-white transition-colors"><Edit3 size={14}/></button>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${stat.color}-500/50`} 
                  style={{ width: stat.label === 'Saldo Restante' ? '100%' : `${(stat.value / mockKPIs.orcamento_total) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-2 rounded-2xl p-6 space-y-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-400" /> Fluxo de Custos (Previsto vs Real)
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500/20 border border-indigo-500" /> Previsto</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500/20 border border-rose-500" /> Real</div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORICO}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="mes" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  tickFormatter={(val) => `R$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="previsto" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPrev)" />
                <Area type="monotone" dataKey="real" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Sidebar */}
        <div className="rounded-2xl p-6 flex flex-col space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            Últimos Lançamentos
            <Filter size={14} className="text-zinc-600 cursor-pointer" />
          </h3>
          
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {transacoes.map(tx => (
              <div key={tx.id} className="group p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/30 transition-all">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{tx.descricao}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">{tx.categoria} • {tx.data}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase px-1.5 py-0.5 rounded",
                    tx.status === 'pago' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {tx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-black text-white">{formatCurrency(tx.valor)}</p>
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-indigo-400 transition-all">
                    <Edit3 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500">
              <span>Total no Mês</span>
              <span className="text-white">{formatCurrency(stats.totalGasto + stats.totalPendente)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase text-rose-400">
              <span>Pago</span>
              <span>{formatCurrency(stats.totalGasto)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
