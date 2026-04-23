'use client'

import { useState } from 'react'
import { User, Building2, Brain, Bell, Shield, Palette, Save, LogOut, CheckCircle2, Sliders } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('perfil')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'perfil', label: 'Meu Perfil', icon: User },
    { id: 'empresa', label: 'Dados da Empresa', icon: Building2 },
    { id: 'ia', label: 'Configurações de IA', icon: Brain },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Configurações</h1>
          <p className="text-sm text-zinc-500 mt-1">Personalize sua experiência e gerencie sua conta.</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={14} /> Alterações salvas com sucesso!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-800"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-zinc-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all">
              <LogOut size={18} />
              Sair do Sistema
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 rounded-3xl p-8 space-y-8" 
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          
          {activeTab === 'perfil' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                  P
                </div>
                <div>
                  <button className="btn-primary text-xs py-2 px-4">Alterar Foto</button>
                  <p className="text-[10px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Nome Completo</label>
                  <input className="input-dark w-full" defaultValue="Eng. Pedro Silva" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">E-mail</label>
                  <input className="input-dark w-full" defaultValue="pedro@buildmind.com.br" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Cargo</label>
                  <input className="input-dark w-full" defaultValue="Sócio-Diretor / Engenheiro Civil" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Telefone</label>
                  <input className="input-dark w-full" defaultValue="(11) 99999-9999" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'empresa' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Nome Fantasia</label>
                  <input className="input-dark w-full" defaultValue="BuildMind Construções Inteligentes" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase">CNPJ</label>
                    <input className="input-dark w-full" defaultValue="00.000.000/0001-00" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Inscrição Estadual</label>
                    <input className="input-dark w-full" defaultValue="Isento" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Endereço Sede</label>
                  <input className="input-dark w-full" defaultValue="Av. Faria Lima, 1000 - Itaim Bibi, SP" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex items-start gap-4">
                <Brain className="text-indigo-400 mt-1" size={20} />
                <div>
                  <p className="text-sm font-bold text-white">Motor de Inteligência BuildMind</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Personalize como a IA interpreta seus dados e gera seus planejamentos automáticos.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <p className="text-xs font-bold text-white">Modelo de Linguagem</p>
                    <p className="text-[10px] text-zinc-500">Versão do motor de processamento</p>
                  </div>
                  <select className="bg-zinc-800 text-[10px] font-bold text-white px-3 py-1.5 rounded-lg border-none outline-none">
                    <option>Gemini 1.5 Flash (Recomendado)</option>
                    <option>Gemini 1.5 Pro (Mais Lento / Preciso)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <p className="text-xs font-bold text-white">Ajuste de Custo IA</p>
                    <p className="text-[10px] text-zinc-500">Margem de segurança para orçamentos gerados</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-zinc-500">10%</span>
                    <input type="range" className="w-24 h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <p className="text-xs font-bold text-white">Análise Preditiva de Atrasos</p>
                    <p className="text-[10px] text-zinc-500">Habilitar avisos automáticos no Dashboard</p>
                  </div>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative flex items-center px-1">
                    <div className="w-3.5 h-3.5 bg-white rounded-full ml-auto shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-zinc-800 flex justify-end">
            <button 
              onClick={handleSave}
              className="btn-primary px-8 py-3 flex items-center gap-2"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
