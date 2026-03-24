import { describe, it, expect } from 'vitest'
import { calculateRiskScore, getRiskScoreColor } from '../risk-score'

describe('calculateRiskScore', () => {
  it('returns max score for very-high + catastrophic', () => {
    expect(calculateRiskScore('very-high', 'catastrophic')).toBe(25)
  })

  it('returns min score for very-low + negligible', () => {
    expect(calculateRiskScore('very-low', 'negligible')).toBe(1)
  })

  it('calculates medium x moderate = 9', () => {
    expect(calculateRiskScore('medium', 'moderate')).toBe(9)
  })

  it('calculates high x minor = 8', () => {
    expect(calculateRiskScore('high', 'minor')).toBe(8)
  })
})

describe('getRiskScoreColor', () => {
  it('returns red for score >= 16', () => {
    expect(getRiskScoreColor(16)).toBe('red')
    expect(getRiskScoreColor(25)).toBe('red')
  })

  it('returns amber for score 8-15', () => {
    expect(getRiskScoreColor(8)).toBe('amber')
    expect(getRiskScoreColor(15)).toBe('amber')
  })

  it('returns green for score < 8', () => {
    expect(getRiskScoreColor(1)).toBe('green')
    expect(getRiskScoreColor(7)).toBe('green')
  })
})
