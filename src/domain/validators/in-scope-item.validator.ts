import type { CreateInScopeItemInput } from '../types'
import type { FieldError } from '../errors'

const VALID_CATEGORIES = ['functional', 'data', 'integration', 'infrastructure', 'process', 'security', 'other'] as const

export function validateCreateInScopeItem(input: CreateInScopeItemInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required.' })
  }

  if (input.category && !VALID_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: `Invalid category: ${input.category}` })
  }

  return errors
}
