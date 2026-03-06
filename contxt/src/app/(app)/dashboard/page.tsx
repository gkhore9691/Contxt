'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import PackCard from '@/components/app/PackCard'
import { calculateHealthScore } from '@/lib/pack/health-score'
import { Package, ArrowUpRight, GitFork, Copy, TrendingUp } from 'lucide-react'

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

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5" style={{ borderLeftWidth: '2px', borderLeftColor: 'var(--bg-border)' }}>
      <div className="h-4 w-3/4 rounded bg-[var(--bg-elevated)] animate-pulse" />
      <div className="mt-3 h-3 w-full rounded bg-[var(--bg-elevated)] animate-pulse" />
      <div className="mt-1.5 h-3 w-2/3 rounded bg-[var(--bg-elevated)] animate-pulse" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-14 rounded-md bg-[var(--bg-elevated)] animate-pulse" />
        <div className="h-5 w-14 rounded-md bg-[var(--bg-elevated)] animate-pulse" />
      </div>
      <div className="mt-4 border-t border-[var(--bg-border)] pt-3">
        <div className="h-3 w-1/3 rounded bg-[var(--bg-elevated)] animate-pulse" />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Package; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--bg-border)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-base)] p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon size={14} className={accent ? 'text-[var(--cx-accent)]' : 'text-[var(--text-muted)]'} />
      </div>
      <div className="font-display text-2xl text-[var(--text-primary)]">{value}</div>
      <div className="mt-0.5 font-sans text-[11px] text-[var(--text-muted)]">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [packsList, setPacksList] = useState<DBPack[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissWelcome, setDismissWelcome] = useState(false)

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDismissWelcome(localStorage.getItem('bp-welcome-dismissed') === '1')
    }
  }, [])

  if (authLoading || !user) return null

  const totalUpvotes = packsList.reduce((s, p) => s + p.upvoteCount, 0)
  const totalForks = packsList.reduce((s, p) => s + p.forkCount, 0)
  const totalCopies = packsList.reduce((s, p) => s + (p.copyCount || 0), 0)

  const avgScore = packsList.length > 0
    ? Math.round(packsList.reduce((s, p) => s + calculateHealthScore(p).total, 0) / packsList.length)
    : 0

  const isFirstTime = packsList.length === 0 && !loading

  function handleDismissWelcome() {
    setDismissWelcome(true)
    localStorage.setItem('bp-welcome-dismissed', '1')
  }

  return (
    <div>
      {/* Welcome banner for first-time or new users */}
      {!dismissWelcome && packsList.length <= 1 && !loading && (
        <div className="mb-6 relative rounded-2xl border border-[var(--cx-accent)]/20 bg-gradient-to-r from-[var(--cx-accent)]/[0.06] to-transparent p-6">
          <button
            onClick={handleDismissWelcome}
            className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <h2 className="font-sans text-lg font-semibold text-[var(--text-primary)]">
            Welcome to Brain Pack, {user.username}!
          </h2>
          <p className="mt-1 font-sans text-sm text-[var(--text-secondary)] max-w-lg">
            Build your first context pack in 5 minutes. Your AI agents will instantly understand your entire project.
          </p>
          <Link
            href="/packs/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--cx-accent)] px-5 py-2.5 font-sans text-sm font-medium text-[var(--bg-base)] transition-all hover:shadow-lg hover:shadow-[var(--cx-accent)]/20 active:scale-[0.98]"
          >
            Build your first pack
            <span>&rarr;</span>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Dashboard</h1>
          <p className="mt-0.5 font-sans text-sm text-[var(--text-muted)]">{packsList.length} pack{packsList.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/packs/new"
          className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--bg-base)] transition-all hover:bg-[var(--cx-accent-dim)] active:scale-[0.98]"
        >
          + New Pack
        </Link>
      </div>

      {/* Stats */}
      {!isFirstTime && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 mb-8">
          <StatCard icon={Package} label="Packs" value={packsList.length} />
          <StatCard icon={ArrowUpRight} label="Upvotes" value={totalUpvotes} />
          <StatCard icon={GitFork} label="Forks" value={totalForks} />
          <StatCard icon={Copy} label="Copies" value={totalCopies} />
          <StatCard icon={TrendingUp} label="Avg. Health" value={avgScore} accent />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : isFirstTime ? (
        /* Onboarding checklist */
        <div className="mx-auto max-w-md py-12">
          <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cx-accent)]/10">
              <Package size={24} className="text-[var(--cx-accent)]" />
            </div>
            <h2 className="font-sans text-lg font-semibold text-[var(--text-primary)]">Get started in 3 steps</h2>
            <p className="mt-1 font-sans text-sm text-[var(--text-secondary)]">Your first pack takes about 5 minutes.</p>

            <div className="mt-6 space-y-3 text-left">
              {[
                { step: 1, text: 'Choose a template or start from scratch', done: false },
                { step: 2, text: 'Fill in your project context (stack, rules, gotchas)', done: false },
                { step: 3, text: 'Copy to your AI agent and start coding', done: false },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-base)] px-4 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-elevated)] font-mono text-[10px] text-[var(--text-muted)]">
                    {s.step}
                  </span>
                  <span className="font-sans text-[13px] text-[var(--text-secondary)]">{s.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/packs/new"
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[var(--cx-accent)] px-6 py-2.5 font-sans text-sm font-semibold text-[var(--bg-base)] transition-all hover:shadow-lg hover:shadow-[var(--cx-accent)]/20 active:scale-[0.98]"
            >
              Let&apos;s go
              <span>&rarr;</span>
            </Link>
          </div>
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
