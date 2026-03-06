'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Pack } from '@/types'
import { useToast } from '@/lib/toast'
import { generateOutput } from '@/lib/pack/generator'
import { calculateHealthScore } from '@/lib/pack/health-score'

const FRAMEWORK_COLORS: Record<string, string> = {
  'Next.js': '#3b82f6',
  'React': '#06b6d4',
  'Vue': '#22c55e',
  'Django': '#16a34a',
  'FastAPI': '#10b981',
  'Laravel': '#ef4444',
  'SvelteKit': '#f97316',
  'Angular': '#dc2626',
  'NestJS': '#e11d48',
  'Express': '#a1a1aa',
  'Ruby on Rails': '#dc2626',
  'React Native': '#06b6d4',
  'Nuxt': '#22c55e',
  'Remix': '#3b82f6',
  'Astro': '#f97316',
  'Flutter': '#06b6d4',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function freshnessColor(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days <= 7) return 'text-emerald-400'
  if (days <= 60) return 'text-[var(--text-muted)]'
  return 'text-red-400'
}

export default function PackCard({
  pack,
  onCopy,
  onDelete,
}: {
  pack: Pack
  onCopy?: (pack: Pack) => void
  onDelete?: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { toast } = useToast()

  const accentColor = FRAMEWORK_COLORS[pack.framework] || 'var(--bg-border)'
  const score = calculateHealthScore(pack)

  async function handleQuickCopy() {
    const output = generateOutput('CLAUDE.md', {
      title: pack.title,
      description: pack.description,
      frameworkTag: pack.framework,
      languageTag: pack.language,
      uiLib: pack.uiLib,
      db: pack.db,
      hosting: pack.hosting,
      architecture: pack.architecture,
      conventions: pack.conventions,
      aiRules: pack.aiRules,
      gotchas: pack.gotchas,
    })
    await navigator.clipboard.writeText(output)
    fetch(`/api/packs/${pack.id}/copy`, { method: 'POST' })
    setCopied(true)
    toast('Copied to clipboard', 'success')
    onCopy?.(pack)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setDeleting(true)
    const res = await fetch(`/api/packs/${pack.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast('Pack deleted', 'success')
      onDelete?.()
    }
    setDeleting(false)
    setConfirmDelete(false)
  }

  // Score ring
  const ringSize = 28
  const r = (ringSize - 4) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score.total / 100) * circ
  const ringColor = score.band === 'expert' || score.band === 'strong' ? '#10b981' : score.band === 'good' ? '#eab308' : '#ef4444'

  return (
    <div className="group relative rounded-2xl border border-[var(--bg-border)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-base)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 hover:border-[var(--bg-border)]"
      style={{ borderLeftColor: accentColor, borderLeftWidth: '2px' }}
    >
      {/* Score ring - top right */}
      <div className="absolute top-4 right-4" title={`Health: ${score.total}/100 — ${score.bandLabel}`}>
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke="var(--bg-border)" strokeWidth="2" />
          <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke={ringColor} strokeWidth="2" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold text-[var(--text-muted)]">{score.total}</span>
      </div>

      {/* Title + visibility */}
      <div className="pr-10">
        <Link
          href={`/packs/${pack.id}`}
          className="font-sans text-[15px] font-semibold text-[var(--text-primary)] hover:text-[var(--cx-accent)] transition-colors leading-snug"
        >
          {pack.title}
        </Link>
      </div>

      {pack.description && (
        <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-[var(--text-muted)] line-clamp-2">{pack.description}</p>
      )}

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[pack.framework, pack.language, pack.uiLib].filter(Boolean).filter(t => t !== 'None').map((tag) => (
          <span key={tag} className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[10px] text-[var(--text-muted)]">{tag}</span>
        ))}
        <span className={`rounded-md px-2 py-0.5 font-sans text-[10px] font-medium ${
          pack.isPublic ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
        }`}>
          {pack.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--bg-border)] pt-3">
        <div className="flex items-center gap-2.5 font-sans text-[10px] text-[var(--text-muted)]">
          {pack.upvotes > 0 && <span>▲ {pack.upvotes}</span>}
          <span className={freshnessColor(pack.updatedAt)}>Updated {timeAgo(pack.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Quick copy — always visible */}
          <button
            onClick={handleQuickCopy}
            className={`rounded-md px-2.5 py-1 font-sans text-[10px] font-medium transition-all ${
              copied
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-[var(--cx-accent)]/10 text-[var(--cx-accent)] hover:bg-[var(--cx-accent)]/20'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {/* Edit + Delete — show on hover */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/packs/${pack.id}`} className="rounded-md px-2 py-1 font-sans text-[10px] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors">
              Edit
            </Link>
            {onDelete && (
              <button onClick={handleDelete} disabled={deleting} className={`rounded-md px-2 py-1 font-sans text-[10px] transition-colors ${confirmDelete ? 'bg-red-500/20 text-red-400' : 'text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400'}`}>
                {confirmDelete ? 'Sure?' : 'Del'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
