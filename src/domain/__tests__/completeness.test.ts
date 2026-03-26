import { describe, it, expect } from 'vitest'
import { calculateCompletenessScore, getCompletenessLabel, getCompletenessColor, type CompletenessInput } from '../completeness/score'
import type { Scope, Risk, Approach } from '../types'

const makeScope = (problemStatement: string): Scope => ({
  id: '1',
  planId: 'p1',
  problemStatement,
  solutionSummary: '',
  assumptions: [],
  createdAt: '',
  updatedAt: '',
})

const makeRisk = (): Risk => ({
  id: '1',
  planId: 'p1',
  title: 'Risk',
  description: 'Desc',
  category: 'technical',
  likelihood: 'medium',
  impact: 'moderate',
  status: 'open',
  mitigationStrategy: '',
  mitigationStatus: '',
  contingencyPlan: '',
  owner: '',
  reviewDate: '',
  createdVia: 'manual',
  tags: [],
  notes: '',
  linkedConstraintIds: [],
  linkedIntegrationPointIds: [],
  linkedNFRIds: [],
  linkedADRIds: [],
  linkedOpportunityIds: [],
  linkedStakeholderIds: [],
  createdAt: '',
  updatedAt: '',
})

const makeApproach = (style: Approach['architecturalStyle'] = 'microservices'): Approach => ({
  id: '1',
  planId: 'p1',
  strategySummary: '',
  architecturalStyle: style,
  architecturalStyleRationale: '',
  createdAt: '',
  updatedAt: '',
})

function makeInput(overrides: Partial<CompletenessInput> = {}): CompletenessInput {
  return {
    scope: null,
    risks: [],
    inScopeItemCount: 0,
    outOfScopeItemCount: 0,
    stakeholderCount: 0,
    integrationPointCount: 0,
    constraintCount: 0,
    approach: null,
    patternCount: 0,
    techChoiceCount: 0,
    nfrCount: 0,
    principleCount: 0,
    opportunityCount: 0,
    ...overrides,
  }
}

describe('calculateCompletenessScore', () => {
  it('returns 0 for empty input', () => {
    expect(calculateCompletenessScore(makeInput())).toBe(0)
  })

  it('returns 10 for problem statement only', () => {
    expect(calculateCompletenessScore(makeInput({ scope: makeScope('Problem') }))).toBe(10)
  })

  it('returns 0 for empty problem statement', () => {
    expect(calculateCompletenessScore(makeInput({ scope: makeScope('  ') }))).toBe(0)
  })

  it('returns 10 for 2+ risks only', () => {
    expect(calculateCompletenessScore(makeInput({ risks: [makeRisk(), makeRisk()] }))).toBe(10)
  })

  it('returns 0 for only 1 risk', () => {
    expect(calculateCompletenessScore(makeInput({ risks: [makeRisk()] }))).toBe(0)
  })

  it('returns 5 for 3+ in-scope items', () => {
    expect(calculateCompletenessScore(makeInput({ inScopeItemCount: 3 }))).toBe(5)
  })

  it('returns 0 for 2 in-scope items', () => {
    expect(calculateCompletenessScore(makeInput({ inScopeItemCount: 2 }))).toBe(0)
  })

  it('returns 5 for 1+ out-of-scope items', () => {
    expect(calculateCompletenessScore(makeInput({ outOfScopeItemCount: 1 }))).toBe(5)
  })

  it('returns 8 for 2+ stakeholders', () => {
    expect(calculateCompletenessScore(makeInput({ stakeholderCount: 2 }))).toBe(8)
  })

  it('returns 0 for 1 stakeholder', () => {
    expect(calculateCompletenessScore(makeInput({ stakeholderCount: 1 }))).toBe(0)
  })

  it('returns 5 for 1+ integration points', () => {
    expect(calculateCompletenessScore(makeInput({ integrationPointCount: 1 }))).toBe(5)
  })

  it('returns 7 for 1+ constraints', () => {
    expect(calculateCompletenessScore(makeInput({ constraintCount: 1 }))).toBe(7)
  })

  // Approach criteria
  it('returns 7 for architectural style chosen', () => {
    expect(calculateCompletenessScore(makeInput({ approach: makeApproach('microservices') }))).toBe(7)
  })

  it('returns 0 for architectural style tbd', () => {
    expect(calculateCompletenessScore(makeInput({ approach: makeApproach('tbd') }))).toBe(0)
  })

  it('returns 7 for 1+ patterns', () => {
    expect(calculateCompletenessScore(makeInput({ patternCount: 1 }))).toBe(7)
  })

  it('returns 5 for 2+ tech choices', () => {
    expect(calculateCompletenessScore(makeInput({ techChoiceCount: 2 }))).toBe(5)
  })

  it('returns 0 for 1 tech choice', () => {
    expect(calculateCompletenessScore(makeInput({ techChoiceCount: 1 }))).toBe(0)
  })

  it('returns 5 for 2+ NFRs', () => {
    expect(calculateCompletenessScore(makeInput({ nfrCount: 2 }))).toBe(5)
  })

  it('returns 4 for 1+ principles', () => {
    expect(calculateCompletenessScore(makeInput({ principleCount: 1 }))).toBe(4)
  })

  // Opportunity criteria
  it('returns 4 for 1+ opportunities', () => {
    expect(calculateCompletenessScore(makeInput({ opportunityCount: 1 }))).toBe(4)
  })

  it('returns 50 for all scope criteria met', () => {
    expect(calculateCompletenessScore(makeInput({
      scope: makeScope('Problem'),
      risks: [makeRisk(), makeRisk()],
      inScopeItemCount: 3,
      outOfScopeItemCount: 1,
      stakeholderCount: 2,
      integrationPointCount: 1,
      constraintCount: 1,
    }))).toBe(50)
  })

  it('returns 82 for all criteria met', () => {
    expect(calculateCompletenessScore(makeInput({
      scope: makeScope('Problem'),
      risks: [makeRisk(), makeRisk()],
      inScopeItemCount: 3,
      outOfScopeItemCount: 1,
      stakeholderCount: 2,
      integrationPointCount: 1,
      constraintCount: 1,
      approach: makeApproach('microservices'),
      patternCount: 1,
      techChoiceCount: 2,
      nfrCount: 2,
      principleCount: 1,
      opportunityCount: 1,
    }))).toBe(82)
  })
})

describe('getCompletenessLabel', () => {
  it('returns Early Draft for low scores', () => {
    expect(getCompletenessLabel(0)).toBe('Early Draft')
    expect(getCompletenessLabel(39)).toBe('Early Draft')
  })

  it('returns In Progress for 40-69', () => {
    expect(getCompletenessLabel(40)).toBe('In Progress')
    expect(getCompletenessLabel(50)).toBe('In Progress')
  })

  it('returns Complete for 90+', () => {
    expect(getCompletenessLabel(90)).toBe('Complete')
  })
})

describe('getCompletenessColor', () => {
  it('returns gray for low scores', () => {
    expect(getCompletenessColor(0)).toBe('gray')
  })

  it('returns amber for 40-69', () => {
    expect(getCompletenessColor(50)).toBe('amber')
  })

  it('returns green for 90+', () => {
    expect(getCompletenessColor(95)).toBe('green')
  })
})
