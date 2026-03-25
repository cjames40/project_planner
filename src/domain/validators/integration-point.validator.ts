import type { CreateIntegrationPointInput } from '../types'
import type { FieldError } from '../errors'

const VALID_DIRECTIONS = ['inbound', 'outbound', 'bidirectional'] as const
const VALID_CRITICALITIES = ['critical', 'high', 'medium', 'low'] as const
const VALID_STATUSES = ['confirmed', 'assumed', 'tbd'] as const

export function validateCreateIntegrationPoint(input: CreateIntegrationPointInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.systemName || input.systemName.trim().length === 0) {
    errors.push({ field: 'systemName', message: 'System name is required.' })
  }

  if (!input.direction) {
    errors.push({ field: 'direction', message: 'Direction is required.' })
  } else if (!VALID_DIRECTIONS.includes(input.direction)) {
    errors.push({ field: 'direction', message: `Invalid direction: ${input.direction}` })
  }

  if (!input.criticality) {
    errors.push({ field: 'criticality', message: 'Criticality is required.' })
  } else if (!VALID_CRITICALITIES.includes(input.criticality)) {
    errors.push({ field: 'criticality', message: `Invalid criticality: ${input.criticality}` })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required.' })
  }

  if (!input.status) {
    errors.push({ field: 'status', message: 'Status is required.' })
  } else if (!VALID_STATUSES.includes(input.status)) {
    errors.push({ field: 'status', message: `Invalid status: ${input.status}` })
  }

  return errors
}
