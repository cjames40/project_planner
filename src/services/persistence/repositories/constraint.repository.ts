import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { constraints } from '../schema'
import type { Constraint, CreateConstraintInput, UpdateConstraintInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const constraintRepository = {
  async listByScopeId(scopeId: string): Promise<Constraint[]> {
    const db = getDatabase()
    const rows = db.select().from(constraints).where(eq(constraints.scopeId, scopeId)).all()
    return rows.map(mapRow)
  },

  async create(scopeId: string, input: CreateConstraintInput): Promise<Constraint> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      scopeId,
      title: input.title,
      description: input.description,
      type: input.type,
      source: input.source,
      isNegotiable: String(input.isNegotiable),
      impact: input.impact,
      linkedRiskIds: '[]',
      linkedADRIds: '[]',
      linkedStakeholderIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }
    db.insert(constraints).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateConstraintInput): Promise<Constraint> {
    const db = getDatabase()
    const existing = db.select().from(constraints).where(eq(constraints.id, id)).get()
    if (!existing) throw new NotFoundError('Constraint', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.title !== undefined) updates.title = input.title
    if (input.description !== undefined) updates.description = input.description
    if (input.type !== undefined) updates.type = input.type
    if (input.source !== undefined) updates.source = input.source
    if (input.isNegotiable !== undefined) updates.isNegotiable = String(input.isNegotiable)
    if (input.impact !== undefined) updates.impact = input.impact
    if (input.linkedRiskIds !== undefined) updates.linkedRiskIds = JSON.stringify(input.linkedRiskIds)
    if (input.linkedADRIds !== undefined) updates.linkedADRIds = JSON.stringify(input.linkedADRIds)
    if (input.linkedStakeholderIds !== undefined) updates.linkedStakeholderIds = JSON.stringify(input.linkedStakeholderIds)

    db.update(constraints).set(updates).where(eq(constraints.id, id)).run()
    persistDatabase()

    const updated = db.select().from(constraints).where(eq(constraints.id, id)).get()
    return mapRow(updated!)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(constraints).where(eq(constraints.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof constraints.$inferSelect): Constraint {
  return {
    id: row.id,
    scopeId: row.scopeId,
    title: row.title,
    description: row.description,
    type: row.type as Constraint['type'],
    source: row.source,
    isNegotiable: row.isNegotiable === 'true',
    impact: row.impact,
    linkedRiskIds: JSON.parse(row.linkedRiskIds),
    linkedADRIds: JSON.parse(row.linkedADRIds),
    linkedStakeholderIds: JSON.parse(row.linkedStakeholderIds),
    createdVia: row.createdVia as Constraint['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
