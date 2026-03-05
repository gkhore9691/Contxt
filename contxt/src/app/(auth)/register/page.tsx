'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await register(email, username, password)
    setLoading(false)
    if (result.error) setError(result.error)
    else router.push('/dashboard')
  }

  const inputCls = "w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3.5 py-2.5 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cx-accent)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--cx-accent)]/20 transition-all"

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--cx-accent)] font-mono text-xs font-bold text-[var(--bg-base)]">C</span>
            <span className="font-sans text-base font-semibold text-[var(--text-primary)]">Contxt</span>
          </Link>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Create your account</h1>
          <p className="mt-1.5 font-sans text-sm text-[var(--text-secondary)]">Free forever. Build your first pack in 5 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 font-sans text-[13px] text-red-400">{error}</div>
          )}

          <div>
            <label className="mb-1.5 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="you@example.com" />
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputCls} placeholder="alexdev" />
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-[13px] font-medium text-[var(--text-secondary)]">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className={inputCls} placeholder="6+ characters" />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-[var(--cx-accent)] py-2.5 font-sans text-sm font-medium text-[var(--bg-base)] transition-colors hover:bg-[var(--cx-accent-dim)] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-[13px] text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--cx-accent)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
