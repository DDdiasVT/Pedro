import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'BuildMind – Gestão de Obras com IA',
  description: 'Plataforma inteligente para planejamento e acompanhamento de obras. KPIs em tempo real, IA para desdobramento de tarefas e gestão de insumos.',
  keywords: 'gestão de obras, planejamento de construção, IA, KPIs, IDC, IDP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-60 min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
