export interface FieldError {
  field: string
  message: string
}

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(public readonly errors: FieldError[]) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}

export class BusinessRuleError extends Error {
  constructor(
    public readonly rule: string,
    message: string,
  ) {
    super(message)
    this.name = 'BusinessRuleError'
  }
}
