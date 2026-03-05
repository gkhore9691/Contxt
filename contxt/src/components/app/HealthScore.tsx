'use client'

import { calculateHealthScore, type ScoreBreakdown } from '@/lib/pack/health-score'

const BAND_COLORS = {
  weak: { ring: 'stroke-red-500', text: 'text-red-400', bg: 'bg-red-500/10' },
  good: { ring: 'stroke-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  strong: { ring: 'stroke-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  expert: { ring: 'stroke-[var(--cx-accent)]', text: 'text-[var(--cx-accent)]', bg: 'bg-[var(--cx-accent)]/10' },
}

function ScoreRing({ score, size = 48 }: { score: ScoreBreakdown; size?: number }) {
  const radius = (size - 6) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (score.total / 100) * circ
  const colors = BAND_COLORS[score.band]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--bg-border)" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className={colors.ring} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-mono text-xs font-bold ${colors.text}`}>{score.total}</span>
      </div>
    </div>
  )
}

export function HealthScoreBadge({ pack }: { pack: Parameters<typeof calculateHealthScore>[0] }) {
  const score = calculateHealthScore(pack)
  const colors = BAND_COLORS[score.band]
  return (
    <div className="flex items-center gap-2">
      <ScoreRing score={score} size={36} />
      <span className={`font-sans text-[11px] font-medium ${colors.text}`}>{score.bandLabel}</span>
    </div>
  )
}

export function HealthScoreDetail({ pack }: { pack: Parameters<typeof calculateHealthScore>[0] }) {
  const score = calculateHealthScore(pack)
  const colors = BAND_COLORS[score.band]
  const suggestions = score.items.filter((i) => i.suggestion)

  return (
    <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center gap-4 mb-4">
        <ScoreRing score={score} size={56} />
        <div>
          <div className={`font-sans text-sm font-semibold ${colors.text}`}>{score.bandLabel}</div>
          <div className="font-sans text-xs text-[var(--text-muted)]">Context health score: {score.total}/100</div>
        </div>
      </div>

      <div className="space-y-2">
        {score.items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[13px] text-[var(--text-secondary)]">{item.label}</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">{item.points}/{item.maxPoints}</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${item.points === item.maxPoints ? 'bg-emerald-500' : item.points > 0 ? 'bg-yellow-500' : 'bg-[var(--bg-border)]'}`}
                  style={{ width: `${(item.points / item.maxPoints) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--bg-border)]">
          <p className="font-sans text-xs font-medium text-[var(--text-muted)] mb-2">Suggestions to improve</p>
          <ul className="space-y-1.5">
            {suggestions.map((s) => (
              <li key={s.label} className="font-sans text-[12px] text-[var(--text-secondary)]">
                <span className="text-[var(--cx-accent)] mr-1.5">+{s.maxPoints - s.points}pts</span>
                {s.suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
