import type { CreateADRInput } from '../types'
import type { FieldError } from '../errors'

const VALID_DRIVER_TYPES = ['constraint-driven', 'nfr-driven', 'risk-driven', 'opportunity-driven', 'principle-driven', 'external-mandate'] as const

export function validateCreateADR(input: CreateADRInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'ADR title is required.' })
  }

  if (!input.context || input.context.trim().length === 0) {
    errors.push({ field: 'context', message: 'Context is required.' })
  }

  if (!input.problemStatement || input.problemStatement.trim().length === 0) {
    errors.push({ field: 'problemStatement', message: 'Problem statement is required.' })
  }

  if (!input.driverType) {
    errors.push({ field: 'driverType', message: 'Driver type is required.' })
  } else if (!VALID_DRIVER_TYPES.includes(input.driverType)) {
    errors.push({ field: 'driverType', message: `Invalid driver type: ${input.driverType}` })
  }

  return errors
}
