'use client'

import { useState, useEffect } from 'react'
import { Building2, Plus, Calendar, DollarSign, MapPin, User, Search, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, cn } from '@/lib/utils'

export default function ObrasPage() {
  const [obras, setObras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim_previsto: '',
    orcamento_total: 0,
    responsavel: '',
    localizacao: '',
    status: 'planejamento'
  })

  useEffect(() => {
    fetchObras()
  }, [])

  async function fetchObras() {
    setLoading(true)
    const { data } = await supabase.from('obras').select('*').order('created_at', { ascending: false })
    setObras(data || [])
    setLoading(false)
  }

  async function handleSave() {
    setLoading(true)
    if (isEditing) {
      const { error } = await supabase
        .from('obras')
        .update(formData)
        .eq('id', isEditing)
      if (error) alert(error.message)
    } else {
      const { error } = await supabase
        .from('obras')
        .insert([formData])
      if (error) alert(error.message)
    }
    
    setShowModal(false)
    setIsEditing(null)
    setFormData({
      nome: '', descricao: '', data_inicio: '', data_fim_previsto: '', 
      orcamento_total: 0, responsavel: '', localizacao: '', status: 'planejamento'
    })
    fetchObras()
  }

  const handleEdit = (obra: any) => {
    setFormData({
      nome: obra.nome,
      descricao: obra.descricao,
      data_inicio: obra.data_inicio,
      data_fim_previsto: obra.data_fim_previsto,
      orcamento_total: obra.orcamento_total,
      responsavel: obra.responsavel,
      localizacao: obra.localizacao,
      status: obra.status
    })
    setIsEditing(obra.id)
    setShowModal(true)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Minhas Obras</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie seu portfólio de construções e orçamentos.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(null); setShowModal(true) }}
          className="btn-primary"
        >
          <Plus size={18} /> Nova Obra
        </button>
      </div>

      {loading && obras.length === 0 ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obras.map(obra => (
            <div key={obra.id} className="rounded-2xl p-6 space-y-5 group transition-all hover:border-indigo-500/50" 
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
              
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Building2 size={24} />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(obra)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"><Edit2 size={14}/></button>
                  <button className="p-2 rounded-lg bg-zinc-800 text-rose-400 hover:bg-rose-500/10"><Trash2 size={14}/></button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{obra.nome}</h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{obra.localizacao}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Calendar size={12}/> Início</span>
                  <span className="text-white font-medium">{new Date(obra.data_inicio).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5"><DollarSign size={12}/> Orçamento</span>
                  <span className="text-white font-bold">{formatCurrency(obra.orcamento_total)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5"><User size={12}/> Responsável</span>
                  <span className="text-white font-medium">{obra.responsavel}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Progresso</span>
                  <span className="text-xs font-bold text-indigo-400">{obra.progresso_total}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${obra.progresso_total}%` }} />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[9px] font-black uppercase px-2 py-0.5 rounded border",
                  obra.status === 'em_andamento' ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" : "border-zinc-500/20 text-zinc-500"
                )}>
                  {obra.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nova/Editar Obra */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl p-8 space-y-6 shadow-2xl relative" 
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{isEditing ? 'Editar Obra' : 'Nova Obra'}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white"><X size={24}/></button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nome da Obra</label>
                <input 
                  className="input-dark w-full" 
                  placeholder="Ex: Edifício Horizonte"
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Localização</label>
                <input 
                  className="input-dark w-full" 
                  placeholder="Rua, Número, Cidade"
                  value={formData.localizacao}
                  onChange={e => setFormData({...formData, localizacao: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Data Início</label>
                  <input 
                    type="date" 
                    className="input-dark w-full"
                    value={formData.data_inicio}
                    onChange={e => setFormData({...formData, data_inicio: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Previsão Fim</label>
                  <input 
                    type="date" 
                    className="input-dark w-full"
                    value={formData.data_fim_previsto}
                    onChange={e => setFormData({...formData, data_fim_previsto: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Orçamento Total</label>
                  <input 
                    type="number" 
                    className="input-dark w-full"
                    value={formData.orcamento_total}
                    onChange={e => setFormData({...formData, orcamento_total: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Responsável</label>
                  <input 
                    className="input-dark w-full"
                    placeholder="Eng. Responsável"
                    value={formData.responsavel}
                    onChange={e => setFormData({...formData, responsavel: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
                <select 
                  className="input-dark w-full"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="planejamento">Planejamento</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="pausada">Pausada</option>
                  <option value="concluida">Concluída</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-zinc-900 text-zinc-400 font-bold hover:bg-zinc-800 transition-all">Cancelar</button>
              <button onClick={handleSave} className="flex-1 btn-primary py-3">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? 'Salvar Alterações' : 'Criar Obra')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
