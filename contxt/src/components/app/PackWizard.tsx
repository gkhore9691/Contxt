'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  WIZARD_STEPS,
  FRAMEWORKS,
  LANGUAGES,
  UI_LIBS,
  DATABASES,
  HOSTING,
} from '@/types'
import OutputModal from './OutputModal'
import type { PackTemplate } from '@/lib/pack/templates'

interface PackFormData {
  title: string
  description: string
  isPublic: boolean
  frameworkTag: string
  languageTag: string
  uiLib: string
  db: string
  hosting: string
  architecture: string
  conventions: string
  aiRules: string
  gotchas: string
}

const INITIAL_FORM: PackFormData = {
  title: '',
  description: '',
  isPublic: false,
  frameworkTag: '',
  languageTag: '',
  uiLib: '',
  db: '',
  hosting: '',
  architecture: '',
  conventions: '',
  aiRules: `Always use TypeScript strict mode
Never use class components
Always use Zod for validation
Prefer server components unless interactivity required`,
  gotchas: '',
}

function TagPicker({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? '' : opt)}
          className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
            value === opt
              ? 'border-[var(--cx-accent)] bg-[var(--cx-accent-glow)] text-[var(--cx-accent)]'
              : 'border-[#242424] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) {
  const cls = 'w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] p-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cx-accent)]/60 focus:outline-none transition-colors'
  return (
    <div>
      <label className="mb-1 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={5} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  )
}

interface CreatedPack {
  id: string
  title: string
  description: string | null
  frameworkTag: string | null
  languageTag: string | null
  uiLib: string | null
  db: string | null
  hosting: string | null
  architecture: string | null
  conventions: string | null
  aiRules: string | null
  gotchas: string | null
}

export default function PackWizard({ editPack, template }: { editPack?: CreatedPack; template?: PackTemplate }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [savedPack, setSavedPack] = useState<CreatedPack | null>(editPack || null)

  const [form, setForm] = useState<PackFormData>(
    editPack
      ? {
          title: editPack.title,
          description: editPack.description || '',
          isPublic: false,
          frameworkTag: editPack.frameworkTag || '',
          languageTag: editPack.languageTag || '',
          uiLib: editPack.uiLib || '',
          db: editPack.db || '',
          hosting: editPack.hosting || '',
          architecture: editPack.architecture || '',
          conventions: editPack.conventions || '',
          aiRules: editPack.aiRules || '',
          gotchas: editPack.gotchas || '',
        }
      : template
        ? {
            title: template.name,
            description: template.description,
            isPublic: false,
            frameworkTag: template.framework,
            languageTag: template.language,
            uiLib: template.uiLib,
            db: template.db,
            hosting: template.hosting,
            architecture: template.architecture,
            conventions: template.conventions,
            aiRules: template.aiRules,
            gotchas: template.gotchas,
          }
        : INITIAL_FORM
  )

  function update<K extends keyof PackFormData>(key: K, value: PackFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError('Title is required')
      setStep(1)
      return
    }
    setSaving(true)
    setError('')

    const url = editPack ? `/api/packs/${editPack.id}` : '/api/packs'
    const method = editPack ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        isPublic: form.isPublic,
        frameworkTag: form.frameworkTag,
        languageTag: form.languageTag,
        uiLib: form.uiLib,
        db: form.db,
        hosting: form.hosting,
        architecture: form.architecture,
        conventions: form.conventions,
        aiRules: form.aiRules,
        gotchas: form.gotchas,
      }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error || 'Failed to save')
      return
    }

    setSavedPack(data.pack)
    setShowOutput(true)
  }

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center gap-0">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.number} className="flex flex-1 items-center">
                <button onClick={() => s.number < step && setStep(s.number)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className={`h-8 w-8 flex items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                    s.number < step ? 'bg-[var(--cx-accent-glow)] text-[var(--cx-accent)] border border-[var(--cx-accent)]'
                      : s.number === step ? 'bg-[var(--cx-accent)] text-[var(--bg-base)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}>
                    {s.number < step ? '✓' : s.number}
                  </div>
                  <span className="hidden sm:block font-mono text-[9px] text-[var(--text-muted)] uppercase">{s.title}</span>
                </button>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-2 transition-colors ${s.number < step ? 'bg-[var(--cx-accent)]/40' : 'bg-[#242424]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-8">
          <p className="mb-1 font-mono text-[11px] text-[var(--cx-accent)] uppercase tracking-wider">Step {step} of 6</p>
          <h2 className="font-display text-2xl text-[var(--text-primary)] mb-6">{WIZARD_STEPS[step - 1].description}</h2>

          {step === 1 && (
            <div className="space-y-5">
              <InputField label="Project Name" value={form.title} onChange={(v) => update('title', v)} placeholder="e.g. My SaaS App" />
              <InputField label="One-Liner Description" value={form.description} onChange={(v) => update('description', v)} placeholder="e.g. A SaaS for managing AI context packs" />
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => update('isPublic', !form.isPublic)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.isPublic ? 'bg-[var(--cx-accent)]' : 'bg-[var(--bg-elevated)]'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${form.isPublic ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
                <span className="font-mono text-xs text-[var(--text-secondary)]">Make public in community library</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div><label className="mb-2 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Framework</label><TagPicker options={FRAMEWORKS} value={form.frameworkTag} onChange={(v) => update('frameworkTag', v)} /></div>
              <div><label className="mb-2 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Language</label><TagPicker options={LANGUAGES} value={form.languageTag} onChange={(v) => update('languageTag', v)} /></div>
              <div><label className="mb-2 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">UI Library</label><TagPicker options={UI_LIBS} value={form.uiLib} onChange={(v) => update('uiLib', v)} /></div>
              <div><label className="mb-2 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Database</label><TagPicker options={DATABASES} value={form.db} onChange={(v) => update('db', v)} /></div>
              <div><label className="mb-2 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Hosting</label><TagPicker options={HOSTING} value={form.hosting} onChange={(v) => update('hosting', v)} /></div>
            </div>
          )}

          {step === 3 && <InputField label="Architecture & Structure" value={form.architecture} onChange={(v) => update('architecture', v)} placeholder="Describe your folder structure, key modules, and data flow..." multiline />}
          {step === 4 && <InputField label="Coding Conventions" value={form.conventions} onChange={(v) => update('conventions', v)} placeholder="Describe naming conventions, component patterns, linting, commit style..." multiline />}
          {step === 5 && <InputField label="AI Agent Rules" value={form.aiRules} onChange={(v) => update('aiRules', v)} placeholder="What should the AI always/never do?" multiline />}
          {step === 6 && <InputField label="Known Gotchas & Quirks" value={form.gotchas} onChange={(v) => update('gotchas', v)} placeholder="Document known issues, legacy decisions, or surprising behaviour..." multiline />}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard')}
            className="rounded-lg border border-[var(--bg-border)] px-5 py-2.5 font-mono text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]">
            ← {step > 1 ? 'Back' : 'Cancel'}
          </button>
          <button
            onClick={() => step < 6 ? setStep(step + 1) : handleSave()}
            disabled={saving}
            className="rounded-lg bg-[var(--cx-accent)] px-6 py-2.5 font-sans text-sm font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)] disabled:opacity-50">
            {saving ? 'Saving...' : step < 6 ? 'Continue →' : (editPack ? 'Save Changes →' : 'Generate Pack →')}
          </button>
        </div>
      </div>

      {showOutput && savedPack && (
        <OutputModal
          pack={{
            id: savedPack.id,
            title: savedPack.title,
            description: savedPack.description || '',
            framework: savedPack.frameworkTag || '',
            language: savedPack.languageTag || '',
            uiLib: savedPack.uiLib || undefined,
            db: savedPack.db || undefined,
            hosting: savedPack.hosting || undefined,
            architecture: savedPack.architecture || '',
            conventions: savedPack.conventions || '',
            aiRules: savedPack.aiRules || '',
            gotchas: savedPack.gotchas || '',
            isPublic: false,
            upvotes: 0,
            forks: 0,
            authorId: '',
            authorName: '',
            authorHandle: '',
            createdAt: '',
            updatedAt: '',
          }}
          onClose={() => {
            setShowOutput(false)
            router.push('/dashboard')
          }}
        />
      )}
    </>
  )
}
