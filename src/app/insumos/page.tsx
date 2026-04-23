'use client'

import { useState } from 'react'
import { mockInsumos } from '@/lib/mock-data'
import type { Insumo } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, Trash2, Edit2, Package, X } from 'lucide-react'

const CATEGORIAS = ['Todos', 'Concreto', 'Aço', 'Madeira', 'Alvenaria', 'Argamassa', 'Elétrico', 'Impermeabilização']

function AddInsumoModal({ onClose, onAdd }: { onClose: () => void; onAdd: (i: Insumo) => void }) {
  const [form, setForm] = useState({ nome: '', unidade: 'm³', quantidade_prevista: '', custo_unitario: '', fornecedor: '', categoria: 'Concreto' })

  const handle = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const submit = () => {
    if (!form.nome || !form.quantidade_prevista || !form.custo_unitario) return
    onAdd({
      id: `i${Date.now()}`,
      obra_id: '1',
      nome: form.nome,
      unidade: form.unidade,
      quantidade_prevista: Number(form.quantidade_prevista),
      quantidade_real: 0,
      custo_unitario: Number(form.custo_unitario),
      fornecedor: form.fornecedor,
      categoria: form.categoria,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Novo Insumo</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Nome do Material', key: 'nome', placeholder: 'Ex: Concreto usinado fck 25' },
            { label: 'Fornecedor', key: 'fornecedor', placeholder: 'Ex: Concrelev' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
              <input className="input-dark w-full text-sm" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => handle(f.key, e.target.value)} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Unidade</label>
              <select className="input-dark w-full text-sm" value={form.unidade} onChange={e => handle('unidade', e.target.value)}>
                {['m³', 'kg', 'm²', 'm', 'un', 'saco', 'L', 'kit'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Categoria</label>
              <select className="input-dark w-full text-sm" value={form.categoria} onChange={e => handle('categoria', e.target.value)}>
                {CATEGORIAS.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Qtd. Prevista</label>
              <input type="number" className="input-dark w-full text-sm" placeholder="0" value={form.quantidade_prevista} onChange={e => handle('quantidade_prevista', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Custo Unit. (R$)</label>
              <input type="number" className="input-dark w-full text-sm" placeholder="0,00" value={form.custo_unitario} onChange={e => handle('custo_unitario', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Cancelar</button>
          <button onClick={submit} className="btn-primary flex-1 justify-center py-2.5">Adicionar</button>
        </div>
      </div>
    </div>
  )
}

export default function InsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>(mockInsumos)
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [showModal, setShowModal] = useState(false)

  const filtrados = insumos.filter(i => {
    const matchSearch = i.nome.toLowerCase().includes(search.toLowerCase()) || i.fornecedor.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoria === 'Todos' || i.categoria === categoria
    return matchSearch && matchCat
  })

  const totalPrevisto = filtrados.reduce((s, i) => s + i.quantidade_prevista * i.custo_unitario, 0)
  const totalReal = filtrados.reduce((s, i) => s + i.quantidade_real * i.custo_unitario, 0)

  const handleDelete = (id: string) => setInsumos(p => p.filter(i => i.id !== id))
  const handleAdd = (i: Insumo) => setInsumos(p => [...p, i])

  return (
    <div className="p-6 lg:p-8">
      {showModal && <AddInsumoModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Insumos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {insumos.length} materiais cadastrados · Obra: Residencial Vila Nova – Bloco A
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} />Novo Insumo</button>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Previsto', value: formatCurrency(insumos.reduce((s, i) => s + i.quantidade_prevista * i.custo_unitario, 0)), color: '#6366f1' },
          { label: 'Total Realizado', value: formatCurrency(insumos.reduce((s, i) => s + i.quantidade_real * i.custo_unitario, 0)), color: '#10b981' },
          { label: 'Itens Cadastrados', value: insumos.length, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input-dark w-full pl-9 text-sm" placeholder="Buscar insumo ou fornecedor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                background: categoria === cat ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)',
                border: `1px solid ${categoria === cat ? 'rgba(99,102,241,0.4)' : 'var(--border-light)'}`,
                color: categoria === cat ? '#a5b4fc' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                {['Material', 'Categoria', 'Unid.', 'Qtd. Prev.', 'Qtd. Real', 'Custo Unit.', 'Total Prev.', 'Fornecedor', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
              {filtrados.map(ins => {
                const pctRealizado = ins.quantidade_prevista > 0 ? (ins.quantidade_real / ins.quantidade_prevista) * 100 : 0
                return (
                  <tr key={ins.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border-light)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span className="text-sm text-white font-medium">{ins.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc' }}>{ins.categoria}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{ins.unidade}</td>
                    <td className="px-4 py-3 text-sm text-white">{ins.quantidade_prevista.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">{ins.quantidade_real.toLocaleString('pt-BR')}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: pctRealizado > 100 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: pctRealizado > 100 ? '#f87171' : '#34d399' }}>
                          {pctRealizado.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(ins.custo_unitario)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">{formatCurrency(ins.quantidade_prevista * ins.custo_unitario)}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{ins.fornecedor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded transition-colors" style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(ins.id)} className="p-1.5 rounded transition-colors" style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td colSpan={6} className="px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Total Filtrado</td>
                <td className="px-4 py-3 text-sm font-bold text-white">{formatCurrency(totalPrevisto)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
