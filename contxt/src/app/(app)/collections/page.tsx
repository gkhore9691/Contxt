'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/lib/toast'
import Link from 'next/link'

interface Collection {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  followCount: number
  createdAt: string
  authorUsername: string
  itemCount: number
}

export default function CollectionsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetch('/api/collections').then(r => r.json()).then(d => { setCollections(d.collections || []); setLoading(false) })
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
    if (res.ok) {
      toast('Collection created!', 'success')
      setTitle('')
      setDescription('')
      setShowForm(false)
      const data = await fetch('/api/collections').then(r => r.json())
      setCollections(data.collections || [])
    } else {
      const d = await res.json()
      toast(d.error || 'Failed to create', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--text-primary)]">Collections</h1>
          <p className="mt-1 font-sans text-sm text-[var(--text-secondary)]">Curated lists of community packs.</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)] transition-colors">
            + New Collection
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 space-y-4">
          <div>
            <label className="mb-1.5 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Collection title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required minLength={3} placeholder='e.g. "Best Next.js 14 Packs 2026"' className="w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] px-3.5 py-2.5 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cx-accent)]/50 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="What makes this collection useful?" className="w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] px-3.5 py-2.5 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cx-accent)]/50 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-sm font-medium text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)]">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[var(--bg-border)] px-4 py-2 font-sans text-sm text-[var(--text-secondary)]">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--text-muted)]">Loading...</p>
      ) : collections.length === 0 ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--text-muted)]">No collections yet. Create one to curate your favorite packs!</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {collections.map(c => (
            <Link key={c.id} href={`/collections/${c.id}`} className="group rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--cx-accent)]/30 hover:bg-[var(--bg-elevated)]">
              <h3 className="font-sans text-[15px] font-medium text-[var(--text-primary)] group-hover:text-[var(--cx-accent)] transition-colors">{c.title}</h3>
              {c.description && <p className="mt-1 font-sans text-[13px] text-[var(--text-muted)] line-clamp-2">{c.description}</p>}
              <div className="mt-3 flex items-center gap-3 font-sans text-[11px] text-[var(--text-muted)]">
                <span>{c.itemCount} packs</span>
                <span>by @{c.authorUsername}</span>
                {c.followCount > 0 && <span>{c.followCount} followers</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
