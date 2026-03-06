'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import Sidebar from '@/components/app/Sidebar'
import Topbar from '@/components/app/Topbar'
import CommandPalette from '@/components/app/CommandPalette'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [packCount, setPackCount] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!user) return
    fetch('/api/packs')
      .then(r => r.json())
      .then(d => setPackCount(d.packs?.length ?? 0))
      .catch(() => {})
  }, [user])

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar packCount={packCount} />
      <Topbar />
      <CommandPalette />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
