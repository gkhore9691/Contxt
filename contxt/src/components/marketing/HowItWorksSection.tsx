'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Build your pack',
    description: 'Fill in 6 structured fields about your project — stack, architecture, conventions, AI rules, and known gotchas. Takes 5 minutes once.',
  },
  {
    num: '02',
    title: 'Generate & copy',
    description: 'Pick your AI tool from the selector. We generate a perfectly formatted prompt — CLAUDE.md, .cursorrules, or plain markdown. One click to copy.',
  },
  {
    num: '03',
    title: 'Share or keep private',
    description: 'Publish your pack to the community library for other devs to discover, upvote, and fork. Or keep it private for your team.',
  },
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
          className="mb-14"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">
            How it works
          </p>
          <h2
            className="max-w-sm font-display text-[var(--text-primary)]"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            From zero to context&#8209;loaded in&nbsp;3&nbsp;steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cx-accent)]/30 bg-[var(--cx-accent)]/10 font-mono text-sm font-semibold text-[var(--cx-accent)]">
                {step.num}
              </span>
              <h3 className="mt-3 font-sans text-lg font-semibold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
