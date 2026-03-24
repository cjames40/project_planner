import { describe, it, expect } from 'vitest'
import { calculateCompletenessScore, getCompletenessLabel, getCompletenessColor } from '../completeness/score'
import type { Scope, Risk } from '../types'

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

describe('calculateCompletenessScore', () => {
  it('returns 0 for null scope and no risks', () => {
    expect(calculateCompletenessScore(null, [])).toBe(0)
  })

  it('returns 10 for problem statement only', () => {
    expect(calculateCompletenessScore(makeScope('Problem'), [])).toBe(10)
  })

  it('returns 0 for empty problem statement', () => {
    expect(calculateCompletenessScore(makeScope('  '), [])).toBe(0)
  })

  it('returns 10 for 2+ risks only', () => {
    expect(calculateCompletenessScore(null, [makeRisk(), makeRisk()])).toBe(10)
  })

  it('returns 0 for only 1 risk', () => {
    expect(calculateCompletenessScore(null, [makeRisk()])).toBe(0)
  })

  it('returns 20 for both', () => {
    expect(calculateCompletenessScore(makeScope('Problem'), [makeRisk(), makeRisk()])).toBe(20)
  })
})

describe('getCompletenessLabel', () => {
  it('returns Early Draft for low scores', () => {
    expect(getCompletenessLabel(0)).toBe('Early Draft')
    expect(getCompletenessLabel(39)).toBe('Early Draft')
  })

  it('returns Complete for 90+', () => {
    expect(getCompletenessLabel(90)).toBe('Complete')
  })
})

describe('getCompletenessColor', () => {
  it('returns gray for low scores', () => {
    expect(getCompletenessColor(0)).toBe('gray')
  })

  it('returns green for 90+', () => {
    expect(getCompletenessColor(95)).toBe('green')
  })
})
