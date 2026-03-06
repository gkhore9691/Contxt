'use client'

import { motion } from 'framer-motion'

const testimonials = [
  { quote: "I used to spend 15 minutes re-explaining my Next.js setup. Now I paste my pack and I'm coding in 30 seconds.", name: 'Rohan M.', role: 'Indie Hacker', stars: 5 },
  { quote: 'Our team of 5 devs all use the same context pack. The AI output is finally consistent across PRs.', name: 'Divya S.', role: 'Tech Lead', stars: 5 },
  { quote: 'Found a perfect Next.js 14 pack in the community, forked it, tweaked 3 fields, done.', name: 'Alex K.', role: 'Freelance Dev', stars: 5 },
  { quote: 'Switched from Cursor to Claude Code and my context pack just worked. That portability is everything.', name: 'Marcus T.', role: 'Full Stack Dev', stars: 4 },
  { quote: "Fork a pack, edit 10%, ship. That's my entire onboarding flow for new projects now.", name: 'Priya N.', role: 'Engineering Manager', stars: 5 },
  { quote: 'Published context packs for my 3 OSS repos. Contributors now get consistent AI output.', name: 'Chen W.', role: 'OSS Maintainer', stars: 5 },
  { quote: 'Brain Pack cut my AI onboarding time from an hour to literally 2 minutes. Game changer.', name: 'Sarah L.', role: 'Senior Engineer', stars: 5 },
  { quote: 'The JSON export is perfect — I pipe it into my custom AI automation pipeline.', name: 'James R.', role: 'Dev Tooling', stars: 4 },
]

function nameToColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 50%, 45%)`
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width="12" height="12" viewBox="0 0 12 12" fill={n <= count ? 'var(--cx-accent)' : 'var(--bg-border)'}>
          <path d="M6 0l1.76 3.56L12 4.18 8.82 7.06l.94 4.94L6 9.84 2.24 12l.94-4.94L0 4.18l4.24-.62L6 0z" />
        </svg>
      ))}
    </div>
  )
}

function Card({ t }: { t: typeof testimonials[0] }) {
  const initials = t.name.split(' ').map(w => w[0]).join('')
  return (
    <div className="w-[320px] flex-shrink-0 rounded-2xl border border-[var(--bg-border)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-base)] p-5">
      <Stars count={t.stars} />
      <p className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full font-sans text-[10px] font-bold text-white"
          style={{ backgroundColor: nameToColor(t.name) }}
        >
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
          className="mb-4 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">Testimonials</p>
          <h2 className="font-display text-[var(--text-primary)]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Trusted by developers
          </h2>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 flex items-center justify-center gap-6 text-center"
        >
          {['Vercel', 'Railway', 'Supabase', 'Neon', 'Fly.io'].map(name => (
            <span key={name} className="font-sans text-xs font-medium text-[var(--text-muted)]/60 tracking-wider">{name}</span>
          ))}
        </motion.div>
      </div>

      <div className="overflow-hidden mb-3">
        <div className="flex gap-3" style={{ animation: 'scroll 40s linear infinite', width: 'max-content' }}>
          {[...testimonials, ...testimonials].map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-3" style={{ animation: 'scroll 40s linear infinite reverse', width: 'max-content' }}>
          {[...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials.slice(4), ...testimonials.slice(0, 4)].map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  )
}
