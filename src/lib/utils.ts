import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pendente: 'text-zinc-400 bg-zinc-400/10',
    em_andamento: 'text-blue-400 bg-blue-400/10',
    concluido: 'text-emerald-400 bg-emerald-400/10',
    atrasado: 'text-rose-400 bg-rose-400/10',
    planejamento: 'text-amber-400 bg-amber-400/10',
    pausada: 'text-orange-400 bg-orange-400/10',
  }
  return map[status] ?? 'text-zinc-400 bg-zinc-400/10'
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
    atrasado: 'Atrasado',
    planejamento: 'Planejamento',
    pausada: 'Pausada',
  }
  return map[status] ?? status
}

export function calcularIDP(tarefas: { percentual_conclusao: number; data_fim_previsto: string }[]): number {
  const hoje = new Date()
  let somaIDP = 0
  let count = 0

  tarefas.forEach((t) => {
    const fim = new Date(t.data_fim_previsto)
    const diasTotal = (fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    const idp = diasTotal > 0 ? 1 : t.percentual_conclusao / 100
    somaIDP += idp
    count++
  })

  return count > 0 ? somaIDP / count : 1
}
