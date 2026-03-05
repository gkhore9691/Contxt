'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/lib/toast'
import { generateOutput } from '@/lib/pack/generator'

interface QuickPack {
  id: string
  title: string
  frameworkTag: string | null
  languageTag: string | null
  framework?: string
  language?: string
  description?: string | null
  uiLib?: string | null
  db?: string | null
  hosting?: string | null
  architecture?: string | null
  conventions?: string | null
  aiRules?: string | null
  gotchas?: string | null
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [packs, setPacks] = useState<QuickPack[]>([])
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // Keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Fetch packs when opened
  useEffect(() => {
    if (!open || !user) return
    fetch('/api/packs')
      .then((r) => r.json())
      .then((data) => setPacks(data.packs || []))
      .catch(() => {})
    setQuery('')
    setSelected(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [open, user])

  const filtered = packs.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  )

  const commands = [
    ...filtered.map((p) => ({ type: 'pack' as const, pack: p, label: p.title, sub: [p.frameworkTag, p.languageTag].filter(Boolean).join(' · ') })),
    { type: 'action' as const, label: 'New Pack', sub: 'Create a new context pack', action: () => router.push('/packs/new') },
    { type: 'action' as const, label: 'Community', sub: 'Browse community packs', action: () => router.push('/community') },
    { type: 'action' as const, label: 'Dashboard', sub: 'Go to dashboard', action: () => router.push('/dashboard') },
  ]

  const handleSelect = useCallback(async (idx: number) => {
    const item = commands[idx]
    if (!item) return
    setOpen(false)

    if (item.type === 'action') {
      item.action()
      return
    }

    // Copy pack to clipboard
    const pack = item.pack
    try {
      const fullPack = await fetch(`/api/packs/${pack.id}`).then(r => r.json())
      const p = fullPack.pack
      const output = generateOutput('CLAUDE.md', {
        title: p.title,
        description: p.description,
        frameworkTag: p.frameworkTag,
        languageTag: p.languageTag,
        uiLib: p.uiLib,
        db: p.db,
        hosting: p.hosting,
        architecture: p.architecture,
        conventions: p.conventions,
        aiRules: p.aiRules,
        gotchas: p.gotchas,
      })
      await navigator.clipboard.writeText(output)
      fetch(`/api/packs/${pack.id}/copy`, { method: 'POST' })
      toast(`Copied "${pack.title}" to clipboard`, 'success')
    } catch {
      toast('Failed to copy', 'error')
    }
  }, [commands, toast])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, commands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(selected)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="w-full max-w-lg rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[var(--bg-border)] px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--text-muted)]">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Search packs, or type a command..."
            className="flex-1 bg-transparent font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <kbd className="rounded border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-1.5">
          {commands.length === 0 ? (
            <p className="px-3 py-6 text-center font-sans text-sm text-[var(--text-muted)]">No results</p>
          ) : (
            commands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                onMouseEnter={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  i === selected ? 'bg-[var(--bg-elevated)]' : ''
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-md text-xs flex-shrink-0 ${
                  cmd.type === 'pack'
                    ? 'bg-[var(--cx-accent)]/10 text-[var(--cx-accent)]'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                }`}>
                  {cmd.type === 'pack' ? '◈' : '→'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-sm text-[var(--text-primary)] truncate">{cmd.label}</div>
                  {cmd.sub && <div className="font-sans text-[11px] text-[var(--text-muted)] truncate">{cmd.sub}</div>}
                </div>
                {cmd.type === 'pack' && (
                  <span className="font-sans text-[10px] text-[var(--text-muted)]">Copy</span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="border-t border-[var(--bg-border)] px-4 py-2 flex items-center gap-4">
          <span className="font-sans text-[10px] text-[var(--text-muted)]">↑↓ navigate</span>
          <span className="font-sans text-[10px] text-[var(--text-muted)]">↵ select</span>
          <span className="font-sans text-[10px] text-[var(--text-muted)]">esc close</span>
        </div>
      </div>
    </div>
  )
}
