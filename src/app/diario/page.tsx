'use client'

import { useState, useEffect } from 'react'
import { Camera, Plus, Calendar, Cloud, Save, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function DiarioPage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [registros, setRegistros] = useState<any[]>([])
  const [novoRegistro, setNovoRegistro] = useState({
    data: new Date().toISOString().split('T')[0],
    clima: 'ensolarado',
    temperatura: '28°C',
    observacoes: '',
    falhas_obstaculos: '',
  })
  const [fotos, setFotos] = useState<any[]>([])

  useEffect(() => {
    fetchRegistros()
  }, [])

  async function fetchRegistros() {
    const { data } = await supabase
      .from('registros_diarios')
      .select('*, fotos_diario(*)')
      .order('data', { ascending: false })
    setRegistros(data || [])
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `diario/${fileName}`

      // 1. Upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('obras')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Pegar URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('obras')
        .getPublicUrl(filePath)

      // 3. Adicionar na lista temporária (antes de salvar o registro todo)
      setFotos([...fotos, { url: publicUrl, legenda: '' }])

    } catch (error: any) {
      alert('Erro no upload: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSalvar() {
    setLoading(true)
    try {
      // 1. Salvar Cabeçalho do Diário
      const { data: registro, error: regError } = await supabase
        .from('registros_diarios')
        .upsert([novoRegistro], { onConflict: 'obra_id,data' })
        .select()
        .single()

      if (regError) throw regError

      // 2. Salvar Fotos se houver
      if (fotos.length > 0) {
        const fotosData = fotos.map(f => ({
          registro_diario_id: registro.id,
          url: f.url,
          legenda: f.legenda
        }))
        const { error: fotoError } = await supabase
          .from('fotos_diario')
          .insert(fotosData)
        if (fotoError) throw fotoError
      }

      alert('Diário de hoje salvo com sucesso!')
      setFotos([])
      setNovoRegistro({
        ...novoRegistro,
        observacoes: '',
        falhas_obstaculos: ''
      })
      fetchRegistros()
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Diário de Obra</h1>
          <p className="text-sm text-zinc-500 mt-1">Registre o progresso diário e evidências fotográficas.</p>
        </div>
        <button 
          onClick={handleSalvar}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Salvar Diário
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl p-6 space-y-6 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Data</label>
                <input 
                  type="date" 
                  className="input-dark w-full" 
                  value={novoRegistro.data}
                  onChange={e => setNovoRegistro({...novoRegistro, data: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Clima</label>
                <select 
                  className="input-dark w-full"
                  value={novoRegistro.clima}
                  onChange={e => setNovoRegistro({...novoRegistro, clima: e.target.value})}
                >
                  <option value="ensolarado">Ensolarado</option>
                  <option value="nublado">Nublado</option>
                  <option value="chuva_leve">Chuva Leve</option>
                  <option value="chuva_forte">Chuva Forte (Paralisação)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Atividades do Dia</label>
              <textarea 
                className="input-dark w-full min-h-[120px]" 
                placeholder="Descreva o que foi realizado hoje..."
                value={novoRegistro.observacoes}
                onChange={e => setNovoRegistro({...novoRegistro, observacoes: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Ocorrências / Obstáculos</label>
              <textarea 
                className="input-dark w-full min-h-[80px] border-rose-500/20" 
                placeholder="Algum problema ou atraso hoje?"
                value={novoRegistro.falhas_obstaculos}
                onChange={e => setNovoRegistro({...novoRegistro, falhas_obstaculos: e.target.value})}
              />
            </div>
          </div>

          {/* Galeria de Upload */}
          <div className="rounded-3xl p-6 space-y-4 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-400" /> Fotos e Evidências
              </h3>
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                <Camera size={16} /> 
                {uploading ? 'Enviando...' : 'Adicionar Foto'}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>

            {fotos.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600">
                <ImageIcon size={40} className="mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhuma foto selecionada</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {fotos.map((foto, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden border border-zinc-800 aspect-square">
                    <img src={foto.url} className="w-full h-full object-cover" alt="Upload" />
                    <button 
                      onClick={() => setFotos(fotos.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-md">
                      <input 
                        className="bg-transparent text-[10px] text-white outline-none w-full placeholder:text-zinc-400"
                        placeholder="Legenda..."
                        value={foto.legenda}
                        onChange={e => {
                          const newFotos = [...fotos]
                          newFotos[idx].legenda = e.target.value
                          setFotos(newFotos)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Historico Sidebar */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Histórico Recente</h3>
          <div className="space-y-4">
            {registros.map(reg => (
              <div key={reg.id} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{new Date(reg.data).toLocaleDateString()}</span>
                  <span className="text-[10px] font-black uppercase text-zinc-500">{reg.clima}</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{reg.observacoes}</p>
                {reg.fotos_diario?.length > 0 && (
                  <div className="flex gap-1 overflow-hidden h-8">
                    {reg.fotos_diario.map((f: any) => (
                      <img key={f.id} src={f.url} className="w-8 h-8 rounded object-cover border border-zinc-700" alt="Mini" />
                    ))}
                    {reg.fotos_diario.length > 3 && <span className="text-[10px] text-zinc-500 self-center">+{reg.fotos_diario.length - 3}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
