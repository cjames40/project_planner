import type { CreatePrincipleInput } from '../types'
import type { FieldError } from '../errors'

export function validateCreatePrinciple(input: CreatePrincipleInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Principle title is required.' })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Principle description is required.' })
  }

  return errors
}
