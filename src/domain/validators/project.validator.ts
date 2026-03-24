import type { CreateProjectInput } from '../types'
import type { FieldError } from '../errors'

const VALID_PROJECT_TYPES = ['greenfield', 'migration', 'modernization', 'integration', 'platform', 'other'] as const

export function validateCreateProject(input: CreateProjectInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Project name is required.' })
  } else if (input.name.length > 120) {
    errors.push({ field: 'name', message: 'Project name must be 120 characters or fewer.' })
  }

  if (!input.projectType) {
    errors.push({ field: 'projectType', message: 'Project type is required.' })
  } else if (!VALID_PROJECT_TYPES.includes(input.projectType)) {
    errors.push({ field: 'projectType', message: `Invalid project type: ${input.projectType}` })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required.' })
  } else if (input.description.length > 500) {
    errors.push({ field: 'description', message: 'Description must be 500 characters or fewer.' })
  }

  return errors
}
