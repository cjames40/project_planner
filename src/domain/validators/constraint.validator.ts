import type { CreateConstraintInput } from '../types'
import type { FieldError } from '../errors'

const VALID_TYPES = ['technical', 'business', 'regulatory', 'resource', 'time'] as const

export function validateCreateConstraint(input: CreateConstraintInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Constraint title is required.' })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required.' })
  }

  if (!input.type) {
    errors.push({ field: 'type', message: 'Constraint type is required.' })
  } else if (!VALID_TYPES.includes(input.type)) {
    errors.push({ field: 'type', message: `Invalid constraint type: ${input.type}` })
  }

  if (!input.source || input.source.trim().length === 0) {
    errors.push({ field: 'source', message: 'Source is required.' })
  }

  if (input.isNegotiable === undefined || input.isNegotiable === null) {
    errors.push({ field: 'isNegotiable', message: 'Negotiability must be specified.' })
  }

  if (!input.impact || input.impact.trim().length === 0) {
    errors.push({ field: 'impact', message: 'Impact is required.' })
  }

  return errors
}
