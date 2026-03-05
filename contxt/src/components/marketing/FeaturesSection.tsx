'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Context Pack Builder',
    description: '6-step wizard captures your stack, conventions, rules, and gotchas into a portable pack.',
  },
  {
    title: 'Multi-Format Output',
    description: 'Generate CLAUDE.md, .cursorrules, Markdown, or JSON — perfectly formatted for each AI tool.',
  },
  {
    title: 'Community Library',
    description: 'Browse 500+ community packs for Next.js, Django, Laravel, and more. Fork and customize instantly.',
  },
  {
    title: 'Version History',
    description: 'Track changes to your context packs over time. Roll back to any previous version.',
  },
  {
    title: 'Team Workspaces',
    description: 'Share packs across your team so everyone gets identical, consistent AI output.',
  },
  {
    title: 'One-Click Copy',
    description: 'Select your AI tool, hit copy. Full project context on your clipboard in one second.',
  },
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
          className="mb-14"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">
            Features
          </p>
          <h2
            className="max-w-md font-display text-[var(--text-primary)]"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Everything you need to context-load your AI
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-6 transition-all duration-200 hover:border-[var(--cx-accent)]/30 hover:bg-[var(--bg-elevated)]"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cx-accent)]/10 font-mono text-xs font-semibold text-[var(--cx-accent)]">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-sans text-[15px] font-semibold text-[var(--text-primary)]">
                {feat.title}
              </h3>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
