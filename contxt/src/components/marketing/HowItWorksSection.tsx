'use client'

import { motion } from 'framer-motion'

function StepMockup1() {
  return (
    <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-base)] p-3 mb-4">
      <div className="space-y-2">
        {[
          { label: 'Stack', val: 'Next.js, TypeScript, Tailwind', filled: true },
          { label: 'Conventions', val: 'camelCase, App Router', filled: true },
          { label: 'AI Rules', val: '', filled: false, active: true },
        ].map((f) => (
          <div key={f.label} className={`rounded-lg px-2.5 py-2 ${f.active ? 'border border-[var(--cx-accent)]/40 bg-[var(--bg-elevated)]' : 'bg-[var(--bg-elevated)]/50'}`}>
            <div className="font-sans text-[8px] text-[var(--text-muted)] uppercase tracking-wider">{f.label}</div>
            {f.filled ? (
              <div className="mt-0.5 font-sans text-[10px] text-[var(--text-primary)]">{f.val}</div>
            ) : (
              <div className="mt-0.5 h-3 w-16 rounded bg-[var(--bg-border)] animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function StepMockup2() {
  return (
    <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-base)] p-3 mb-4">
      <div className="flex gap-1 mb-2">
        {['CLAUDE.md', '.cursorrules', 'MD'].map((t, i) => (
          <span key={t} className={`rounded px-1.5 py-0.5 font-mono text-[8px] ${i === 0 ? 'bg-[var(--cx-accent)]/15 text-[var(--cx-accent)]' : 'text-[var(--text-muted)]'}`}>{t}</span>
        ))}
      </div>
      <div className="space-y-1 mb-2">
        <div className="font-mono text-[8px] text-[var(--cx-accent)]"># My SaaS App</div>
        <div className="font-mono text-[8px] text-sky-400">Stack: <span className="text-[var(--text-primary)]">Next.js, TypeScript</span></div>
        <div className="font-mono text-[8px] text-sky-400">Rules: <span className="text-[var(--text-primary)]">Always use Zod...</span></div>
      </div>
      <div className="rounded-md bg-[var(--cx-accent)] px-2 py-1 text-center font-sans text-[8px] font-semibold text-[var(--bg-base)]">
        Copy to Clipboard
      </div>
    </div>
  )
}

function StepMockup3() {
  return (
    <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-base)] p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-sans text-[10px] font-medium text-[var(--text-primary)]">Next.js SaaS Pack</div>
        <span className="rounded bg-[var(--cx-accent)]/15 px-1.5 py-0.5 font-sans text-[7px] text-[var(--cx-accent)]">Public</span>
      </div>
      <div className="flex gap-1 mb-2">
        {['Next.js', 'TS', 'Tailwind'].map(t => (
          <span key={t} className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-sans text-[7px] text-[var(--text-muted)]">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
          <span className="font-sans text-[8px] text-[var(--text-muted)]">@alexdev &middot; 312 upvotes</span>
        </div>
        <span className="rounded border border-[var(--bg-border)] px-1.5 py-0.5 font-sans text-[7px] text-[var(--text-secondary)]">Fork</span>
      </div>
    </div>
  )
}

const steps = [
  { num: '01', title: 'Build your pack', description: 'Fill in 6 structured fields about your project — stack, architecture, conventions, AI rules, and known gotchas. Takes 5 minutes, or 90 seconds from a template.', mockup: StepMockup1 },
  { num: '02', title: 'Generate & copy', description: 'Pick your AI tool, we generate the perfect format. CLAUDE.md, .cursorrules, or plain markdown. One click to copy.', mockup: StepMockup2 },
  { num: '03', title: 'Share or keep private', description: 'Publish to the community for others to discover and fork. Or keep it private for your team.', mockup: StepMockup3 },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-[var(--bg-border)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">How it works</p>
          <h2 className="font-display text-[var(--text-primary)]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            From zero to context-loaded in 3 steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const Mockup = step.mockup
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative rounded-2xl border border-[var(--bg-border)] bg-gradient-to-b from-[var(--bg-surface)] to-transparent p-6"
              >
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cx-accent)]/10 font-mono text-sm font-semibold text-[var(--cx-accent)]">
                  {step.num}
                </span>
                <h3 className="mt-3 mb-3 font-sans text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
                <Mockup />
                <p className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
