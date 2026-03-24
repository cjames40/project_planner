import type { RiskLikelihood, RiskImpact } from './types'

const LIKELIHOOD_SCORES: Record<RiskLikelihood, number> = {
  'very-high': 5,
  'high': 4,
  'medium': 3,
  'low': 2,
  'very-low': 1,
}

const IMPACT_SCORES: Record<RiskImpact, number> = {
  'catastrophic': 5,
  'major': 4,
  'moderate': 3,
  'minor': 2,
  'negligible': 1,
}

export function calculateRiskScore(likelihood: RiskLikelihood, impact: RiskImpact): number {
  return LIKELIHOOD_SCORES[likelihood] * IMPACT_SCORES[impact]
}

export type RiskScoreColor = 'red' | 'amber' | 'green'

export function getRiskScoreColor(score: number): RiskScoreColor {
  if (score >= 16) return 'red'
  if (score >= 8) return 'amber'
  return 'green'
}
