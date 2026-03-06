'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let frame: number
    const duration = 1800
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function CTASection() {
  return (
    <section className="relative border-t border-[var(--bg-border)] py-24 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[var(--cx-accent)]/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 inline-flex items-center gap-6 rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] px-8 py-4"
        >
          <div className="text-center">
            <div className="font-display text-2xl text-[var(--text-primary)]"><AnimatedCounter target={2437} suffix="+" /></div>
            <div className="font-sans text-[10px] text-[var(--text-muted)]">Packs created</div>
          </div>
          <div className="h-8 w-px bg-[var(--bg-border)]" />
          <div className="text-center">
            <div className="font-display text-2xl text-[var(--text-primary)]"><AnimatedCounter target={500} suffix="+" /></div>
            <div className="font-sans text-[10px] text-[var(--text-muted)]">Developers</div>
          </div>
          <div className="h-8 w-px bg-[var(--bg-border)]" />
          <div className="text-center">
            <div className="font-display text-2xl text-[var(--cx-accent)]">30s</div>
            <div className="font-sans text-[10px] text-[var(--text-muted)]">Avg. load time</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[var(--text-primary)]" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
            Ready to ship faster{' '}
            <span className="text-[var(--cx-accent)]">with AI?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-md font-sans text-[15px] text-[var(--text-secondary)]">
            Free forever. No credit card. Your first context pack in 5 minutes.
          </p>

          {/* Value strip */}
          <div className="mt-6 flex items-center justify-center gap-6">
            {[
              { step: 'Build', icon: '1' },
              { step: 'Copy', icon: '2' },
              { step: 'Ship', icon: '3' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-2">
                {i > 0 && <span className="text-[var(--text-muted)]">&rarr;</span>}
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cx-accent)]/10 font-mono text-[9px] font-bold text-[var(--cx-accent)]">{s.icon}</span>
                <span className="font-sans text-xs font-medium text-[var(--text-secondary)]">{s.step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="group rounded-xl bg-[var(--cx-accent)] px-8 py-3.5 font-sans text-sm font-semibold text-[var(--bg-base)] transition-all hover:shadow-lg hover:shadow-[var(--cx-accent)]/20 active:scale-[0.98]"
            >
              Start Building — Free
              <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </Link>
          </div>

          <p className="mt-5 font-sans text-xs text-[var(--text-muted)]">
            Works with Claude Code, Cursor, Windsurf, Replit, Copilot, and more
          </p>
        </motion.div>
      </div>
    </section>
  )
}
