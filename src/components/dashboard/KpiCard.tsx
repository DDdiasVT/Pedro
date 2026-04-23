'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon: React.ReactNode
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue'
  format?: 'currency' | 'percent' | 'number' | 'raw'
  description?: string
}

const colorMap = {
  indigo: {
    icon: 'rgba(99,102,241,0.15)',
    iconText: '#a5b4fc',
    border: 'rgba(99,102,241,0.2)',
    glow: 'rgba(99,102,241,0.08)',
  },
  emerald: {
    icon: 'rgba(16,185,129,0.15)',
    iconText: '#34d399',
    border: 'rgba(16,185,129,0.2)',
    glow: 'rgba(16,185,129,0.06)',
  },
  amber: {
    icon: 'rgba(245,158,11,0.15)',
    iconText: '#fbbf24',
    border: 'rgba(245,158,11,0.2)',
    glow: 'rgba(245,158,11,0.06)',
  },
  rose: {
    icon: 'rgba(239,68,68,0.15)',
    iconText: '#f87171',
    border: 'rgba(239,68,68,0.2)',
    glow: 'rgba(239,68,68,0.06)',
  },
  blue: {
    icon: 'rgba(59,130,246,0.15)',
    iconText: '#60a5fa',
    border: 'rgba(59,130,246,0.2)',
    glow: 'rgba(59,130,246,0.06)',
  },
}

export default function KpiCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'indigo',
  format = 'raw',
  description,
}: KpiCardProps) {
  const colors = colorMap[color]

  const formattedValue = () => {
    if (format === 'currency') return formatCurrency(Number(value))
    if (format === 'percent') return formatPercent(Number(value))
    return value
  }

  const trendIcon = () => {
    if (!trend) return <Minus size={12} style={{ color: 'var(--text-muted)' }} />
    if (trend > 0) return <TrendingUp size={12} style={{ color: '#10b981' }} />
    return <TrendingDown size={12} style={{ color: '#ef4444' }} />
  }

  const trendColor = !trend ? 'var(--text-muted)' : trend > 0 ? '#10b981' : '#ef4444'

  return (
    <div
      className="rounded-xl p-5 card-hover"
      style={{
        background: `linear-gradient(135deg, var(--bg-card) 0%, ${colors.glow} 100%)`,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: colors.icon, color: colors.iconText }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{ color: trendColor, background: `${trendColor}15` }}
          >
            {trendIcon()}
            <span>{Math.abs(trend ?? 0).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          {title}
        </p>
        <p className="text-2xl font-bold text-white">{formattedValue()}</p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        )}
        {description && (
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
        )}
      </div>
    </div>
  )
}
