'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/lib/toast'

const ALL_FRAMEWORKS = ['All', 'Next.js', 'React', 'Django', 'Laravel', 'FastAPI', 'SvelteKit', 'React Native']
type Sort = 'upvotes' | 'forks' | 'newest'

interface CommunityPack {
  id: string
  title: string
  description: string | null
  slug: string
  frameworkTag: string | null
  languageTag: string | null
  uiLib: string | null
  db: string | null
  upvoteCount: number
  forkCount: number
  createdAt: string
  authorUsername: string
  authorAvatar: string | null
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function CommunityPackCard({ pack, onUpvote, onFork }: {
  pack: CommunityPack
  onUpvote: (id: string) => void
  onFork: (id: string) => void
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--bg-border)]">
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <span className="font-display text-lg leading-none text-[var(--text-primary)]">{pack.upvoteCount}</span>
        <button onClick={() => onUpvote(pack.id)} className="text-sm transition-colors text-[var(--text-muted)] hover:text-[var(--cx-accent)]">▲</button>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-sans font-medium text-[var(--text-primary)]">{pack.title}</h3>
        {pack.description && <p className="mt-1 font-sans text-sm text-[var(--text-secondary)] leading-relaxed">{pack.description}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {pack.frameworkTag && <span className="rounded-full border border-[var(--bg-border)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">{pack.frameworkTag}</span>}
          {pack.languageTag && <span className="rounded-full border border-[var(--bg-border)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">{pack.languageTag}</span>}
          {pack.db && <span className="rounded-full border border-[var(--bg-border)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">{pack.db}</span>}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-[10px] text-[var(--text-muted)]">
            by @{pack.authorUsername} · {timeAgo(pack.createdAt)} · {pack.forkCount} forks
          </p>
          <button
            onClick={() => onFork(pack.id)}
            className="rounded border border-[var(--bg-border)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--cx-accent)] hover:text-[var(--cx-accent)]"
          >
            Fork Pack →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CommunityFeed() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [framework, setFramework] = useState('All')
  const [sort, setSort] = useState<Sort>('upvotes')
  const [packsList, setPacksList] = useState<CommunityPack[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPacks = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ sort })
    if (framework !== 'All') params.set('framework', framework)
    const res = await fetch(`/api/community?${params}`)
    const data = await res.json()
    setPacksList(data.packs || [])
    setLoading(false)
  }, [framework, sort])

  useEffect(() => {
    fetchPacks()
  }, [fetchPacks])

  async function handleUpvote(id: string) {
    if (!user) {
      toast('Please log in to upvote', 'info')
      return
    }
    const res = await fetch(`/api/packs/${id}/upvote`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setPacksList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, upvoteCount: data.count } : p))
      )
    }
  }

  async function handleFork(id: string) {
    if (!user) {
      toast('Please log in to fork packs', 'info')
      return
    }
    const res = await fetch(`/api/packs/${id}/fork`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json()
      toast(data.error || 'Failed to fork', 'error')
      return
    }
    const data = await res.json()
    toast(`Forked "${data.pack.title}" — check your dashboard`, 'success')
    fetchPacks()
  }

  return (
    <div>
      <div className="sticky top-14 z-30 border-b border-[var(--bg-border)] bg-[var(--bg-base)]/95 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {ALL_FRAMEWORKS.map((f) => (
              <button key={f} onClick={() => setFramework(f)}
                className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                  framework === f
                    ? 'border-[var(--cx-accent)] bg-[var(--cx-accent-glow)] text-[var(--cx-accent)]'
                    : 'border-[#242424] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                }`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {(['upvotes', 'forks', 'newest'] as Sort[]).map((s) => (
              <button key={s} onClick={() => setSort(s)}
                className={`px-3 py-1 font-mono text-xs capitalize transition-colors ${
                  sort === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}>
                {s === 'upvotes' ? 'Most Upvoted' : s === 'forks' ? 'Most Forked' : 'Newest'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl space-y-3 pt-6">
        {loading ? (
          <div className="py-16 text-center font-mono text-sm text-[var(--text-muted)]">Loading...</div>
        ) : packsList.length === 0 ? (
          <div className="py-16 text-center font-mono text-sm text-[var(--text-muted)]">
            No community packs yet. Be the first to share!
          </div>
        ) : (
          packsList.map((pack) => (
            <CommunityPackCard key={pack.id} pack={pack} onUpvote={handleUpvote} onFork={handleFork} />
          ))
        )}
      </div>
    </div>
  )
}
