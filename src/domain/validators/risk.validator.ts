import type { CreateRiskInput } from '../types'
import type { FieldError } from '../errors'

const VALID_CATEGORIES = ['technical', 'integration', 'data', 'security', 'compliance', 'resource', 'schedule', 'organizational', 'vendor', 'architectural'] as const
const VALID_LIKELIHOODS = ['very-high', 'high', 'medium', 'low', 'very-low'] as const
const VALID_IMPACTS = ['catastrophic', 'major', 'moderate', 'minor', 'negligible'] as const

export function validateCreateRisk(input: CreateRiskInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Risk title is required.' })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Risk description is required.' })
  }

  if (!input.category) {
    errors.push({ field: 'category', message: 'Risk category is required.' })
  } else if (!VALID_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: `Invalid risk category: ${input.category}` })
  }

  if (!input.likelihood) {
    errors.push({ field: 'likelihood', message: 'Likelihood is required.' })
  } else if (!VALID_LIKELIHOODS.includes(input.likelihood)) {
    errors.push({ field: 'likelihood', message: `Invalid likelihood: ${input.likelihood}` })
  }

  if (!input.impact) {
    errors.push({ field: 'impact', message: 'Impact is required.' })
  } else if (!VALID_IMPACTS.includes(input.impact)) {
    errors.push({ field: 'impact', message: `Invalid impact: ${input.impact}` })
  }

  return errors
}
