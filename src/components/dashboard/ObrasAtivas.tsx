'use client'

import Link from 'next/link'
import { mockObras } from '@/lib/mock-data'
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import { MapPin, ChevronRight, User } from 'lucide-react'

export default function ObrasAtivas() {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Obras Ativas</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {mockObras.length} obras em andamento
          </p>
        </div>
        <Link
          href="/obras"
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: '#6366f1' }}
        >
          Ver todas <ChevronRight size={12} />
        </Link>
      </div>

      <div className="space-y-3">
        {mockObras.map((obra) => (
          <div
            key={obra.id}
            className="rounded-lg p-4 card-hover cursor-pointer"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{obra.nome}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={11} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {obra.localizacao}
                  </span>
                </div>
              </div>
              <span className={`badge ml-3 ${getStatusColor(obra.status)}`}>
                {getStatusLabel(obra.status)}
              </span>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${obra.progresso_total}%`,
                    background:
                      obra.progresso_total >= 80
                        ? 'var(--success)'
                        : obra.progresso_total >= 50
                        ? 'var(--accent)'
                        : 'var(--warning)',
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-white w-8 text-right">
                {obra.progresso_total}%
              </span>
            </div>

            {/* Financeiro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <User size={11} style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {obra.responsavel}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-white">
                  {formatCurrency(obra.custo_real)}
                </span>
                <span className="text-xs mx-1" style={{ color: 'var(--text-muted)' }}>/</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {formatCurrency(obra.orcamento_total)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
