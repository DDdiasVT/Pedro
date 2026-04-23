'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Filter, Plus, Save, Loader2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [obras, setObras] = useState<any[]>([])
  const [obraAtiva, setObraAtiva] = useState<any>(null)
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    descricao: '',
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    categoria: 'material',
    tipo: 'despesa',
    status: 'pago'
  })

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (obraAtiva) fetchLancamentos()
  }, [obraAtiva])

  async function fetchObras() {
    const { data } = await supabase.from('obras').select('*')
    if (data && data.length > 0) {
      setObras(data)
      setObraAtiva(data[0])
    }
  }

  async function fetchLancamentos() {
    setLoading(true)
    const { data } = await supabase
      .from('financeiro_lancamentos')
      .select('*')
      .eq('obra_id', obraAtiva.id)
      .order('data', { ascending: false })
    setLancamentos(data || [])
    setLoading(false)
  }

  async function handleSalvar() {
    setSaving(true)
    const { error } = await supabase
      .from('financeiro_lancamentos')
      .insert([{ ...formData, obra_id: obraAtiva.id }])
    
    if (error) alert(error.message)
    else {
      setShowModal(false)
      fetchLancamentos()
      // Atualizar o custo real da obra também
      await supabase.rpc('atualizar_custo_obra', { target_obra_id: obraAtiva.id })
    }
    setSaving(false)
  }

  const totalDespesas = lancamentos.filter(l => l.tipo === 'despesa').reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalReceitas = lancamentos.filter(l => l.tipo === 'receita').reduce((acc, curr) => acc + Number(curr.valor), 0)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white">Gestão Financeira</h1>
          <p className="text-sm text-zinc-500 mt-1">Fluxo de caixa, notas fiscais e controle de custos da obra.</p>
        </div>

        <div className="flex items-center gap-4">
          <select 
            className="bg-zinc-900 text-sm font-bold text-white px-4 py-2 rounded-xl border border-zinc-800 outline-none"
            value={obraAtiva?.id}
            onChange={(e) => setObraAtiva(obras.find(o => o.id === e.target.value))}
          >
            {obras.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </select>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl p-6 space-y-2 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Saldo Atual da Obra</p>
          <h3 className="text-3xl font-black text-white">{formatCurrency(totalReceitas - totalDespesas)}</h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
            <TrendingUp size={14} /> Fluxo Saudável
          </div>
        </div>
        <div className="rounded-3xl p-6 space-y-2 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Despendido (Real)</p>
          <h3 className="text-3xl font-black text-rose-500">{formatCurrency(totalDespesas)}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Previsto: {formatCurrency(obraAtiva?.orcamento_total || 0)}</p>
        </div>
        <div className="rounded-3xl p-6 space-y-2 shadow-xl border border-indigo-500/20 bg-indigo-500/5">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Aproveitamento do Orçamento</p>
          <h3 className="text-3xl font-black text-white">{obraAtiva ? Math.round((totalDespesas / obraAtiva.orcamento_total) * 100) : 0}%</h3>
          <div className="progress-bar mt-4">
            <div className="progress-bar-fill" style={{ width: `${obraAtiva ? (totalDespesas / obraAtiva.orcamento_total) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Lista de Lançamentos */}
      <div className="rounded-3xl overflow-hidden border border-zinc-800" style={{ background: 'var(--bg-card)' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800">
              <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Data</th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Descrição</th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Categoria</th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Status</th>
              <th className="p-4 text-[10px] font-black uppercase text-zinc-500 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {lancamentos.map((l) => (
              <tr key={l.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-4 text-xs text-zinc-400">{new Date(l.data).toLocaleDateString()}</td>
                <td className="p-4">
                  <p className="text-sm font-bold text-white">{l.descricao}</p>
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 py-1 bg-zinc-800 rounded-lg">{l.categoria}</span>
                </td>
                <td className="p-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-lg uppercase",
                    l.status === 'pago' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  )}>{l.status}</span>
                </td>
                <td className={cn(
                  "p-4 text-right font-black text-sm",
                  l.tipo === 'despesa' ? "text-rose-500" : "text-emerald-500"
                )}>
                  {l.tipo === 'despesa' ? '-' : '+'} {formatCurrency(l.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lancamentos.length === 0 && (
          <div className="py-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">Nenhum lançamento financeiro para esta obra</div>
        )}
      </div>

      {/* Modal Novo Lançamento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-xl font-bold text-white">Novo Lançamento</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase">Descrição</label>
                <input className="input-dark w-full" placeholder="Ex: Nota Fiscal 123 - Cimento" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase">Valor</label>
                  <input type="number" className="input-dark w-full" placeholder="0.00" value={formData.valor} onChange={e => setFormData({...formData, valor: Number(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase">Data</label>
                  <input type="date" className="input-dark w-full" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase">Tipo</label>
                  <select className="input-dark w-full" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option value="despesa">Despesa (Saída)</option>
                    <option value="receita">Receita (Entrada)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase">Categoria</label>
                  <select className="input-dark w-full" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                    <option value="material">Material</option>
                    <option value="mao_de_obra">Mão de Obra</option>
                    <option value="equipamento">Equipamento</option>
                    <option value="imposto">Impostos/Taxas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-zinc-900 text-zinc-400 font-bold">Cancelar</button>
              <button onClick={handleSalvar} disabled={saving} className="flex-1 btn-primary py-3">
                {saving ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Confirmar Lançamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
