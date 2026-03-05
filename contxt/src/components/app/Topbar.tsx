'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const labels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/packs': 'My Packs',
  '/community': 'Community',
  '/collections': 'Collections',
  '/requests': 'Pack Requests',
}

export default function Topbar() {
  const pathname = usePathname()

  const label =
    Object.entries(labels).find(([key]) => pathname === key || pathname.startsWith(key + '/'))
      ?.[1] ?? ''

  return (
    <header className="fixed top-0 left-56 right-0 z-40 flex h-14 items-center justify-between border-b border-[var(--bg-border)] bg-[var(--bg-base)]/90 px-6 backdrop-blur-sm">
      <p className="font-sans text-sm font-medium text-[var(--text-primary)]">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden md:flex items-center gap-2 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3 py-1.5 font-sans text-[12px] text-[var(--text-muted)] hover:border-[var(--text-muted)] transition-colors"
        >
          <span>Search packs</span>
          <kbd className="rounded border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <Link
          href="/packs/new"
          className="rounded-lg bg-[var(--cx-accent)] px-4 py-1.5 font-sans text-[13px] font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)]"
        >
          + New Pack
        </Link>
      </div>
    </header>
  )
}
