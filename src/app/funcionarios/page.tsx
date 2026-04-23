'use client'

import { useState } from 'react'
import { Users, UserPlus, Search, Check, X, Clock, Calendar, MoreHorizontal, User } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Funcionario, RegistroPresenca } from '@/types'

const MOCK_FUNCIONARIOS: Funcionario[] = [
  { id: 'f1', nome: 'Ricardo Souza', cargo: 'Mestre de Obras', equipe: 'Geral', tipo: 'proprio', ativo: true },
  { id: 'f2', nome: 'João Pedro', cargo: 'Pedreiro', equipe: 'Equipe Civil', tipo: 'proprio', ativo: true },
  { id: 'f3', nome: 'Mateus Lima', cargo: 'Servente', equipe: 'Equipe Civil', tipo: 'proprio', ativo: true },
  { id: 'f4', nome: 'Carlos Oliveira', cargo: 'Eletricista', equipe: 'Equipe Elétrica', tipo: 'terceirizado', ativo: true },
  { id: 'f5', nome: 'Ana Paula', cargo: 'Engenheira Residente', equipe: 'Gestão', tipo: 'proprio', ativo: true },
]

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(MOCK_FUNCIONARIOS)
  const [presencas, setPresencas] = useState<Record<string, string>>({}) // { "f1-2024-04-23": "presente" }
  const [search, setSearch] = useState('')
  const [dataAtual, setDataAtual] = useState(new Date().toISOString().split('T')[0])

  const togglePresenca = (fId: string) => {
    const key = `${fId}-${dataAtual}`
    const current = presencas[key] || 'pendente'
    const next: Record<string, string> = {
      pendente: 'presente',
      presente: 'falta',
      falta: 'atestado',
      atestado: 'pendente'
    }
    setPresencas(prev => ({ ...prev, [key]: next[current] }))
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'presente': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'falta': return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      case 'atestado': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default: return 'bg-zinc-800 text-zinc-500 border-zinc-700'
    }
  }

  const filtrados = funcionarios.filter(f => f.nome.toLowerCase().includes(search.toLowerCase()) || f.cargo.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Equipe</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Controle de efetivo, cargos e presença diária no canteiro.
          </p>
        </div>
        <button className="btn-primary">
          <UserPlus size={16} /> Novo Funcionário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Efetivo Total', value: funcionarios.length, icon: Users, color: 'indigo' },
          { label: 'Presentes Hoje', value: Object.values(presencas).filter(v => v === 'presente').length, icon: Check, color: 'emerald' },
          { label: 'Faltas / Atestados', value: Object.values(presencas).filter(v => v === 'falta' || v === 'atestado').length, icon: X, color: 'rose' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-5 flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              className="input-dark w-full pl-9 text-sm" 
              placeholder="Buscar por nome ou cargo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-zinc-500 uppercase">Data do Controle:</label>
            <input 
              type="date" 
              value={dataAtual} 
              onChange={e => setDataAtual(e.target.value)}
              className="input-dark text-xs py-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Funcionário</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Cargo / Equipe</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-center">Presença ({dataAtual.split('-')[2]})</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtrados.map(f => {
                const status = presencas[`${f.id}-${dataAtual}`] || 'pendente'
                return (
                  <tr key={f.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs border border-zinc-700">
                          {f.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{f.nome}</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">{f.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-300">{f.cargo}</p>
                      <p className="text-[10px] text-zinc-500">{f.equipe}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded border",
                        f.tipo === 'proprio' ? "border-indigo-500/20 text-indigo-400 bg-indigo-500/5" : "border-amber-500/20 text-amber-400 bg-amber-500/5"
                      )}>
                        {f.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => togglePresenca(f.id)}
                          className={cn(
                            "min-w-[100px] py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2",
                            getStatusStyle(status)
                          )}
                        >
                          {status === 'presente' && <Check size={12} />}
                          {status === 'falta' && <X size={12} />}
                          {status === 'atestado' && <Clock size={12} />}
                          {status === 'pendente' ? 'Marcar' : status}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-800 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl p-5 border border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
        <AlertCircle size={20} className="text-amber-500 mt-1 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-400">Dica de Gestão</p>
          <p className="text-xs text-amber-500/80 leading-relaxed">
            O controle de faltas afeta diretamente o IDP (Índice de Prazo). Se a Equipe Civil tiver mais de 20% de faltas na semana, o BuildMind notificará automaticamente um possível atraso na concretagem.
          </p>
        </div>
      </div>
    </div>
  )
}

import { AlertCircle } from 'lucide-react'
