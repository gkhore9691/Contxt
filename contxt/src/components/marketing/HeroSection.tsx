'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const agents = [
  'Claude Code', 'Cursor', 'Windsurf', 'Replit Agent',
  'GitHub Copilot', 'ChatGPT', 'Gemini', 'Cody',
]

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pb-20 pt-28 text-center">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-[var(--cx-accent)]/[0.04] blur-[120px]" />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[var(--cx-accent)]"
      >
        AI Context Management
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-3xl font-display leading-[1.05] tracking-tight text-[var(--text-primary)]"
        style={{ fontSize: 'clamp(40px, 7vw, 76px)' }}
      >
        Load your full project context into{' '}
        <span className="text-[var(--cx-accent)]">any AI agent</span>{' '}
        in 30 seconds
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-5 max-w-lg font-sans text-base leading-relaxed text-[var(--text-secondary)]"
      >
        Stop re-explaining your project every session. Build a structured Context Pack once, copy it into Claude Code, Cursor, or Windsurf instantly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/register"
          className="rounded-lg bg-[var(--cx-accent)] px-6 py-3 font-sans text-sm font-medium text-[var(--bg-base)] transition-all hover:bg-[var(--cx-accent-dim)] hover:shadow-lg hover:shadow-[var(--cx-accent)]/10"
        >
          Start Building — Free
        </Link>
        <Link
          href="/community"
          className="rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] px-6 py-3 font-sans text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          Browse Community Packs
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mt-6 font-sans text-xs text-[var(--text-muted)]"
      >
        Free forever · No credit card · 500+ developers
      </motion.p>

      {/* Agent ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="mt-14 w-full max-w-2xl"
      >
        <p className="mb-3 text-center font-sans text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
          Works with your AI tools
        </p>
        <div className="overflow-hidden">
          <div
            className="flex gap-2.5"
            style={{ animation: 'scroll 22s linear infinite', width: 'max-content' }}
          >
            {[...agents, ...agents].map((agent, i) => (
              <span
                key={i}
                className="flex-shrink-0 rounded-full border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3.5 py-1.5 font-sans text-xs text-[var(--text-muted)]"
              >
                {agent}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
