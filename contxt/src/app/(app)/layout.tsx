import Sidebar from '@/components/app/Sidebar'
import Topbar from '@/components/app/Topbar'
import CommandPalette from '@/components/app/CommandPalette'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar />
      <Topbar />
      <CommandPalette />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
