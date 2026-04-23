'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BrainCircuit,
  ListChecks,
  Package,
  Settings,
  Building2,
  Zap,
  ChevronRight,
  Camera,
  FileText,
  Users,
  DollarSign,
  Menu,
  X,
  FolderOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/obras', label: 'Obras', icon: Building2 },
  { href: '/planejamento', label: 'Planejamento IA', icon: BrainCircuit },
  { href: '/tarefas', label: 'Tarefas', icon: ListChecks },
  { href: '/insumos', label: 'Insumos', icon: Package },
  { href: '/funcionarios', label: 'Funcionários', icon: Users },
  { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/diario', label: 'Diário de Obra', icon: Camera },
  { href: '/relatorios', label: 'Relatórios', icon: FileText },
  { href: '/documentos', label: 'Documentos', icon: FolderOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-indigo-600 text-white shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-light)' }}>

        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-indigo"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-white tracking-tight">BuildMind</p>
              <p className="text-[10px] uppercase font-black tracking-widest" style={{ color: 'var(--text-muted)' }}>Pro Edition</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black px-2 mb-4 uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
            Main Menu
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn('sidebar-item group', isActive && 'active')}
              >
                <Icon size={18} className={cn("transition-colors", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")} />
                <span className="flex-1">{label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <Zap size={14} className="text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Gemini AI Active</span>
          </div>
          <Link 
            href="/settings" 
            onClick={() => setIsOpen(false)}
            className="sidebar-item mt-3"
          >
            <Settings size={18} />
            <span>Configurações</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
