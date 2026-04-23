'use client'

import { useState } from 'react'
import { Camera, Sun, Cloud, CloudRain, Save, Trash2, Plus, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { FotoRegistro } from '@/types'

export default function DiarioPage() {
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [clima, setClima] = useState<'ensolarado' | 'nublado' | 'chuvoso'>('ensolarado')
  const [observacoes, setObservacoes] = useState('')
  const [falhas, setFalhas] = useState('')
  const [fotos, setFotos] = useState<FotoRegistro[]>([])
  const [saving, setSaving] = useState(false)

  const handleAddFoto = () => {
    const newFoto: FotoRegistro = {
      id: Math.random().toString(36).substr(2, 9),
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=500&auto=format&fit=crop', // Placeholder de construção
      legenda: '',
      categoria: 'progresso',
      timestamp: new Date().toISOString()
    }
    setFotos([...fotos, newFoto])
  }

  const handleRemoveFoto = (id: string) => {
    setFotos(fotos.filter(f => f.id !== id))
  }

  const handleUpdateLegenda = (id: string, legenda: string) => {
    setFotos(fotos.map(f => f.id === id ? { ...f, legenda } : f))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    alert('Diário salvo com sucesso!')
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Diário de Obra</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Registre os acontecimentos, fotos e clima do dia.
          </p>
        </div>
        <input 
          type="date" 
          value={data} 
          onChange={(e) => setData(e.target.value)}
          className="input-dark text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Data & Weather */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clima & Mao de Obra */}
          <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h3 className="text-sm font-semibold text-white">Informações Gerais</h3>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>Clima Predominante</label>
                <div className="flex gap-2">
                  {[
                    { id: 'ensolarado', icon: Sun, label: 'Ensolarado' },
                    { id: 'nublado', icon: Cloud, label: 'Nublado' },
                    { id: 'chuvoso', icon: CloudRain, label: 'Chuvoso' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setClima(item.id as any)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                        clima === item.id 
                          ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-40">
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>Efetivo (Pessoas)</label>
                <input type="number" defaultValue={12} className="input-dark w-full text-sm" />
              </div>
            </div>
          </div>

          {/* Observacoes */}
          <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h3 className="text-sm font-semibold text-white">Anotações do Dia</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>Relato das Atividades</label>
                <textarea 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Descreva o que foi feito hoje..."
                  rows={4}
                  className="input-dark w-full text-sm resize-none"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={14} className="text-rose-400" />
                  <label className="text-xs font-medium block" style={{ color: 'var(--text-secondary)' }}>Falhas ou Obstáculos</label>
                </div>
                <textarea 
                  value={falhas}
                  onChange={(e) => setFalhas(e.target.value)}
                  placeholder="Houve algum atraso ou problema técnico?"
                  rows={3}
                  className="input-dark w-full text-sm resize-none border-rose-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photos Sidebar preview */}
        <div className="space-y-6">
          <div className="rounded-xl p-5 space-y-4 h-full flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Fotos e Evidências</h3>
              <button 
                onClick={handleAddFoto}
                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2">
              {fotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-40">
                  <Camera size={40} strokeWidth={1} />
                  <p className="text-xs">Nenhuma foto adicionada<br/>hoje</p>
                </div>
              ) : (
                fotos.map((foto) => (
                  <div key={foto.id} className="group relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img src={foto.url} alt="Evidência" className="w-full h-32 object-cover" />
                    <div className="p-3 space-y-2">
                      <input 
                        type="text" 
                        placeholder="Legenda da foto..."
                        value={foto.legenda}
                        onChange={(e) => handleUpdateLegenda(foto.id, e.target.value)}
                        className="w-full bg-transparent text-xs text-white outline-none placeholder:text-zinc-600 border-b border-zinc-800 focus:border-indigo-500 pb-1"
                      />
                      <div className="flex items-center justify-between">
                        <select 
                          className="bg-transparent text-[10px] text-zinc-500 uppercase font-bold outline-none"
                          value={foto.categoria}
                          onChange={(e) => {
                            const newFotos = fotos.map(f => f.id === foto.id ? { ...f, categoria: e.target.value as any } : f)
                            setFotos(newFotos)
                          }}
                        >
                          <option value="progresso">Progresso</option>
                          <option value="seguranca">Segurança</option>
                          <option value="falha">Falha</option>
                          <option value="material">Material</option>
                        </select>
                        <button 
                          onClick={() => handleRemoveFoto(foto.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="btn-primary w-full justify-center py-3 mt-4"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar Diário'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
