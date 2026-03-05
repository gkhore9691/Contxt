export interface ScoreBreakdown {
  total: number
  band: 'weak' | 'good' | 'strong' | 'expert'
  bandLabel: string
  items: { label: string; points: number; maxPoints: number; suggestion?: string }[]
}

interface PackFields {
  title?: string | null
  description?: string | null
  frameworkTag?: string | null
  languageTag?: string | null
  uiLib?: string | null
  db?: string | null
  hosting?: string | null
  architecture?: string | null
  conventions?: string | null
  aiRules?: string | null
  gotchas?: string | null
}

function wordCount(s?: string | null): number {
  if (!s) return 0
  return s.trim().split(/\s+/).filter(Boolean).length
}

function lineCount(s?: string | null): number {
  if (!s) return 0
  return s.trim().split('\n').filter(l => l.trim()).length
}

export function calculateHealthScore(pack: PackFields): ScoreBreakdown {
  const items: ScoreBreakdown['items'] = []

  // Project Basics (15 pts)
  const hasBasics = (pack.title?.trim().length ?? 0) >= 3 && (pack.description?.trim().length ?? 0) > 0
  items.push({
    label: 'Project basics',
    points: hasBasics ? 15 : pack.title ? 8 : 0,
    maxPoints: 15,
    suggestion: !hasBasics ? 'Add a description to help AI understand your project' : undefined,
  })

  // Stack section (15 pts) — needs at least 3 items
  const stackCount = [pack.frameworkTag, pack.languageTag, pack.uiLib, pack.db, pack.hosting]
    .filter(Boolean).length
  const stackPts = stackCount >= 3 ? 15 : stackCount >= 2 ? 10 : stackCount >= 1 ? 5 : 0
  items.push({
    label: 'Tech stack',
    points: stackPts,
    maxPoints: 15,
    suggestion: stackCount < 3 ? `Add ${3 - stackCount} more stack items (UI lib, database, hosting)` : undefined,
  })

  // Architecture (20 pts) — needs 100+ words
  const archWords = wordCount(pack.architecture)
  const archPts = archWords >= 100 ? 20 : archWords >= 50 ? 14 : archWords >= 20 ? 8 : archWords > 0 ? 4 : 0
  items.push({
    label: 'Architecture',
    points: archPts,
    maxPoints: 20,
    suggestion: archWords < 100 ? `Add ${Math.max(0, 100 - archWords)} more words about your project structure` : undefined,
  })

  // Conventions (15 pts) — needs 5+ rules/lines
  const convLines = lineCount(pack.conventions)
  const convPts = convLines >= 5 ? 15 : convLines >= 3 ? 10 : convLines > 0 ? 5 : 0
  items.push({
    label: 'Conventions',
    points: convPts,
    maxPoints: 15,
    suggestion: convLines < 5 ? `Add ${Math.max(0, 5 - convLines)} more coding conventions` : undefined,
  })

  // AI Rules (20 pts) — needs 3+ rules
  const rulesLines = lineCount(pack.aiRules)
  const rulesPts = rulesLines >= 3 ? 20 : rulesLines >= 2 ? 12 : rulesLines >= 1 ? 6 : 0
  items.push({
    label: 'AI rules',
    points: rulesPts,
    maxPoints: 20,
    suggestion: rulesLines < 3 ? `Add ${Math.max(0, 3 - rulesLines)} more AI behaviour rules` : undefined,
  })

  // Gotchas (15 pts)
  const gotchasWords = wordCount(pack.gotchas)
  const gotchasPts = gotchasWords >= 10 ? 15 : gotchasWords > 0 ? 8 : 0
  items.push({
    label: 'Known gotchas',
    points: gotchasPts,
    maxPoints: 15,
    suggestion: gotchasWords < 10 ? 'Document known issues or quirks the AI should know about' : undefined,
  })

  const total = items.reduce((s, i) => s + i.points, 0)
  let band: ScoreBreakdown['band']
  let bandLabel: string
  if (total >= 91) { band = 'expert'; bandLabel = 'Expert Pack' }
  else if (total >= 71) { band = 'strong'; bandLabel = 'Strong Context' }
  else if (total >= 41) { band = 'good'; bandLabel = 'Good Context' }
  else { band = 'weak'; bandLabel = 'Weak Context' }

  return { total, band, bandLabel, items }
}
