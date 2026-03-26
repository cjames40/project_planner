import type { CreateNFRInput } from '../types'
import type { FieldError } from '../errors'

const VALID_CATEGORIES = ['performance', 'availability', 'scalability', 'security', 'maintainability', 'observability', 'portability', 'compliance', 'cost', 'usability', 'disaster-recovery', 'other'] as const
const VALID_PRIORITIES = ['must', 'should', 'could'] as const

export function validateCreateNFR(input: CreateNFRInput): FieldError[] {
  const errors: FieldError[] = []

  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'NFR title is required.' })
  }

  if (!input.category) {
    errors.push({ field: 'category', message: 'NFR category is required.' })
  } else if (!VALID_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: `Invalid NFR category: ${input.category}` })
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required.' })
  }

  if (!input.target || input.target.trim().length === 0) {
    errors.push({ field: 'target', message: 'Target is required.' })
  }

  if (!input.rationale || input.rationale.trim().length === 0) {
    errors.push({ field: 'rationale', message: 'Rationale is required.' })
  }

  if (!input.priority) {
    errors.push({ field: 'priority', message: 'Priority is required.' })
  } else if (!VALID_PRIORITIES.includes(input.priority)) {
    errors.push({ field: 'priority', message: `Invalid priority: ${input.priority}` })
  }

  return errors
}
