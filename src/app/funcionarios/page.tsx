'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, Search, Check, X, Clock, Calendar, Filter, TrendingDown, ChevronRight, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function FuncionariosPage() {
  const [activeTab, setActiveTab] = useState('presenca') // 'presenca' ou 'stats'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0])
  const [presencas, setPresencas] = useState<Record<string, string>>({})
  const [estatisticas, setEstatisticas] = useState<any[]>([])
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    fetchData()
  }, [dataSelecionada, activeTab, filtroMes])

  async function fetchData() {
    setLoading(true)
    // 1. Buscar todos os funcionários ativos
    const { data: funcs } = await supabase.from('funcionarios').select('*').eq('ativo', true)
    setFuncionarios(funcs || [])

    if (activeTab === 'presenca') {
      // 2. Buscar presenças do dia selecionado
      const { data: pres } = await supabase
        .from('registros_presenca')
        .select('*')
        .eq('data', dataSelecionada)
      
      const presMap: Record<string, string> = {}
      pres?.forEach(p => { presMap[p.funcionario_id] = p.status })
      setPresencas(presMap)
    } else {
      // 3. Buscar estatísticas (contagem de faltas no mês)
      const startOfMonth = `2024-${filtroMes.toString().padStart(2, '0')}-01`
      const endOfMonth = `2024-${filtroMes.toString().padStart(2, '0')}-31`

      const { data: todasPresencas } = await supabase
        .from('registros_presenca')
        .select('*, funcionarios(nome, equipe)')
        .gte('data', startOfMonth)
        .lte('data', endOfMonth)
        .eq('status', 'falta')

      // Agrupar faltas por funcionário
      const statsMap: Record<string, any> = {}
      todasPresencas?.forEach(p => {
        if (!statsMap[p.funcionario_id]) {
          statsMap[p.funcionario_id] = { nome: p.funcionarios.nome, equipe: p.funcionarios.equipe, faltas: 0 }
        }
        statsMap[p.funcionario_id].faltas += 1
      })
      setEstatisticas(Object.values(statsMap).sort((a, b) => b.faltas - a.faltas))
    }
    setLoading(false)
  }

  async function handleTogglePresenca(id: string, status: string) {
    setPresencas({ ...presencas, [id]: status })
  }

  async function salvarPresencas() {
    setSaving(true)
    const upserts = Object.entries(presencas).map(([id, status]) => ({
      funcionario_id: id,
      data: dataSelecionada,
      status: status
    }))

    const { error } = await supabase
      .from('registros_presenca')
      .upsert(upserts, { onConflict: 'funcionario_id,data' })

    if (error) alert('Erro ao salvar: ' + error.message)
    else alert('Presenças salvas com sucesso!')
    setSaving(false)
    fetchData()
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white">Equipe e RH</h1>
          <p className="text-sm text-zinc-500 mt-1">Controle de efetivo, faltas e produtividade de campo.</p>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setActiveTab('presenca')}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", activeTab === 'presenca' ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white")}
          >
            Presença Diária
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", activeTab === 'stats' ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white")}
          >
            Relatório de Faltas
          </button>
        </div>
      </div>

      {activeTab === 'presenca' ? (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Data do Lançamento</label>
                <input 
                  type="date" 
                  className="input-dark text-sm" 
                  value={dataSelecionada} 
                  onChange={e => setDataSelecionada(e.target.value)}
                />
              </div>
              <div className="h-10 w-[1px] bg-zinc-800 hidden md:block mx-2" />
              <div className="hidden md:block">
                <p className="text-xl font-black text-white">{funcionarios.length}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Efetivo Total</p>
              </div>
            </div>

            <button 
              onClick={salvarPresencas}
              disabled={saving}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Salvar Chamada
            </button>
          </div>

          {/* Grid de Funcionários */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funcionarios.map(func => (
              <div key={func.id} className="p-4 rounded-2xl flex items-center justify-between transition-all hover:border-zinc-700" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                    {func.nome.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{func.nome}</h4>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{func.cargo} • {func.equipe}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button 
                    onClick={() => handleTogglePresenca(func.id, 'presente')}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      presencas[func.id] === 'presente' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-zinc-900 text-zinc-600 hover:bg-zinc-800"
                    )}
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => handleTogglePresenca(func.id, 'falta')}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      presencas[func.id] === 'falta' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-zinc-900 text-zinc-600 hover:bg-zinc-800"
                    )}
                  >
                    <X size={16} />
                  </button>
                  <button 
                    onClick={() => handleTogglePresenca(func.id, 'atestado')}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      presencas[func.id] === 'atestado' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-zinc-900 text-zinc-600 hover:bg-zinc-800"
                    )}
                  >
                    <Clock size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Aba de Estatísticas / Ranking de Faltas */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 w-fit">
            <Filter size={16} className="text-zinc-500" />
            <select 
              className="bg-transparent text-xs font-bold text-white outline-none"
              value={filtroMes}
              onChange={e => setFiltroMes(Number(e.target.value))}
            >
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabela de Ranking */}
            <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800">
                    <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Funcionário</th>
                    <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Equipe</th>
                    <th className="p-4 text-[10px] font-black uppercase text-zinc-500 text-center">Total de Faltas</th>
                    <th className="p-4 text-[10px] font-black uppercase text-zinc-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {estatisticas.map((stat, idx) => (
                    <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 text-sm font-bold text-white">{stat.nome}</td>
                      <td className="p-4 text-xs text-zinc-500 uppercase font-medium">{stat.equipe}</td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-black",
                          stat.faltas > 3 ? "bg-rose-500/10 text-rose-500" : "bg-zinc-800 text-zinc-400"
                        )}>
                          {stat.faltas}
                        </span>
                      </td>
                      <td className="p-4">
                        {stat.faltas > 3 ? (
                          <div className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase">
                            <TrendingDown size={12} /> Crítico
                          </div>
                        ) : (
                          <div className="text-[10px] font-black text-emerald-500 uppercase">Regular</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {estatisticas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">Nenhuma falta registrada neste mês</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Sidebar de Resumo */}
            <div className="space-y-6">
              <div className="rounded-3xl p-6 space-y-4 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Efetivo Acumulado</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">Total de Faltas</p>
                    <p className="text-2xl font-black text-rose-500">{estatisticas.reduce((acc, curr) => acc + curr.faltas, 0)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Equipe mais afetada</p>
                    <p className="text-sm font-bold text-white">Equipe Civil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
