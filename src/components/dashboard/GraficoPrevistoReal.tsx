'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { mockCustosHistorico } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <span className="font-medium text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
        {payload.length === 2 && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
              Variação: {formatCurrency(payload[1].value - payload[0].value)}
            </span>
          </div>
        )}
      </div>
    )
  }
  return null
}

export default function GraficoPrevistoReal() {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Custo Previsto vs. Real</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Evolução mensal – Residencial Vila Nova
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded bg-indigo-400" />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Previsto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded bg-emerald-400" />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Real</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={mockCustosHistorico} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="previsto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="real" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="mes"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="custo_previsto"
            name="Previsto"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#previsto)"
            dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#6366f1' }}
          />
          <Area
            type="monotone"
            dataKey="custo_real"
            name="Real"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#real)"
            dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#10b981' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
