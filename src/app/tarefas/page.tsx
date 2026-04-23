'use client'

import { useState, useMemo } from 'react'
import { mockTarefas } from '@/lib/mock-data'
import { getStatusColor, getStatusLabel, formatDate, cn } from '@/lib/utils'
import type { Tarefa, StatusTarefa } from '@/types'
import { User, Calendar, AlertTriangle, ChevronDown, ChevronUp, GripVertical, Layers, Filter, MessageSquare } from 'lucide-react'

const COLUNAS: { id: StatusTarefa; label: string; color: string }[] = [
  { id: 'pendente', label: 'Pendente', color: '#6b7280' },
  { id: 'em_andamento', label: 'Em Andamento', color: '#6366f1' },
  { id: 'concluido', label: 'Concluído', color: '#10b981' },
  { id: 'atrasado', label: 'Atrasado', color: '#ef4444' },
]

function TarefaCard({ tarefa, onUpdate }: { tarefa: Tarefa; onUpdate: (id: string, pct: number, status: StatusTarefa, ocorrencias?: any[]) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [pct, setPct] = useState(tarefa.percentual_conclusao)
  const [logs, setLogs] = useState(tarefa.ocorrencias || [])
  const [newLog, setNewLog] = useState('')
  const [importancia, setImportancia] = useState<'baixa' | 'media' | 'alta' | 'critica'>('media')

  const handleSlider = (val: number) => {
    setPct(val)
    const newStatus: StatusTarefa = val === 100 ? 'concluido' : val > 0 ? 'em_andamento' : 'pendente'
    onUpdate(tarefa.id, val, newStatus, logs)
  }

  const addLog = () => {
    if (!newLog.trim()) return
    const log = {
      id: Math.random().toString(),
      tarefa_id: tarefa.id,
      data_hora: new Date().toISOString(),
      descricao: newLog,
      importancia,
      usuario: 'Eng. Pedro',
      incluir_no_relatorio: true
    }
    const updated = [...logs, log]
    setLogs(updated)
    setNewLog('')
    onUpdate(tarefa.id, pct, tarefa.status, updated)
  }

  const isAtrasado = tarefa.status === 'atrasado'

  return (
    <div className="kanban-card group" style={{ borderColor: isAtrasado ? 'rgba(239,68,68,0.3)' : undefined }}>
      <div className="flex items-start gap-2 mb-3">
        <GripVertical size={14} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white leading-snug truncate" title={tarefa.nome}>{tarefa.nome}</p>
          <div className="flex items-center gap-2 mt-1">
            {isAtrasado && (
              <div className="flex items-center gap-1">
                <AlertTriangle size={10} style={{ color: '#f87171' }} />
                <span className="text-[10px] font-bold uppercase" style={{ color: '#f87171' }}>Atrasado</span>
              </div>
            )}
            {logs.length > 0 && (
              <div className="flex items-center gap-1 text-indigo-400">
                <MessageSquare size={10} />
                <span className="text-[10px] font-bold">{logs.length}</span>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => setShowLogs(!showLogs)}
          className={cn("p-1 rounded hover:bg-white/10 transition-colors", showLogs ? "text-indigo-400" : "text-zinc-500")}
        >
          <MessageSquare size={14} />
        </button>
      </div>

      {!showLogs ? (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Progresso</span>
              <span className="text-xs font-bold" style={{ color: pct === 100 ? '#10b981' : '#a5b4fc' }}>{pct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={pct}
              onChange={(e) => handleSlider(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer bg-zinc-800"
              style={{ accentColor: pct === 100 ? '#10b981' : '#6366f1' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1">
              <User size={10} />
              <span className="truncate max-w-[80px]">{tarefa.responsavel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              <span>{formatDate(tarefa.data_fim_previsto)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3 pt-2 border-t border-zinc-800">
          <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {logs.map((log: any) => (
              <div key={log.id} className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[10px]">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "font-black uppercase px-1 rounded-sm",
                    log.importancia === 'critica' ? "bg-rose-500 text-white" : 
                    log.importancia === 'alta' ? "text-rose-400" : "text-zinc-500"
                  )}>{log.importancia}</span>
                  <span className="text-zinc-600">{new Date(log.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">{log.descricao}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <textarea 
              value={newLog}
              onChange={e => setNewLog(e.target.value)}
              placeholder="Descrever ocorrência..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-[10px] text-white outline-none focus:border-indigo-500 resize-none"
              rows={2}
            />
            <div className="flex items-center justify-between gap-2">
              <select 
                value={importancia} 
                onChange={e => setImportancia(e.target.value as any)}
                className="bg-zinc-900 text-[9px] uppercase font-bold text-zinc-500 outline-none p-1 rounded"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
              <button 
                onClick={addLog}
                className="p-1 px-2 rounded bg-indigo-600 text-white text-[9px] font-bold hover:bg-indigo-700 transition-all"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(mockTarefas)
  const [filterProject, setFilterProject] = useState<string>('Todos')

  const projetos = useMemo(() => {
    const p = Array.from(new Set(tarefas.map(t => t.projeto || 'Sem Projeto')))
    return ['Todos', ...p.sort()]
  }, [tarefas])

  const handleUpdate = (id: string, pct: number, status: StatusTarefa, ocorrencias?: any[]) => {
    setTarefas(prev => prev.map(t => t.id === id ? { 
      ...t, 
      percentual_conclusao: pct, 
      status,
      ocorrencias: ocorrencias || t.ocorrencias 
    } : t))
  }

  const tarefasFiltradas = useMemo(() => {
    if (filterProject === 'Todos') return tarefas
    return tarefas.filter(t => (t.projeto || 'Sem Projeto') === filterProject)
  }, [tarefas, filterProject])

  const groupedByProject = useMemo(() => {
    const groups: Record<string, Tarefa[]> = {}
    tarefasFiltradas.forEach(t => {
      const p = t.projeto || 'Sem Projeto'
      if (!groups[p]) groups[p] = []
      groups[p].push(t)
    })
    return groups
  }, [tarefasFiltradas])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cronograma & Kanban</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Organize suas tarefas por projetos e acompanhe o status real.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select 
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="input-dark pl-9 text-xs font-semibold py-2 outline-none appearance-none pr-8"
              style={{ background: 'var(--bg-card)' }}
            >
              {projetos.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button className="btn-primary text-xs py-2">+ Nova Tarefa</button>
        </div>
      </div>

      {/* Swimlane Layout */}
      <div className="space-y-8">
        {Object.entries(groupedByProject).map(([projectName, projectTasks]) => (
          <div key={projectName} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400">
                <Layers size={14} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">{projectName}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent ml-2" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase">{projectTasks.length} tarefas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {COLUNAS.map((col) => {
                const colTasks = projectTasks.filter(t => t.status === col.id)
                return (
                  <div key={col.id} className="flex flex-col gap-3">
                    {/* Mini Column Header */}
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">{col.label}</span>
                    </div>

                    <div className="rounded-xl p-3 flex flex-col gap-3 min-h-[120px] transition-all"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)' }}>
                      {colTasks.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-800/50 rounded-lg">
                          <p className="text-[10px] text-zinc-700 italic">Vazio</p>
                        </div>
                      ) : (
                        colTasks.map((t) => (
                          <TarefaCard key={t.id} tarefa={t} onUpdate={handleUpdate} />
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
