'use client'

import { motion } from 'framer-motion'

const testimonials = [
  { quote: "I used to spend 15 minutes at the start of every Claude Code session re-explaining my Next.js setup. Now I paste my Contxt pack and I'm coding in 30 seconds.", name: 'Rohan M.', role: 'Indie Hacker' },
  { quote: 'Our team of 5 devs all use the same context pack. The AI output is finally consistent across PRs.', name: 'Divya S.', role: 'Tech Lead' },
  { quote: 'The community library alone is worth it. Found a perfect Next.js 14 pack, forked it, tweaked 3 fields, done.', name: 'Alex K.', role: 'Freelance Dev' },
  { quote: 'Switched from Cursor to Claude Code and my context pack just worked. That portability is everything.', name: 'Marcus T.', role: 'Full Stack Dev' },
  { quote: "Fork a community pack, edit 10%, ship. That's my entire onboarding flow for new projects now.", name: 'Priya N.', role: 'Engineering Manager' },
  { quote: 'I maintain 3 OSS repos. Published a context pack for each. Contributors now get consistent AI output.', name: 'Chen W.', role: 'OSS Maintainer' },
  { quote: 'Contxt cut my onboarding time for new AI tools from an hour to literally 2 minutes.', name: 'Sarah L.', role: 'Senior Engineer' },
  { quote: 'The JSON export format is great — I pipe it straight into my custom AI automation scripts.', name: 'James R.', role: 'Dev Tooling' },
]

function Card({ t }: { t: typeof testimonials[0] }) {
  const initials = t.name.split(' ').map(w => w[0]).join('')
  return (
    <div className="w-[300px] flex-shrink-0 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5">
      <p className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-elevated)] font-sans text-[11px] font-semibold text-[var(--text-secondary)]">
          {initials}
        </div>
        <div>
          <div className="font-sans text-sm font-medium text-[var(--text-primary)]">{t.name}</div>
          <div className="font-sans text-[11px] text-[var(--text-muted)]">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">
            Testimonials
          </p>
          <h2
            className="font-display text-[var(--text-primary)]"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Trusted by developers
          </h2>
        </motion.div>
      </div>

      <div className="overflow-hidden mb-3">
        <div className="flex gap-3" style={{ animation: 'scroll 35s linear infinite', width: 'max-content' }}>
          {[...testimonials, ...testimonials].map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-3" style={{ animation: 'scroll 35s linear infinite reverse', width: 'max-content' }}>
          {[...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials.slice(4), ...testimonials.slice(0, 4)].map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  )
}
