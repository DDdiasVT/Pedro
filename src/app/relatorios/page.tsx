'use client'

import { useState } from 'react'
import { FileText, Calendar, CheckSquare, Download, Eye, Layout, Share2, Building2, Users } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { mockKPIs, mockTarefas, mockObras, mockInsumos } from '@/lib/mock-data'

export default function RelatoriosPage() {
  const [dataInicio, setDataInicio] = useState('2024-04-01')
  const [dataFim, setDataFim] = useState('2024-04-23')
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [options, setOptions] = useState({
    kpis: true,
    tasks: true,
    financial: true,
    photos: true,
    observations: true,
    hr: true
  })

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowPreview(true)
    }, 1500)
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerador de Relatórios</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Selecione as informações para compor o relatório de obra.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl p-6 space-y-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar size={16} className="text-indigo-400" /> Período
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Início</label>
                  <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="input-dark w-full text-sm" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Fim</label>
                  <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="input-dark w-full text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layout size={16} className="text-indigo-400" /> Conteúdo
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'kpis', label: 'Resumo de KPIs (IDC/IDP)', icon: FileText },
                  { id: 'tasks', label: 'Cronograma de Tarefas', icon: CheckSquare },
                  { id: 'financial', label: 'Resumo Financeiro', icon: Building2 },
                  { id: 'photos', label: 'Diário Fotográfico', icon: CheckSquare },
                  { id: 'hr', label: 'Mão de Obra e Efetivo', icon: Users },
                  { id: 'observations', label: 'Observações e Ocorrências', icon: FileText },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={(options as any)[item.id]} 
                      onChange={(e) => setOptions({...options, [item.id]: e.target.checked})}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                    />
                    <span className="text-xs text-zinc-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? 'Processando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 min-h-[600px] flex flex-col">
          {!showPreview && !loading ? (
            <div className="flex-1 rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-50">
              <FileText size={60} strokeWidth={1} className="text-zinc-600" />
              <div>
                <p className="text-sm font-semibold text-white">Nenhum relatório gerado</p>
                <p className="text-xs max-w-xs mx-auto mt-1" style={{ color: 'var(--text-muted)' }}>
                  Configure os parâmetros ao lado e clique em gerar para visualizar o relatório.
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-zinc-400">Compilando dados e gerando preview...</p>
            </div>
          ) : (
            <div className="flex-1 space-y-6">
              {/* Report Header Controls */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-xs font-semibold text-indigo-300">
                  Preview: Relatório_Obra_{dataFim}.pdf
                </p>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-all"><Share2 size={16} /></button>
                  <button className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-all"><Eye size={16} /></button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all">
                    <Download size={14} /> Baixar PDF
                  </button>
                </div>
              </div>

              {/* PDF Simulation Canvas */}
              <div className="flex-1 bg-white rounded-lg shadow-2xl p-12 text-zinc-900 space-y-8 overflow-y-auto max-h-[800px]">
                {/* Header Relatorio */}
                <div className="flex items-start justify-between border-b pb-6">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-indigo-900">BuildMind</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Relatório de Status de Obra</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-zinc-500">Data de Emissão</p>
                    <p className="text-xs font-bold">23 de Abril, 2024</p>
                  </div>
                </div>

                {/* Obra Info */}
                <div className="grid grid-cols-2 gap-8 text-[10px]">
                  <div>
                    <p className="font-bold text-zinc-400 uppercase mb-1">Obra</p>
                    <p className="text-sm font-bold text-zinc-900">{mockObras[0].nome}</p>
                    <p className="text-zinc-500">{mockObras[0].localizacao}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zinc-400 uppercase mb-1">Período Relatado</p>
                    <p className="text-sm font-bold text-zinc-900">{dataInicio} a {dataFim}</p>
                  </div>
                </div>

                {/* KPIs Section */}
                {options.kpis && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase border-l-4 border-indigo-600 pl-2">01. Resumo de Indicadores</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-zinc-50 p-4 rounded border">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">IDC (Custo)</p>
                        <p className="text-xl font-black text-indigo-900">{mockKPIs.idc}</p>
                      </div>
                      <div className="bg-zinc-50 p-4 rounded border">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">IDP (Prazo)</p>
                        <p className="text-xl font-black text-indigo-900">{mockKPIs.idp}</p>
                      </div>
                      <div className="bg-zinc-50 p-4 rounded border">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">Progresso</p>
                        <p className="text-xl font-black text-indigo-900">{mockKPIs.progresso_total}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* RH Section */}
                {options.hr && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase border-l-4 border-indigo-600 pl-2">02. Mão de Obra e Efetivo</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-rose-50 p-3 rounded border border-rose-100">
                        <p className="text-[8px] font-bold text-rose-400 uppercase">Total de Faltas</p>
                        <p className="text-lg font-black text-rose-700">12</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                        <p className="text-[8px] font-bold text-emerald-400 uppercase">Presença Média</p>
                        <p className="text-lg font-black text-emerald-700">92%</p>
                      </div>
                    </div>
                    <table className="w-full text-[10px]">
                      <thead className="bg-zinc-100">
                        <tr>
                          <th className="p-2 text-left">Funcionário</th>
                          <th className="p-2 text-center">Equipe</th>
                          <th className="p-2 text-right">Faltas no Período</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="border-b">
                          <td className="p-2 py-2 font-bold">João Pedro</td>
                          <td className="p-2 text-center text-zinc-500">Equipe Civil</td>
                          <td className="p-2 text-right font-black text-rose-600">4</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 py-2 font-bold">Ricardo Souza</td>
                          <td className="p-2 text-center text-zinc-500">Geral</td>
                          <td className="p-2 text-right font-black text-zinc-400">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tasks Section */}
                {options.tasks && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase border-l-4 border-indigo-600 pl-2">02. Cronograma e Atividades</h3>
                    <table className="w-full text-[10px]">
                      <thead className="bg-zinc-100">
                        <tr>
                          <th className="p-2 text-left">Tarefa</th>
                          <th className="p-2 text-center">Status</th>
                          <th className="p-2 text-right">Progresso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {mockTarefas.slice(0, 5).map(t => (
                          <tr key={t.id} className="border-b">
                            <td className="p-2 py-4">
                              <p className="font-bold text-zinc-900">{t.nome}</p>
                              {t.ocorrencias && t.ocorrencias.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {t.ocorrencias.map(oc => (
                                    <div key={oc.id} className="pl-3 border-l-2 border-zinc-100">
                                      <p className="text-[8px] font-black uppercase text-rose-500">Ocorrência • {oc.importancia}</p>
                                      <p className="text-[9px] text-zinc-600">{oc.descricao}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="p-2 text-center capitalize align-top pt-4">{t.status.replace('_', ' ')}</td>
                            <td className="p-2 text-right font-bold align-top pt-4">{t.percentual_conclusao}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Financial Section */}
                {options.financial && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase border-l-4 border-indigo-600 pl-2">03. Resumo Financeiro</h3>
                    <div className="p-4 bg-zinc-900 rounded-lg text-white flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">Custo Real Acumulado</p>
                        <p className="text-lg font-bold">{formatCurrency(mockKPIs.custo_real)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">Saldo Orçamentário</p>
                        <p className="text-lg font-bold text-emerald-400">{formatCurrency(mockKPIs.orcamento_total - mockKPIs.custo_real)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos Section */}
                {options.photos && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase border-l-4 border-indigo-600 pl-2">04. Diário Fotográfico</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="h-40 bg-zinc-100 rounded border overflow-hidden">
                            <img src={`https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=500&auto=format&fit=crop`} alt="Obra" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[9px] text-zinc-500 italic">Legenda da evidência técnica {i} - Capturada em {dataFim}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Footer */}
                <div className="pt-12 border-t mt-12 text-[8px] text-center text-zinc-400 uppercase tracking-widest">
                  Este relatório foi gerado automaticamente pelo sistema BuildMind IA
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
