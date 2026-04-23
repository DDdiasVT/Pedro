import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'BuildMind | Inteligência em Construção',
  description: 'Gestão de obras de alto nível com IA e dados em tempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  )
}

// Sub-componente para usar o hook de autenticação
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  
  // Páginas públicas que não mostram o Sidebar
  const isPublicPage = pathname === '/login' || pathname === '/register'

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black">
      {!isPublicPage && user && <Sidebar />}
      <main className={cn(
        "flex-1 w-full pt-16 lg:pt-0",
        !isPublicPage && user ? "lg:pl-64" : ""
      )}>
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

import { cn } from '@/lib/utils'
