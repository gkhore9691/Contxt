'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { LayoutDashboard, Package, Globe, BookOpen, MessageSquare, LogOut, Sparkles } from 'lucide-react'

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Packs', href: '/packs', icon: Package, countKey: 'packs' as const },
    ],
  },
  {
    label: 'Discover',
    items: [
      { label: 'Community', href: '/community', icon: Globe },
      { label: 'Collections', href: '/collections', icon: BookOpen },
      { label: 'Requests', href: '/requests', icon: MessageSquare },
    ],
  },
]

export default function Sidebar({ packCount }: { packCount?: number }) {
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
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--bg-border)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--cx-accent)] font-mono text-[10px] font-bold text-[var(--bg-base)]">B</span>
        <span className="font-sans text-sm font-semibold text-[var(--text-primary)]">Brain Pack</span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 mt-2 px-3 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 mb-1.5 font-sans text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              const count = 'countKey' in item && item.countKey === 'packs' ? packCount : undefined
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 mb-0.5 font-sans text-[13px] transition-all duration-150 ${
                    isActive
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-[var(--cx-accent)]' : 'text-[var(--text-muted)]'} />
                  <span className="flex-1">{item.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className="rounded-full bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
                      {count}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Cmd+K hint */}
      <div className="px-4 pb-2">
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="flex w-full items-center gap-2 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3 py-2 transition-colors hover:border-[var(--text-muted)]"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-[var(--text-muted)]">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="flex-1 text-left font-sans text-[11px] text-[var(--text-muted)]">Quick search</span>
          <kbd className="rounded border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-1 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* User section */}
      <div className="border-t border-[var(--bg-border)] p-4">
        {user && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-sans text-[11px] font-semibold text-[var(--text-secondary)]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-sans text-sm font-medium text-[var(--text-primary)] truncate">{user.username}</div>
                <div className="font-sans text-[10px] text-[var(--text-muted)] truncate">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {user.plan === 'free' ? (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 rounded-md bg-[var(--cx-accent)]/10 px-2 py-1 font-sans text-[10px] font-medium text-[var(--cx-accent)] hover:bg-[var(--cx-accent)]/20 transition-colors"
                >
                  <Sparkles size={10} />
                  Upgrade
                </Link>
              ) : (
                <span className="inline-block rounded-md border border-[var(--cx-accent)]/20 bg-[var(--cx-accent)]/10 px-2 py-0.5 font-sans text-[10px] font-medium text-[var(--cx-accent)] uppercase">
                  {user.plan}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 font-sans text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <LogOut size={11} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
