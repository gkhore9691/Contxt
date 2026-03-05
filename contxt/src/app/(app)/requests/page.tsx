'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/lib/toast'

interface PackRequest {
  id: string
  title: string
  description: string | null
  upvoteCount: number
  claimedBy: string | null
  fulfilledPackId: string | null
  createdAt: string
  authorUsername: string
}

export default function RequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<PackRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetch('/api/requests').then(r => r.json()).then(d => { setRequests(d.requests || []); setLoading(false) })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
    if (res.ok) {
      toast('Request submitted!', 'success')
      setTitle('')
      setDescription('')
      setShowForm(false)
      const data = await fetch('/api/requests').then(r => r.json())
      setRequests(data.requests || [])
    } else {
      const data = await res.json()
      toast(data.error || 'Failed to submit', 'error')
    }
  }

  async function handleUpvote(id: string) {
    if (!user) { toast('Please log in to upvote', 'info'); return }
    const res = await fetch(`/api/requests/${id}/upvote`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setRequests(prev => prev.map(r => r.id === id ? { ...r, upvoteCount: data.count } : r))
    }
  }

  async function handleClaim(id: string) {
    if (!user) { toast('Please log in to claim', 'info'); return }
    const res = await fetch(`/api/requests/${id}/claim`, { method: 'POST' })
    if (res.ok) {
      toast('Claimed! Build the pack and share it.', 'success')
      const data = await fetch('/api/requests').then(r => r.json())
      setRequests(data.requests || [])
    } else {
      const d = await res.json()
      toast(d.error || 'Failed to claim', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--text-primary)]">Pack Requests</h1>
          <p className="mt-1 font-sans text-sm text-[var(--text-secondary)]">Request packs you wish existed. Upvote and claim requests.</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)] transition-colors">
            + New Request
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 space-y-4">
          <div>
            <label className="mb-1.5 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">I need a context pack for...</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required minLength={5} placeholder="e.g. Next.js 14 + Drizzle ORM + Neon DB" className="w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] px-3.5 py-2.5 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cx-accent)]/50 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Details (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What specific context would be helpful?" className="w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] px-3.5 py-2.5 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cx-accent)]/50 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-[var(--cx-accent)] px-4 py-2 font-sans text-sm font-medium text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)]">Submit Request</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[var(--bg-border)] px-4 py-2 font-sans text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--text-muted)]">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--text-muted)]">No requests yet. Be the first to request a pack!</p>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="flex gap-4 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button onClick={() => handleUpvote(r.id)} className="font-display text-lg text-[var(--text-primary)] hover:text-[var(--cx-accent)] transition-colors">{r.upvoteCount}</button>
                <span className="font-sans text-[10px] text-[var(--text-muted)]">votes</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-[15px] font-medium text-[var(--text-primary)]">{r.title}</h3>
                {r.description && <p className="mt-1 font-sans text-[13px] text-[var(--text-secondary)]">{r.description}</p>}
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-sans text-[11px] text-[var(--text-muted)]">by @{r.authorUsername}</span>
                  {r.claimedBy ? (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-sans text-[11px] text-emerald-400">Claimed</span>
                  ) : r.fulfilledPackId ? (
                    <span className="rounded-md bg-[var(--cx-accent)]/10 px-2 py-0.5 font-sans text-[11px] text-[var(--cx-accent)]">Fulfilled</span>
                  ) : (
                    <button onClick={() => handleClaim(r.id)} className="rounded-md border border-[var(--bg-border)] px-2 py-0.5 font-sans text-[11px] text-[var(--text-secondary)] hover:border-[var(--cx-accent)] hover:text-[var(--cx-accent)] transition-colors">
                      Claim this
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
