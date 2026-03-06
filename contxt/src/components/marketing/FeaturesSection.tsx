'use client'

import { motion } from 'framer-motion'

function MiniWizard() {
  return (
    <div className="flex items-center gap-1 mb-3">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="flex items-center gap-1">
          <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[7px] font-bold ${
            n <= 3 ? 'bg-[var(--cx-accent)] text-[var(--bg-base)]' : n === 4 ? 'border border-[var(--cx-accent)] text-[var(--cx-accent)]' : 'border border-[var(--bg-border)] text-[var(--text-muted)]'
          }`}>{n <= 3 ? '✓' : n}</div>
          {n < 6 && <div className={`h-px w-3 ${n < 4 ? 'bg-[var(--cx-accent)]/40' : 'bg-[var(--bg-border)]'}`} />}
        </div>
      ))}
    </div>
  )
}

function MiniTabs() {
  return (
    <div className="flex gap-1 mb-3">
      {['CLAUDE.md', '.cursorrules', 'MD', 'JSON'].map((t, i) => (
        <span key={t} className={`rounded px-1.5 py-0.5 font-mono text-[8px] ${i === 0 ? 'bg-[var(--cx-accent)]/15 text-[var(--cx-accent)]' : 'text-[var(--text-muted)]'}`}>{t}</span>
      ))}
    </div>
  )
}

function MiniCommunity() {
  return (
    <div className="space-y-1.5 mb-3">
      {[{ t: 'Next.js SaaS', v: 312 }, { t: 'MERN Stack', v: 245 }, { t: 'Django API', v: 198 }].map((p) => (
        <div key={p.t} className="flex items-center justify-between rounded-md bg-[var(--bg-base)] px-2 py-1">
          <span className="font-sans text-[9px] text-[var(--text-secondary)]">{p.t}</span>
          <span className="font-mono text-[8px] text-[var(--cx-accent)]">{p.v}</span>
        </div>
      ))}
    </div>
  )
}

function MiniScore() {
  const r = 14; const circ = 2 * Math.PI * r; const offset = circ - (87 / 100) * circ
  return (
    <div className="flex items-center gap-2 mb-3">
      <svg width="36" height="36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--bg-border)" strokeWidth="2.5" />
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--cx-accent)" strokeWidth="2.5" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div>
        <div className="font-mono text-xs font-bold text-emerald-400">87</div>
        <div className="font-sans text-[8px] text-[var(--text-muted)]">Strong</div>
      </div>
    </div>
  )
}

function MiniAvatars() {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex -space-x-1.5">
        {['#6366f1', '#f59e0b', '#10b981', '#ef4444'].map((c, i) => (
          <div key={i} className="h-5 w-5 rounded-full border border-[var(--bg-surface)]" style={{ backgroundColor: c }} />
        ))}
        <div className="h-5 w-5 rounded-full border border-[var(--bg-surface)] bg-[var(--bg-elevated)] flex items-center justify-center font-sans text-[7px] text-[var(--text-muted)]">+6</div>
      </div>
    </div>
  )
}

function MiniCopy() {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="rounded-md bg-[var(--cx-accent)] px-2.5 py-1 font-sans text-[9px] font-medium text-[var(--bg-base)]">
        Copied!
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3 3 7-7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const features = [
  { title: 'Context Pack Builder', description: '6-step wizard captures your stack, conventions, rules, and gotchas into a structured, portable pack.', visual: MiniWizard },
  { title: 'Multi-Format Output', description: 'Generate CLAUDE.md, .cursorrules, Markdown, or JSON — perfectly formatted for each AI tool.', visual: MiniTabs },
  { title: 'Community Library', description: 'Browse 500+ community packs for Next.js, Django, Laravel, and more. Fork and customize instantly.', visual: MiniCommunity },
  { title: 'Health Score', description: 'Every pack gets a 0-100 score measuring completeness. See exactly what to improve for better AI output.', visual: MiniScore },
  { title: 'Team Workspaces', description: 'Share packs across your team so everyone gets identical, consistent AI output.', visual: MiniAvatars },
  { title: 'One-Click Copy', description: 'Select your AI tool, hit copy. Full project context on your clipboard in one second.', visual: MiniCopy },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">Features</p>
          <h2 className="mx-auto max-w-lg font-display text-[var(--text-primary)]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Everything you need to context-load your AI
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-[var(--text-secondary)]">
            Build once, copy anywhere. Your AI agent gets your full project context instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => {
            const Visual = feat.visual
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group rounded-2xl border border-[var(--bg-border)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-base)] p-6 transition-all duration-300 hover:border-[var(--cx-accent)]/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--cx-accent)]/[0.03]"
              >
                <Visual />
                <h3 className="font-sans text-[15px] font-semibold text-[var(--text-primary)]">{feat.title}</h3>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">{feat.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
