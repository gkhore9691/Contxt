'use client'

import { motion } from 'framer-motion'

const stats = [
  { number: '500+', label: 'Developers' },
  { number: '2,400+', label: 'Packs Created' },
  { number: '12', label: 'AI Tools Supported' },
  { number: '30s', label: 'Avg. Load Time' },
]

export default function StatsBar() {
  return (
    <div className="border-y border-[var(--bg-border)] bg-[var(--bg-surface)] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-center"
            >
              <div className="font-display text-3xl text-[var(--text-primary)]">{stat.number}</div>
              <div className="mt-1 font-sans text-xs text-[var(--text-muted)]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
