'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const plans = [
  {
    id: 'free', name: 'Free', price: '$0', tagline: 'For solo devs getting started', featured: false,
    features: [
      { text: '3 Context Packs', included: true },
      { text: 'Markdown output', included: true },
      { text: '1 Private Pack', included: true },
      { text: 'Community (browse + upvote)', included: true },
      { text: 'All output formats', included: false },
      { text: 'Version history', included: false },
    ],
    cta: 'Get Started Free', href: '/register',
  },
  {
    id: 'pro', name: 'Pro', price: '$7', tagline: 'For serious indie developers', featured: true,
    features: [
      { text: 'Unlimited Context Packs', included: true },
      { text: 'All 4 output formats', included: true },
      { text: 'Unlimited Private Packs', included: true },
      { text: 'Version history', included: true },
      { text: 'Fork community packs', included: true },
      { text: 'Email support', included: true },
    ],
    cta: 'Start with Pro', href: '/register',
  },
  {
    id: 'team', name: 'Team', price: '$29', tagline: 'For dev teams', featured: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team workspace (10 members)', included: true },
      { text: 'Shared pack library', included: true },
      { text: 'Role-based editing', included: true },
      { text: 'Full version history', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start Team Trial', href: '/register',
  },
]

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel with one click, no questions asked. Your packs stay accessible on the free tier.' },
  { q: 'What happens if I downgrade?', a: 'You keep all your packs but lose access to Pro features like version history and all output formats. Packs beyond the free limit become read-only.' },
  { q: 'Do community packs count against my limit?', a: 'No. The pack limit only applies to packs you create. You can browse, upvote, and fork unlimited community packs.' },
  { q: 'Can I use Brain Pack with any AI tool?', a: 'Yes. We generate output for Claude Code, Cursor, Windsurf, and any tool that accepts markdown or text context.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--bg-border)]">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="font-sans text-sm font-medium text-[var(--text-primary)]">{q}</span>
        <span className={`ml-4 flex-shrink-0 text-[var(--text-muted)] transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <p className="pb-4 font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">{a}</p>
      )}
    </div>
  )
}

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
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--cx-accent)]">Pricing</p>
          <h2 className="font-display text-[var(--text-primary)]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
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
              className={`relative rounded-2xl border p-7 ${
                plan.featured
                  ? 'border-[var(--cx-accent)]/40 bg-gradient-to-b from-[var(--cx-accent)]/[0.04] to-[var(--bg-surface)]'
                  : 'border-[var(--bg-border)] bg-[var(--bg-surface)]'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--cx-accent)] to-[#d4923f] px-4 py-1 font-sans text-[11px] font-semibold text-[var(--bg-base)] shadow-lg shadow-[var(--cx-accent)]/20">
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
                  <li key={f.text} className="flex items-start gap-2.5 font-sans text-[13px]">
                    {f.included ? (
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center text-[var(--text-muted)]">&mdash;</span>
                    )}
                    <span className={f.included ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-7 block w-full rounded-xl py-2.5 text-center font-sans text-sm font-medium transition-all active:scale-[0.98] ${
                  plan.featured
                    ? 'bg-[var(--cx-accent)] text-[var(--bg-base)] hover:shadow-lg hover:shadow-[var(--cx-accent)]/20'
                    : 'border border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-20 max-w-2xl"
        >
          <h3 className="mb-6 text-center font-display text-xl text-[var(--text-primary)]">Frequently asked questions</h3>
          <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] px-6">
            {faqs.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
