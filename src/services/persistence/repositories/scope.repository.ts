import { eq } from 'drizzle-orm'
import { getDatabase, persistDatabase } from '../database'
import { scopes } from '../schema'
import type { Scope, UpdateScopeInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const scopeRepository = {
  async getByPlanId(planId: string): Promise<Scope | null> {
    const db = getDatabase()
    const row = db.select().from(scopes).where(eq(scopes.planId, planId)).get()
    if (!row) return null
    return mapRow(row)
  },

  async update(planId: string, input: UpdateScopeInput): Promise<Scope> {
    const db = getDatabase()
    const existing = db.select().from(scopes).where(eq(scopes.planId, planId)).get()
    if (!existing) throw new NotFoundError('Scope', planId)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.problemStatement !== undefined) updates.problemStatement = input.problemStatement
    if (input.solutionSummary !== undefined) updates.solutionSummary = input.solutionSummary
    if (input.assumptions !== undefined) updates.assumptions = JSON.stringify(input.assumptions)

    db.update(scopes).set(updates).where(eq(scopes.planId, planId)).run()
    persistDatabase()

    const updated = db.select().from(scopes).where(eq(scopes.planId, planId)).get()
    return mapRow(updated!)
  },
}

function mapRow(row: typeof scopes.$inferSelect): Scope {
  return {
    id: row.id,
    planId: row.planId,
    problemStatement: row.problemStatement,
    solutionSummary: row.solutionSummary,
    assumptions: JSON.parse(row.assumptions),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
