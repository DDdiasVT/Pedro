'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // No modo aberto, não escondemos o sidebar por falta de login
  const isLoginPage = pathname === '/login' || pathname === '/register'

  return (
    <div className="flex min-h-screen bg-black text-white">
      {!isLoginPage && <Sidebar />}
      <main className={cn(
        "flex-1 w-full pt-16 lg:pt-0",
        !isLoginPage ? "lg:pl-64" : ""
      )}>
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
