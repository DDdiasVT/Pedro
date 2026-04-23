'use client'

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
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-light)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center glow-indigo"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">BuildMind</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Gestão com IA</p>
          </div>
        </Link>
      </div>

      {/* Obra atual */}
      <div className="mx-3 mt-4 mb-2 rounded-lg px-3 py-3 cursor-pointer"
        style={{ background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Obra ativa</p>
        <p className="text-xs font-semibold text-white leading-tight">Residencial Vila Nova – Bloco A</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 progress-bar">
            <div className="progress-bar-fill" style={{ width: '65%', background: 'var(--accent)' }} />
          </div>
          <span className="text-xs font-medium" style={{ color: '#a5b4fc' }}>65%</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold px-2 mb-2 mt-1 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-item', isActive && 'active')}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} style={{ color: '#6366f1' }} />}
            </Link>
          )
        })}
      </nav>

      {/* AI badge */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <Zap size={13} style={{ color: '#10b981' }} />
          <span className="text-xs font-medium" style={{ color: '#10b981' }}>Gemini Ativo</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ml-auto ai-pulse" />
        </div>
        <Link href="/settings" className="sidebar-item mt-2 w-full">
          <Settings size={15} />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  )
}
