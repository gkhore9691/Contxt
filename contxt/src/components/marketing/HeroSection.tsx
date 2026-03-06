'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const agents = ['Claude Code', 'Cursor', 'Windsurf', 'Replit Agent', 'GitHub Copilot', 'ChatGPT', 'Gemini', 'Cody']

const DEMO_FRAMEWORKS = ['Next.js', 'React', 'Django', 'FastAPI', 'Laravel', 'SvelteKit']

function LiveDemo() {
  const [projectName, setProjectName] = useState('')
  const [framework, setFramework] = useState('')
  const [aiRule, setAiRule] = useState('')
  const [copied, setCopied] = useState(false)

  const output = `# ${projectName || 'My Project'}

## Tech Stack
Framework: ${framework || '...'}

## AI Rules
${aiRule || '...'}`

  function handleCopy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full">
      {/* Glow behind the demo */}
      <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-[var(--cx-accent)]/[0.03] blur-2xl" />

      <div className="relative rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl shadow-black/40">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--bg-border)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 font-mono text-[10px] text-[var(--text-muted)]">brain-pack — try it live</span>
        </div>

        <div className="grid grid-cols-2 divide-x divide-[var(--bg-border)]">
          {/* Left: mini form */}
          <div className="p-4 space-y-3">
            <div>
              <label className="block mb-1 font-sans text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Project name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My SaaS App"
                className="w-full rounded-md border border-[var(--bg-border)] bg-[var(--bg-base)] px-2.5 py-1.5 font-sans text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--cx-accent)]/40 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block mb-1.5 font-sans text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Framework</label>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_FRAMEWORKS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFramework(framework === f ? '' : f)}
                    className={`rounded-md px-2 py-1 font-sans text-[10px] transition-all ${
                      framework === f
                        ? 'bg-[var(--cx-accent)] text-[var(--bg-base)] font-medium shadow-sm'
                        : 'border border-[var(--bg-border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-sans text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">AI rule</label>
              <textarea
                value={aiRule}
                onChange={(e) => setAiRule(e.target.value)}
                placeholder="Always use TypeScript strict mode"
                rows={2}
                className="w-full rounded-md border border-[var(--bg-border)] bg-[var(--bg-base)] px-2.5 py-1.5 font-sans text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--cx-accent)]/40 focus:outline-none resize-none transition-colors"
              />
            </div>
          </div>

          {/* Right: live preview */}
          <div className="relative bg-[var(--bg-base)] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1">
                {['CLAUDE.md', '.cursorrules'].map((t, i) => (
                  <span key={t} className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${i === 0 ? 'bg-[var(--cx-accent)]/15 text-[var(--cx-accent)]' : 'text-[var(--text-muted)]'}`}>{t}</span>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className={`rounded-md px-2 py-0.5 font-sans text-[10px] font-medium transition-all ${
                  copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--cx-accent)] text-[var(--bg-base)] hover:bg-[var(--cx-accent-dim)]'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-[10px] leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">
              <span className="text-[var(--cx-accent)]"># {projectName || 'My Project'}</span>{'\n\n'}
              <span className="text-[var(--cx-accent)]">## Tech Stack</span>{'\n'}
              <span className="text-sky-400">Framework:</span> {framework || <span className="text-[var(--text-muted)] italic">pick one</span>}{'\n\n'}
              <span className="text-[var(--cx-accent)]">## AI Rules</span>{'\n'}
              {aiRule || <span className="text-[var(--text-muted)] italic">type a rule</span>}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let frame: number
    const duration = 1500
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return <>{count.toLocaleString()}{suffix}</>
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background mesh gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-200px] left-[20%] h-[600px] w-[600px] rounded-full bg-[var(--cx-accent)]/[0.04] blur-[150px]" />
        <div className="absolute top-[100px] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-28">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-slow 2s ease infinite' }} />
              <span className="font-sans text-xs text-[var(--text-secondary)]">Used by 500+ developers daily</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display leading-[1.08] tracking-tight text-[var(--text-primary)]"
              style={{ fontSize: 'clamp(36px, 5.5vw, 60px)' }}
            >
              Stop re-explaining your project to{' '}
              <span className="relative inline-block text-[var(--cx-accent)]">
                AI agents
                <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6c40-4 80-4 196-2" stroke="var(--cx-accent)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]"
            >
              Build a structured Context Pack once. Copy it into Claude Code, Cursor, or Windsurf in one click. Your AI agent instantly knows your entire project.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/register"
                className="group relative rounded-xl bg-[var(--cx-accent)] px-6 py-3 font-sans text-sm font-semibold text-[var(--bg-base)] transition-all hover:shadow-lg hover:shadow-[var(--cx-accent)]/20 active:scale-[0.98]"
              >
                Build yours in 30 seconds
                <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>
              <Link
                href="/community"
                className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] px-5 py-3 font-sans text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--text-muted)] hover:text-[var(--text-primary)] active:scale-[0.98]"
              >
                Browse community packs
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 flex items-center gap-4"
            >
              {/* Mini avatar stack */}
              <div className="flex -space-x-2">
                {['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'].map((color, i) => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-[var(--bg-base)]" style={{ backgroundColor: color, opacity: 0.8 }} />
                ))}
              </div>
              <span className="font-sans text-xs text-[var(--text-muted)]">Free forever &middot; No credit card</span>
            </motion.div>
          </div>

          {/* Right: Live Demo */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <LiveDemo />
          </motion.div>
        </div>

        {/* Agent ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <p className="mb-3 text-center font-sans text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            Works with your AI tools
          </p>
          <div className="overflow-hidden">
            <div className="flex gap-2.5" style={{ animation: 'scroll 22s linear infinite', width: 'max-content' }}>
              {[...agents, ...agents].map((agent, i) => (
                <span key={i} className="flex-shrink-0 rounded-full border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3.5 py-1.5 font-sans text-xs text-[var(--text-muted)]">
                  {agent}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
