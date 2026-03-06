'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import PackCard from '@/components/app/PackCard'

interface DBPack {
  id: string
  title: string
  description: string | null
  slug: string
  isPublic: boolean
  frameworkTag: string | null
  languageTag: string | null
  uiLib: string | null
  db: string | null
  hosting: string | null
  architecture: string | null
  conventions: string | null
  aiRules: string | null
  gotchas: string | null
  upvoteCount: number
  forkCount: number
  copyCount: number
  updatedAt: string
}

export default function PacksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [packsList, setPacksList] = useState<DBPack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/packs')
      .then((r) => r.json())
      .then((data) => { setPacksList(data.packs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (authLoading || !user) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">My Packs</h1>
          <p className="mt-0.5 font-sans text-sm text-[var(--text-muted)]">
            {packsList.length} pack{packsList.length !== 1 ? 's' : ''}
            {user.plan === 'free' && ` · ${Math.max(0, 3 - packsList.length)} remaining on free plan`}
          </p>
        </div>
        <Link
          href="/packs/new"
          className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--bg-base)] transition-all hover:bg-[var(--cx-accent-dim)] active:scale-[0.98]"
        >
          + New Pack
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5" style={{ borderLeftWidth: '2px', borderLeftColor: 'var(--bg-border)' }}>
              <div className="h-4 w-3/4 rounded bg-[var(--bg-elevated)] animate-pulse" />
              <div className="mt-3 h-3 w-full rounded bg-[var(--bg-elevated)] animate-pulse" />
              <div className="mt-4 flex gap-2"><div className="h-5 w-14 rounded-md bg-[var(--bg-elevated)] animate-pulse" /></div>
              <div className="mt-4 border-t border-[var(--bg-border)] pt-3"><div className="h-3 w-1/3 rounded bg-[var(--bg-elevated)] animate-pulse" /></div>
            </div>
          ))}
        </div>
      ) : packsList.length === 0 ? (
        <div className="mx-auto max-w-sm py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cx-accent)]/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--cx-accent)]"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <h2 className="font-sans text-base font-semibold text-[var(--text-primary)]">No packs yet</h2>
          <p className="mt-1 font-sans text-sm text-[var(--text-secondary)]">
            Create your first context pack to get started.
          </p>
          <Link
            href="/packs/new"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[var(--cx-accent)] px-5 py-2.5 font-sans text-sm font-medium text-[var(--bg-base)] transition-all hover:shadow-lg hover:shadow-[var(--cx-accent)]/20 active:scale-[0.98]"
          >
            Create your first pack <span>&rarr;</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packsList.map((pack) => (
            <PackCard
              key={pack.id}
              pack={{
                id: pack.id,
                title: pack.title,
                description: pack.description || '',
                framework: pack.frameworkTag || '',
                language: pack.languageTag || '',
                uiLib: pack.uiLib || undefined,
                db: pack.db || undefined,
                hosting: pack.hosting || undefined,
                architecture: pack.architecture || '',
                conventions: pack.conventions || '',
                aiRules: pack.aiRules || '',
                gotchas: pack.gotchas || '',
                isPublic: pack.isPublic,
                upvotes: pack.upvoteCount,
                forks: pack.forkCount,
                updatedAt: pack.updatedAt,
                authorId: '', authorName: user.username, authorHandle: user.username, createdAt: '',
              }}
              onDelete={() => setPacksList((prev) => prev.filter((p) => p.id !== pack.id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
