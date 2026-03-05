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
  upvoteCount: number
  forkCount: number
  updatedAt: string
}

export default function PacksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [packsList, setPacksList] = useState<DBPack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/packs')
      .then((r) => r.json())
      .then((data) => {
        setPacksList(data.packs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  if (authLoading || !user) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-[var(--text-primary)]">MY PACKS</h1>
        <Link
          href="/packs/new"
          className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)]"
        >
          + New Pack
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <p className="font-mono text-sm text-[var(--text-muted)]">Loading packs...</p>
        </div>
      ) : packsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)] mb-4">( NO PACKS YET )</p>
          <p className="font-sans text-base text-[var(--text-secondary)] mb-6">
            Build your first Context Pack and load your full project into any AI in 30 seconds.
          </p>
          <Link
            href="/packs/new"
            className="rounded-lg bg-[var(--cx-accent)] px-6 py-3 font-sans text-[13px] font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)]"
          >
            Build Your First Pack
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
                isPublic: pack.isPublic,
                upvotes: pack.upvoteCount,
                forks: pack.forkCount,
                updatedAt: pack.updatedAt,
                authorId: '',
                authorName: user.username,
                authorHandle: user.username,
                createdAt: '',
                db: undefined,
                hosting: undefined,
                architecture: '',
                conventions: '',
                aiRules: '',
                gotchas: '',
              }}
              onDelete={() => {
                setPacksList((prev) => prev.filter((p) => p.id !== pack.id))
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
