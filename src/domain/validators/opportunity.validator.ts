import type { CreateOpportunityInput } from '../types'
import type { FieldError } from '../errors'

const VALID_CATEGORIES = ['modernization', 'performance-improvement', 'cost-reduction', 'developer-experience', 'security-improvement', 'scalability', 'technical-debt-reduction', 'strategic-capability', 'other'] as const

export function validateCreateOpportunity(input: CreateOpportunityInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Opportunity title is required.' })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required.' })
  }

  if (!input.category) {
    errors.push({ field: 'category', message: 'Category is required.' })
  } else if (!VALID_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: `Invalid category: ${input.category}` })
  }

  if (!input.valueStatement || input.valueStatement.trim().length === 0) {
    errors.push({ field: 'valueStatement', message: 'Value statement is required.' })
  }

  return errors
}
