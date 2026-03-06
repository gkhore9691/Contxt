'use client'

import { useState } from 'react'
import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Community', href: '/community' },
    { label: 'Templates', href: '/packs/new' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'API', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="border-t border-[var(--bg-border)] bg-[var(--bg-base)] px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--cx-accent)] font-mono text-[10px] font-bold text-[var(--bg-base)]">B</span>
              <span className="font-sans text-sm font-semibold text-[var(--text-primary)]">Brain Pack</span>
            </div>
            <p className="mb-5 font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
              Load your full project context into any AI agent in 30 seconds.
            </p>

            {/* Newsletter */}
            {subscribed ? (
              <p className="font-sans text-[13px] text-emerald-400">Subscribed! Check your inbox.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get weekly AI context tips"
                  required
                  className="flex-1 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3 py-2 font-sans text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cx-accent)]/40 focus:outline-none"
                />
                <button type="submit" className="rounded-lg bg-[var(--cx-accent)] px-3 py-2 font-sans text-xs font-medium text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)] transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([col, items]) => (
            <div key={col}>
              <p className="mb-3 font-sans text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{col}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="font-sans text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--bg-border)] pt-6 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-[var(--text-muted)]">&copy; 2026 Brain Pack. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-sans text-xs text-[var(--text-muted)]">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
