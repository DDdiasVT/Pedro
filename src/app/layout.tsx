import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

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
        <div className="flex min-h-screen bg-black">
          <Sidebar />
          <main className="flex-1 w-full lg:pl-64 pt-16 lg:pt-0">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
