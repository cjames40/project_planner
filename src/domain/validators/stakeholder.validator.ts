import type { CreateStakeholderInput } from '../types'
import type { FieldError } from '../errors'

const VALID_TYPES = ['sponsor', 'decision-maker', 'subject-matter-expert', 'end-user', 'impacted-party', 'regulator'] as const
const VALID_LEVELS = ['high', 'medium', 'low'] as const

export function validateCreateStakeholder(input: CreateStakeholderInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Stakeholder name is required.' })
  }

  if (!input.role || input.role.trim().length === 0) {
    errors.push({ field: 'role', message: 'Role is required.' })
  }

  if (!input.type) {
    errors.push({ field: 'type', message: 'Stakeholder type is required.' })
  } else if (!VALID_TYPES.includes(input.type)) {
    errors.push({ field: 'type', message: `Invalid stakeholder type: ${input.type}` })
  }

  if (!input.primaryConcern || input.primaryConcern.trim().length === 0) {
    errors.push({ field: 'primaryConcern', message: 'Primary concern is required.' })
  }

  if (!input.influenceLevel) {
    errors.push({ field: 'influenceLevel', message: 'Influence level is required.' })
  } else if (!VALID_LEVELS.includes(input.influenceLevel)) {
    errors.push({ field: 'influenceLevel', message: `Invalid influence level: ${input.influenceLevel}` })
  }

  if (!input.interestLevel) {
    errors.push({ field: 'interestLevel', message: 'Interest level is required.' })
  } else if (!VALID_LEVELS.includes(input.interestLevel)) {
    errors.push({ field: 'interestLevel', message: `Invalid interest level: ${input.interestLevel}` })
  }

  return errors
}
