import type { CreatePatternInput } from '../types'
import type { FieldError } from '../errors'

export function validateCreatePattern(input: CreatePatternInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Pattern name is required.' })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Pattern description is required.' })
  }

  if (!input.tradeoffs || input.tradeoffs.trim().length === 0) {
    errors.push({ field: 'tradeoffs', message: 'Tradeoffs are required.' })
  }

  return errors
}
