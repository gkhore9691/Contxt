import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Community', href: '/community' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--bg-border)] bg-[var(--bg-base)] px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--cx-accent)] font-mono text-[10px] font-bold text-[var(--bg-base)]">
                C
              </span>
              <span className="font-sans text-sm font-semibold text-[var(--text-primary)]">Contxt</span>
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
              Load your full project context into any AI agent in 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
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
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-[var(--bg-border)] pt-6">
          <p className="font-sans text-xs text-[var(--text-muted)]">&copy; 2026 Contxt</p>
          <p className="font-sans text-xs text-[var(--text-muted)]">Made for developers, by developers.</p>
        </div>
      </div>
    </footer>
  )
}
