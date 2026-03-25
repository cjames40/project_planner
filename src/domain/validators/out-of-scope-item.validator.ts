import type { CreateOutOfScopeItemInput } from '../types'
import type { FieldError } from '../errors'

export function validateCreateOutOfScopeItem(input: CreateOutOfScopeItemInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required.' })
  }

  if (!input.rationale || input.rationale.trim().length === 0) {
    errors.push({ field: 'rationale', message: 'Rationale is required for out-of-scope items.' })
  }

  return errors
}
