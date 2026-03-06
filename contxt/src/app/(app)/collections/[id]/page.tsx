'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/lib/toast'

interface CollectionDetail {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  followCount: number
  createdAt: string
  userId: string
  authorUsername: string
}

interface CollectionItem {
  id: string
  packId: string
  curatorNote: string | null
  sortOrder: number
  packTitle: string
  packDescription: string | null
  packFramework: string | null
  packLanguage: string | null
  packUpvotes: number
  authorUsername: string
}

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const { toast } = useToast()
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/collections/${id}`)
      .then(r => r.json())
      .then(data => {
        setCollection(data.collection || null)
        setItems(data.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const isOwner = user?.id === collection?.userId

  async function handleDelete() {
    const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast('Collection deleted', 'success')
      window.location.href = '/collections'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-24"><p className="font-sans text-sm text-[var(--text-muted)]">Loading...</p></div>
  }

  if (!collection) {
    return <div className="flex items-center justify-center py-24"><p className="font-sans text-sm text-[var(--text-muted)]">Collection not found</p></div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/collections" className="mb-6 inline-flex items-center gap-2 font-sans text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
        ← Back to Collections
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">{collection.title}</h1>
          {collection.description && (
            <p className="mt-1.5 font-sans text-sm text-[var(--text-secondary)]">{collection.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 font-sans text-[11px] text-[var(--text-muted)]">
            <span>by @{collection.authorUsername}</span>
            <span>{items.length} packs</span>
            {collection.followCount > 0 && <span>{collection.followCount} followers</span>}
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="rounded-lg border border-[var(--bg-border)] px-3 py-1.5 font-sans text-[12px] text-[var(--text-muted)] hover:border-red-500/30 hover:text-red-400 transition-colors"
          >
            Delete Collection
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="font-sans text-sm text-[var(--text-muted)]">This collection is empty.</p>
          {isOwner && (
            <p className="mt-2 font-sans text-[13px] text-[var(--text-secondary)]">
              Add packs from the <Link href="/community" className="text-[var(--cx-accent)] hover:underline">community feed</Link>.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href={`/packs/${item.packId}`}
              className="group flex gap-4 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--cx-accent)]/25 hover:bg-[var(--bg-elevated)]"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] font-mono text-xs text-[var(--text-muted)]">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-[15px] font-medium text-[var(--text-primary)] group-hover:text-[var(--cx-accent)] transition-colors">
                  {item.packTitle}
                </h3>
                {item.packDescription && (
                  <p className="mt-1 font-sans text-[13px] text-[var(--text-muted)] line-clamp-2">{item.packDescription}</p>
                )}
                {item.curatorNote && (
                  <p className="mt-2 font-sans text-[12px] italic text-[var(--cx-accent)]/80">
                    &ldquo;{item.curatorNote}&rdquo;
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {item.packFramework && <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[10px] text-[var(--text-muted)]">{item.packFramework}</span>}
                  {item.packLanguage && <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[10px] text-[var(--text-muted)]">{item.packLanguage}</span>}
                  <span className="ml-auto font-sans text-[10px] text-[var(--text-muted)]">{item.packUpvotes} upvotes · by @{item.authorUsername}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
