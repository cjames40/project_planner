import type { Scope, Risk } from '../types'

export type CompletenessLabel = 'Early Draft' | 'In Progress' | 'Substantial' | 'Complete'
export type CompletenessColor = 'gray' | 'amber' | 'blue' | 'green'

/**
 * Simplified completeness score for the vertical slice.
 * Checks problemStatement (10pts) and risk count >= 2 (10pts).
 * Full 14-criterion scoring is tech debt.
 */
export function calculateCompletenessScore(
  scope: Scope | null,
  risks: Risk[],
): number {
  let score = 0

  if (scope && scope.problemStatement.trim().length > 0) {
    score += 10
  }

  if (risks.length >= 2) {
    score += 10
  }

  return score
}

export function getCompletenessLabel(score: number): CompletenessLabel {
  if (score >= 90) return 'Complete'
  if (score >= 70) return 'Substantial'
  if (score >= 40) return 'In Progress'
  return 'Early Draft'
}

export function getCompletenessColor(score: number): CompletenessColor {
  if (score >= 90) return 'green'
  if (score >= 70) return 'blue'
  if (score >= 40) return 'amber'
  return 'gray'
}
