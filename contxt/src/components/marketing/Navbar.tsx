'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'

export default function Navbar() {
  const { user, loading } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--bg-border)]/50 bg-[var(--bg-base)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--cx-accent)] font-mono text-[10px] font-bold text-[var(--bg-base)]">
            C
          </span>
          <span className="font-sans text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Contxt
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Pricing', href: '#pricing' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-[13px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 font-sans text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
