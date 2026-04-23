'use client'

import { useState, useEffect } from 'react'
import { FolderOpen, FileText, Upload, Download, Trash2, Search, Filter, Loader2, Plus, File, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function DocumentosPage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [obras, setObras] = useState<any[]>([])
  const [obraAtiva, setObraAtiva] = useState<any>(null)
  const [documentos, setDocumentos] = useState<any[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState('todos')

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (obraAtiva) fetchDocumentos()
  }, [obraAtiva, filtroCategoria])

  async function fetchObras() {
    const { data } = await supabase.from('obras').select('*')
    if (data && data.length > 0) {
      setObras(data)
      setObraAtiva(data[0])
    }
  }

  async function fetchDocumentos() {
    setLoading(true)
    let query = supabase
      .from('documentos_obra')
      .select('*')
      .eq('obra_id', obraAtiva.id)
      .order('created_at', { ascending: false })
    
    if (filtroCategoria !== 'todos') {
      query = query.eq('categoria', filtroCategoria)
    }

    const { data } = await query
    setDocumentos(data || [])
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file || !obraAtiva) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `documentos/${obraAtiva.id}/${fileName}`

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('obras')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('obras')
        .getPublicUrl(filePath)

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('documentos_obra')
        .insert([{
          obra_id: obraAtiva.id,
          nome: file.name,
          url: publicUrl,
          categoria: 'outros', // Default
          tamanho: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          extensao: fileExt
        }])

      if (dbError) throw dbError

      fetchDocumentos()
    } catch (error: any) {
      alert('Erro no upload: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string, url: string) {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return
    
    // Simplificando: Deletar apenas do DB para este MVP (Ideal é deletar do storage também)
    const { error } = await supabase.from('documentos_obra').delete().eq('id', id)
    if (error) alert(error.message)
    else fetchDocumentos()
  }

  const categorias = [
    { id: 'todos', label: 'Todos' },
    { id: 'arquitetura', label: 'Arquitetura' },
    { id: 'estrutural', label: 'Estrutural' },
    { id: 'eletrico', label: 'Elétrico' },
    { id: 'hidraulico', label: 'Hidráulico' },
    { id: 'contrato', label: 'Contratos' },
    { id: 'outros', label: 'Outros' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white">Gestão de Documentos</h1>
          <p className="text-sm text-zinc-500 mt-1">Armazene plantas, projetos técnicos e contratos da obra.</p>
        </div>

        <div className="flex items-center gap-4">
          <select 
            className="bg-zinc-900 text-sm font-bold text-white px-4 py-2 rounded-xl border border-zinc-800 outline-none"
            value={obraAtiva?.id}
            onChange={(e) => setObraAtiva(obras.find(o => o.id === e.target.value))}
          >
            {obras.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </select>
          <label className="cursor-pointer btn-primary flex items-center gap-2">
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            Upload de Arquivo
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Categoria Chips */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFiltroCategoria(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
              filtroCategoria === cat.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {loading && documentos.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Buscando documentos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documentos.map(doc => (
            <div key={doc.id} className="group rounded-3xl p-6 space-y-4 transition-all hover:scale-[1.02]" 
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
              
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-indigo-400">
                  <FileText size={32} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white">
                    <Eye size={14} />
                  </a>
                  <button onClick={() => handleDelete(doc.id, doc.url)} className="p-2 rounded-lg bg-zinc-800 text-rose-400 hover:bg-rose-500/10">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate pr-4">{doc.nome}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{doc.categoria}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{doc.tamanho}</span>
                </div>
              </div>

              <a 
                href={doc.url} 
                download 
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <Download size={14} /> Baixar Arquivo
              </a>
            </div>
          ))}
          
          {documentos.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-zinc-900/50 border border-dashed border-zinc-800 flex items-center justify-center mx-auto opacity-50">
                <FolderOpen size={32} className="text-zinc-600" />
              </div>
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Nenhum documento encontrado nesta categoria</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
