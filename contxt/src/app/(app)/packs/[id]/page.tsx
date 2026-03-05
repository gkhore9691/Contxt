'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/lib/toast'
import OutputModal from '@/components/app/OutputModal'
import PackWizard from '@/components/app/PackWizard'
import { HealthScoreDetail } from '@/components/app/HealthScore'

interface PackDetail {
  id: string
  userId: string
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
  copyCount?: number
  authorUsername: string
  authorAvatar: string | null
  updatedAt?: string
}

interface Version {
  id: string
  versionNumber: number
  changeNote: string | null
  createdAt: string
  snapshot: Record<string, unknown>
}

const SECTIONS = [
  { key: 'description', label: 'Description' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'conventions', label: 'Conventions' },
  { key: 'aiRules', label: 'AI Rules' },
  { key: 'gotchas', label: 'Gotchas' },
] as const

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

function freshnessColor(dateStr?: string) {
  if (!dateStr) return 'text-[var(--text-muted)]'
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days <= 7) return 'text-emerald-400'
  if (days <= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export default function PackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const { toast } = useToast()
  const [pack, setPack] = useState<PackDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOutput, setShowOutput] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'detail' | 'history'>('detail')
  const [versions, setVersions] = useState<Version[]>([])

  const fetchPack = useCallback(async () => {
    const res = await fetch(`/api/packs/${id}`)
    const data = await res.json()
    setPack(data.pack || null)
    setLoading(false)
  }, [id])

  useEffect(() => { fetchPack() }, [fetchPack])

  const isOwner = user?.id === pack?.userId

  // Quick edit
  async function handleQuickSave() {
    if (!editingField || !pack) return
    setSaving(true)
    const res = await fetch(`/api/packs/${id}/quick-edit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: editingField, value: editValue }),
    })
    if (res.ok) {
      const data = await res.json()
      setPack(data.pack)
      toast('Saved', 'success')
    } else {
      toast('Failed to save', 'error')
    }
    setSaving(false)
    setEditingField(null)
  }

  // Save version snapshot
  async function handleSaveVersion() {
    const res = await fetch(`/api/packs/${id}/versions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    if (res.ok) {
      toast('Version saved', 'success')
      fetchVersions()
    }
  }

  // Load versions
  async function fetchVersions() {
    const res = await fetch(`/api/packs/${id}/versions`)
    if (res.ok) { const d = await res.json(); setVersions(d.versions || []) }
  }

  useEffect(() => { if (tab === 'history' && isOwner) fetchVersions() }, [tab, isOwner, id])

  if (loading) return <div className="flex items-center justify-center py-24"><p className="font-sans text-sm text-[var(--text-muted)]">Loading...</p></div>
  if (!pack) return <div className="flex items-center justify-center py-24"><p className="font-sans text-sm text-[var(--text-muted)]">Pack not found</p></div>
  if (editing && isOwner) return <PackWizard editPack={pack} />

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 font-sans text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
          ← Back
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl text-[var(--text-primary)]">{pack.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {pack.frameworkTag && <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[11px] text-[var(--text-muted)]">{pack.frameworkTag}</span>}
              {pack.languageTag && <span className="rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 font-sans text-[11px] text-[var(--text-muted)]">{pack.languageTag}</span>}
              <span className={`rounded-md px-2 py-0.5 font-sans text-[11px] ${pack.isPublic ? 'bg-[var(--cx-accent)]/10 text-[var(--cx-accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
                {pack.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3 font-sans text-[11px] text-[var(--text-muted)]">
              <span>by @{pack.authorUsername}</span>
              <span>{pack.upvoteCount} upvotes</span>
              <span>{pack.forkCount} forks</span>
              {pack.copyCount !== undefined && pack.copyCount > 0 && <span>Copied {pack.copyCount} times</span>}
              {pack.updatedAt && <span className={freshnessColor(pack.updatedAt)}>Updated {timeAgo(pack.updatedAt)}</span>}
            </div>
          </div>
          <button
            onClick={() => setShowOutput(true)}
            className="flex-shrink-0 rounded-lg bg-[var(--cx-accent)] px-5 py-2.5 font-sans text-sm font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)]"
          >
            Generate Output
          </button>
        </div>

        {/* Tabs */}
        {isOwner && (
          <div className="flex gap-1 mb-6 border-b border-[var(--bg-border)]">
            <button onClick={() => setTab('detail')} className={`px-4 py-2.5 font-sans text-[13px] transition-colors ${tab === 'detail' ? 'border-b-2 border-[var(--cx-accent)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>Details</button>
            <button onClick={() => setTab('history')} className={`px-4 py-2.5 font-sans text-[13px] transition-colors ${tab === 'history' ? 'border-b-2 border-[var(--cx-accent)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>Version History</button>
          </div>
        )}

        {tab === 'detail' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* Sections */}
            <div className="space-y-4">
              {SECTIONS.map(({ key, label }) => {
                const value = pack[key as keyof PackDetail] as string | null
                const isEditing = editingField === key

                return (
                  <div key={key} className="group rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-sans text-[11px] font-medium uppercase tracking-wider text-[var(--cx-accent)]">{label}</p>
                      {isOwner && !isEditing && (
                        <button
                          onClick={() => { setEditingField(key); setEditValue(value || '') }}
                          className="opacity-0 group-hover:opacity-100 font-sans text-[11px] text-[var(--text-muted)] hover:text-[var(--cx-accent)] transition-all"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div>
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={5}
                          className="w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] px-3 py-2.5 font-sans text-sm text-[var(--text-primary)] focus:border-[var(--cx-accent)]/50 focus:outline-none"
                          autoFocus
                        />
                        <div className="mt-2 flex gap-2">
                          <button onClick={handleQuickSave} disabled={saving} className="rounded-lg bg-[var(--cx-accent)] px-3 py-1.5 font-sans text-[12px] font-medium text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)] disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                          <button onClick={() => setEditingField(null)} className="rounded-lg border border-[var(--bg-border)] px-3 py-1.5 font-sans text-[12px] text-[var(--text-secondary)]">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-sans text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">
                        {value || <span className="italic text-[var(--text-muted)]">Not specified — click Edit to add.</span>}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Sidebar: Health Score + Actions */}
            <div className="space-y-4">
              <HealthScoreDetail pack={pack} />

              {isOwner && (
                <div className="space-y-2">
                  <button onClick={() => setEditing(true)} className="w-full rounded-lg border border-[var(--bg-border)] py-2.5 font-sans text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors">Full Editor</button>
                  <button onClick={handleSaveVersion} className="w-full rounded-lg border border-[var(--bg-border)] py-2.5 font-sans text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors">Save Version Snapshot</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Version History */
          <div className="space-y-3">
            {versions.length === 0 ? (
              <p className="py-12 text-center font-sans text-sm text-[var(--text-muted)]">No versions saved yet. Click "Save Version Snapshot" on the Details tab.</p>
            ) : versions.map(v => (
              <div key={v.id} className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">v{v.versionNumber}</span>
                    <span className="ml-3 font-sans text-[11px] text-[var(--text-muted)]">{new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={async () => {
                      const snap = v.snapshot as Record<string, string>
                      await fetch(`/api/packs/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(snap),
                      })
                      toast('Restored to v' + v.versionNumber, 'success')
                      fetchPack()
                    }}
                    className="rounded-lg border border-[var(--bg-border)] px-3 py-1.5 font-sans text-[12px] text-[var(--text-secondary)] hover:border-[var(--cx-accent)] hover:text-[var(--cx-accent)] transition-colors"
                  >
                    Restore
                  </button>
                </div>
                {v.changeNote && <p className="mt-1 font-sans text-[12px] text-[var(--text-muted)]">{v.changeNote}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {showOutput && (
        <OutputModal
          pack={{
            id: pack.id, title: pack.title, description: pack.description || '',
            framework: pack.frameworkTag || '', language: pack.languageTag || '',
            uiLib: pack.uiLib || undefined, db: pack.db || undefined, hosting: pack.hosting || undefined,
            architecture: pack.architecture || '', conventions: pack.conventions || '',
            aiRules: pack.aiRules || '', gotchas: pack.gotchas || '',
            isPublic: pack.isPublic, upvotes: pack.upvoteCount, forks: pack.forkCount,
            authorId: pack.userId, authorName: pack.authorUsername, authorHandle: pack.authorUsername,
            createdAt: '', updatedAt: '',
          }}
          onClose={() => setShowOutput(false)}
        />
      )}
    </>
  )
}
