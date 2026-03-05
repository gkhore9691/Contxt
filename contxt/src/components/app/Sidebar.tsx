'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Packs', href: '/packs' },
  { label: 'Community', href: '/community' },
  { label: 'Collections', href: '/collections' },
  { label: 'Requests', href: '/requests' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '??'

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 border-r border-[var(--bg-border)] bg-[var(--bg-base)] flex flex-col">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--bg-border)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--cx-accent)] font-mono text-[10px] font-bold text-[var(--bg-base)]">C</span>
        <span className="font-sans text-sm font-semibold text-[var(--text-primary)]">Contxt</span>
      </div>

      <nav className="flex-1 mt-4 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 mb-0.5 font-sans text-[13px] transition-all duration-150 ${
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isActive && <span className="mr-2.5 h-1.5 w-1.5 rounded-full bg-[var(--cx-accent)]" />}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[var(--bg-border)] p-4">
        {user && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-sans text-[11px] font-semibold text-[var(--text-secondary)]">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-sans text-sm font-medium text-[var(--text-primary)] truncate">{user.username}</div>
                <div className="font-sans text-[11px] text-[var(--text-muted)] truncate">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-block rounded-md border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[10px] font-medium text-[var(--text-muted)] uppercase">
                {user.plan}
              </span>
              <button
                onClick={handleLogout}
                className="font-sans text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
