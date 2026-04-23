'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'

export function ClientLayout({ children }: { children: React.ReactNode }) {
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
        (!isPublicPage && user) ? "lg:pl-64" : ""
      )}>
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
