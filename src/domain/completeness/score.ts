import type { Scope, Risk, Approach } from '../types'

export type CompletenessLabel = 'Early Draft' | 'In Progress' | 'Substantial' | 'Complete'
export type CompletenessColor = 'gray' | 'amber' | 'blue' | 'green'

export interface CompletenessInput {
  scope: Scope | null
  risks: Risk[]
  inScopeItemCount: number
  outOfScopeItemCount: number
  stakeholderCount: number
  integrationPointCount: number
  constraintCount: number
  approach: Approach | null
  patternCount: number
  techChoiceCount: number
  nfrCount: number
  principleCount: number
  opportunityCount: number
}

/**
 * Completeness score (0–82 for scope+risk+approach+opportunity criteria).
 * Remaining 18 comes from ADR/TODO tabs (not yet implemented).
 */
export function calculateCompletenessScore(input: CompletenessInput): number {
  let score = 0

  // --- Scope criteria (50 pts) ---

  // Problem statement: 10 pts
  if (input.scope && input.scope.problemStatement.trim().length > 0) {
    score += 10
  }

  // Risks >= 2: 10 pts
  if (input.risks.length >= 2) {
    score += 10
  }

  // In-scope items >= 3: 5 pts
  if (input.inScopeItemCount >= 3) {
    score += 5
  }

  // Out-of-scope items >= 1: 5 pts
  if (input.outOfScopeItemCount >= 1) {
    score += 5
  }

  // Stakeholders >= 2: 8 pts
  if (input.stakeholderCount >= 2) {
    score += 8
  }

  // Integration points >= 1: 5 pts
  if (input.integrationPointCount >= 1) {
    score += 5
  }

  // Constraints >= 1: 7 pts
  if (input.constraintCount >= 1) {
    score += 7
  }

  // --- Approach criteria (28 pts) ---

  // Architectural style chosen (not 'tbd'): 7 pts
  if (input.approach && input.approach.architecturalStyle !== 'tbd') {
    score += 7
  }

  // Patterns >= 1: 7 pts
  if (input.patternCount >= 1) {
    score += 7
  }

  // Tech choices >= 2: 5 pts
  if (input.techChoiceCount >= 2) {
    score += 5
  }

  // NFRs >= 2: 5 pts
  if (input.nfrCount >= 2) {
    score += 5
  }

  // Principles >= 1: 4 pts
  if (input.principleCount >= 1) {
    score += 4
  }

  // --- Opportunity criteria (4 pts) ---

  // Opportunities >= 1: 4 pts
  if (input.opportunityCount >= 1) {
    score += 4
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
