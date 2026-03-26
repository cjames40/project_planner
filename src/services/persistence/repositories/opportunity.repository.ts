import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { opportunities } from '../schema'
import type { Opportunity, CreateOpportunityInput, UpdateOpportunityInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const opportunityRepository = {
  async listByPlanId(planId: string): Promise<Opportunity[]> {
    const db = getDatabase()
    const rows = db.select().from(opportunities).where(eq(opportunities.planId, planId)).all()
    return rows.map(mapRow)
  },

  async getById(id: string): Promise<Opportunity> {
    const db = getDatabase()
    const row = db.select().from(opportunities).where(eq(opportunities.id, id)).get()
    if (!row) throw new NotFoundError('Opportunity', id)
    return mapRow(row)
  },

  async create(planId: string, input: CreateOpportunityInput): Promise<Opportunity> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      planId,
      title: input.title,
      description: input.description,
      category: input.category,
      effortEstimate: input.effortEstimate ?? '',
      valueStatement: input.valueStatement,
      status: 'identified' as const,
      statusRationale: '',
      prerequisites: input.prerequisites ?? '',
      linkedRiskIds: '[]',
      linkedStakeholderIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(opportunities).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateOpportunityInput): Promise<Opportunity> {
    const db = getDatabase()
    const existing = db.select().from(opportunities).where(eq(opportunities.id, id)).get()
    if (!existing) throw new NotFoundError('Opportunity', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.title !== undefined) updates.title = input.title
    if (input.description !== undefined) updates.description = input.description
    if (input.category !== undefined) updates.category = input.category
    if (input.effortEstimate !== undefined) updates.effortEstimate = input.effortEstimate
    if (input.valueStatement !== undefined) updates.valueStatement = input.valueStatement
    if (input.status !== undefined) updates.status = input.status
    if (input.statusRationale !== undefined) updates.statusRationale = input.statusRationale
    if (input.prerequisites !== undefined) updates.prerequisites = input.prerequisites
    if (input.linkedRiskIds !== undefined) updates.linkedRiskIds = JSON.stringify(input.linkedRiskIds)
    if (input.linkedStakeholderIds !== undefined) updates.linkedStakeholderIds = JSON.stringify(input.linkedStakeholderIds)

    db.update(opportunities).set(updates).where(eq(opportunities.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(opportunities).where(eq(opportunities.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof opportunities.$inferSelect): Opportunity {
  return {
    id: row.id,
    planId: row.planId,
    title: row.title,
    description: row.description,
    category: row.category as Opportunity['category'],
    effortEstimate: (row.effortEstimate || '') as Opportunity['effortEstimate'],
    valueStatement: row.valueStatement,
    status: row.status as Opportunity['status'],
    statusRationale: row.statusRationale,
    prerequisites: row.prerequisites,
    linkedRiskIds: JSON.parse(row.linkedRiskIds),
    linkedStakeholderIds: JSON.parse(row.linkedStakeholderIds),
    createdVia: row.createdVia as Opportunity['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
