'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const plans = [
  {
    id: 'free', name: 'Free', price: '$0', tagline: 'For solo devs getting started', featured: false,
    features: ['3 Context Packs', 'Markdown output', '1 Private Pack', 'Community library (browse + upvote)'],
    cta: 'Get Started', href: '/register',
  },
  {
    id: 'pro', name: 'Pro', price: '$7', tagline: 'For serious indie developers', featured: true,
    features: ['Unlimited Context Packs', 'All 4 output formats', 'Unlimited Private Packs', 'Version history', 'Fork community packs', 'Email support'],
    cta: 'Start with Pro', href: '/register',
  },
  {
    id: 'team', name: 'Team', price: '$29', tagline: 'For dev teams', featured: false,
    features: ['Everything in Pro', 'Team workspace (10 members)', 'Shared pack library', 'Role-based editing', 'Full version history', 'Priority support'],
    cta: 'Start Team Trial', href: '/register',
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="border-t border-[var(--bg-border)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">
            Pricing
          </p>
          <h2
            className="font-display text-[var(--text-primary)]"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-[var(--text-secondary)]">
            Start free. Upgrade when you need more packs, output formats, or team features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-xl border bg-[var(--bg-surface)] p-7 ${
                plan.featured ? 'border-[var(--cx-accent)]/50' : 'border-[var(--bg-border)]'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--cx-accent)] px-3 py-0.5 font-sans text-[11px] font-medium text-[var(--bg-base)]">
                  Most Popular
                </span>
              )}

              <p className="font-sans text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{plan.name}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl text-[var(--text-primary)]">{plan.price}</span>
                <span className="font-sans text-sm text-[var(--text-muted)]">/mo</span>
              </div>
              <p className="mt-1 font-sans text-[13px] text-[var(--text-secondary)]">{plan.tagline}</p>

              <hr className="my-5 border-[var(--bg-border)]" />

              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 font-sans text-[13px] text-[var(--text-secondary)]">
                    <span className="mt-0.5 flex-shrink-0 text-[var(--cx-accent)]">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-7 block w-full rounded-lg py-2.5 text-center font-sans text-sm font-medium transition-colors ${
                  plan.featured
                    ? 'bg-[var(--cx-accent)] text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)]'
                    : 'border border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
