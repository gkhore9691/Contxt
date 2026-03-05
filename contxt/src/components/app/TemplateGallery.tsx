'use client'

import { PACK_TEMPLATES, type PackTemplate } from '@/lib/pack/templates'

export default function TemplateGallery({
  onSelect,
  onSkip,
}: {
  onSelect: (template: PackTemplate) => void
  onSkip: () => void
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <p className="font-mono text-[11px] text-[var(--cx-accent)] uppercase tracking-wider">New pack</p>
        <h1 className="mt-1 font-display text-2xl text-[var(--text-primary)]">Choose a template</h1>
        <p className="mt-1.5 font-sans text-sm text-[var(--text-secondary)]">
          Start from a pre-filled template or build from scratch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-6">
        {PACK_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="group rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 text-left transition-all hover:border-[var(--cx-accent)]/30 hover:bg-[var(--bg-elevated)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-sans text-[15px] font-medium text-[var(--text-primary)] group-hover:text-[var(--cx-accent)] transition-colors">
                  {t.name}
                </h3>
                <p className="mt-1 font-sans text-[12px] text-[var(--text-muted)] line-clamp-2">{t.description}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[10px] text-[var(--text-muted)]">{t.framework}</span>
              <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[10px] text-[var(--text-muted)]">{t.language}</span>
              <span className="ml-auto font-sans text-[10px] text-[var(--text-muted)]">Used {t.usedCount.toLocaleString()} times</span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onSkip}
          className="font-sans text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Or start from scratch →
        </button>
      </div>
    </div>
  )
}
