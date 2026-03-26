import type { CreateTechChoiceInput } from '../types'
import type { FieldError } from '../errors'

const VALID_CATEGORIES = ['language', 'framework', 'database', 'messaging', 'infrastructure', 'observability', 'security', 'devops', 'testing', 'other'] as const

export function validateCreateTechChoice(input: CreateTechChoiceInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.category) {
    errors.push({ field: 'category', message: 'Technology category is required.' })
  } else if (!VALID_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: `Invalid technology category: ${input.category}` })
  }

  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Technology name is required.' })
  }

  if (!input.rationale || input.rationale.trim().length === 0) {
    errors.push({ field: 'rationale', message: 'Rationale is required.' })
  }

  return errors
}
