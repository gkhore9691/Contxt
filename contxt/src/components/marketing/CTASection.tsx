'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="border-t border-[var(--bg-border)] py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-display text-[var(--text-primary)]"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
          >
            Ready to ship faster{' '}
            <span className="text-[var(--cx-accent)]">with AI?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-md font-sans text-sm text-[var(--text-secondary)]">
            Free forever. No credit card. Your first context pack in 5 minutes.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-[var(--cx-accent)] px-8 py-3.5 font-sans text-sm font-medium text-[var(--bg-base)] transition-all hover:bg-[var(--cx-accent-dim)] hover:shadow-lg hover:shadow-[var(--cx-accent)]/10"
          >
            Start Building — Free
          </Link>

          <p className="mt-5 font-sans text-xs text-[var(--text-muted)]">
            Works with Claude Code, Cursor, Windsurf, Replit, Copilot, and more
          </p>
        </motion.div>
      </div>
    </section>
  )
}
