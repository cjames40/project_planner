import { eq } from 'drizzle-orm'
import { getDatabase, persistDatabase } from '../database'
import { approaches } from '../schema'
import type { Approach, UpdateApproachInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const approachRepository = {
  async getByPlanId(planId: string): Promise<Approach | null> {
    const db = getDatabase()
    const row = db.select().from(approaches).where(eq(approaches.planId, planId)).get()
    if (!row) return null
    return mapRow(row)
  },

  async update(planId: string, input: UpdateApproachInput): Promise<Approach> {
    const db = getDatabase()
    const existing = db.select().from(approaches).where(eq(approaches.planId, planId)).get()
    if (!existing) throw new NotFoundError('Approach', planId)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.strategySummary !== undefined) updates.strategySummary = input.strategySummary
    if (input.architecturalStyle !== undefined) updates.architecturalStyle = input.architecturalStyle
    if (input.architecturalStyleRationale !== undefined) updates.architecturalStyleRationale = input.architecturalStyleRationale

    db.update(approaches).set(updates).where(eq(approaches.planId, planId)).run()
    persistDatabase()

    const row = db.select().from(approaches).where(eq(approaches.planId, planId)).get()
    return mapRow(row!)
  },
}

function mapRow(row: typeof approaches.$inferSelect): Approach {
  return {
    id: row.id,
    planId: row.planId,
    strategySummary: row.strategySummary,
    architecturalStyle: row.architecturalStyle as Approach['architecturalStyle'],
    architecturalStyleRationale: row.architecturalStyleRationale,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
