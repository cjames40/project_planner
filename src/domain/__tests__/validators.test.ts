import { describe, it, expect } from 'vitest'
import { validateCreateProject } from '../validators/project.validator'
import { validateCreateRisk } from '../validators/risk.validator'

describe('validateCreateProject', () => {
  const validInput = {
    name: 'Test Project',
    projectType: 'greenfield' as const,
    description: 'A test project',
  }

  it('returns no errors for valid input', () => {
    expect(validateCreateProject(validInput)).toEqual([])
  })

  it('requires name', () => {
    const errors = validateCreateProject({ ...validInput, name: '' })
    expect(errors).toEqual([{ field: 'name', message: 'Project name is required.' }])
  })

  it('rejects name over 120 chars', () => {
    const errors = validateCreateProject({ ...validInput, name: 'x'.repeat(121) })
    expect(errors).toEqual([{ field: 'name', message: 'Project name must be 120 characters or fewer.' }])
  })

  it('requires description', () => {
    const errors = validateCreateProject({ ...validInput, description: '' })
    expect(errors).toEqual([{ field: 'description', message: 'Description is required.' }])
  })

  it('rejects invalid project type', () => {
    const errors = validateCreateProject({ ...validInput, projectType: 'invalid' as never })
    expect(errors.find((e) => e.field === 'projectType')).toBeTruthy()
  })
})

describe('validateCreateRisk', () => {
  const validInput = {
    title: 'Database failure',
    description: 'The database might go down',
    category: 'technical' as const,
    likelihood: 'medium' as const,
    impact: 'major' as const,
    createdVia: 'manual' as const,
  }

  it('returns no errors for valid input', () => {
    expect(validateCreateRisk(validInput)).toEqual([])
  })

  it('requires title', () => {
    const errors = validateCreateRisk({ ...validInput, title: '' })
    expect(errors.find((e) => e.field === 'title')).toBeTruthy()
  })

  it('rejects invalid category', () => {
    const errors = validateCreateRisk({ ...validInput, category: 'invalid' as never })
    expect(errors.find((e) => e.field === 'category')).toBeTruthy()
  })

  it('rejects invalid likelihood', () => {
    const errors = validateCreateRisk({ ...validInput, likelihood: 'invalid' as never })
    expect(errors.find((e) => e.field === 'likelihood')).toBeTruthy()
  })

  it('rejects invalid impact', () => {
    const errors = validateCreateRisk({ ...validInput, impact: 'invalid' as never })
    expect(errors.find((e) => e.field === 'impact')).toBeTruthy()
  })
})
