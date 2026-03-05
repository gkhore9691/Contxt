'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Pack } from '@/types'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
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

  function handleCopy() {
    setCopied(true)
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
    if (res.ok) onDelete?.()
    setDeleting(false)
    setConfirmDelete(false)
  }

  return (
    <div className="group rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:border-[var(--cx-accent)]/25 hover:bg-[var(--bg-elevated)]">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/packs/${pack.id}`}
          className="font-sans text-[15px] font-medium text-[var(--text-primary)] hover:text-[var(--cx-accent)] transition-colors leading-snug"
        >
          {pack.title}
        </Link>
        <span className={`flex-shrink-0 rounded-md px-2 py-0.5 font-sans text-[10px] font-medium ${
          pack.isPublic
            ? 'bg-[var(--cx-accent)]/10 text-[var(--cx-accent)]'
            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
        }`}>
          {pack.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {pack.description && (
        <p className="mt-2 font-sans text-[13px] leading-relaxed text-[var(--text-muted)] line-clamp-2">{pack.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {[pack.framework, pack.language, pack.uiLib].filter(Boolean).filter(t => t !== 'None').map((tag) => (
          <span key={tag} className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[11px] text-[var(--text-muted)]">{tag}</span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--bg-border)] pt-3">
        <div className="flex items-center gap-3 font-sans text-[11px] text-[var(--text-muted)]">
          {pack.upvotes > 0 && <span>{pack.upvotes} upvotes</span>}
          <span>Updated {timeAgo(pack.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy} className="rounded-md px-2 py-1 font-sans text-[11px] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--cx-accent)] transition-colors">
            {copied ? 'Copied' : 'Copy'}
          </button>
          <Link href={`/packs/${pack.id}`} className="rounded-md px-2 py-1 font-sans text-[11px] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors">
            Edit
          </Link>
          {onDelete && (
            <button onClick={handleDelete} disabled={deleting} className={`rounded-md px-2 py-1 font-sans text-[11px] transition-colors ${confirmDelete ? 'bg-red-500/20 text-red-400' : 'text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400'}`}>
              {confirmDelete ? 'Confirm?' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
