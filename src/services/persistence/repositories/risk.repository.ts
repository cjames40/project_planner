import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { risks } from '../schema'
import type { Risk, CreateRiskInput, UpdateRiskInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const riskRepository = {
  async listByPlanId(planId: string): Promise<Risk[]> {
    const db = getDatabase()
    const rows = db.select().from(risks).where(eq(risks.planId, planId)).all()
    return rows.map(mapRow)
  },

  async getById(id: string): Promise<Risk> {
    const db = getDatabase()
    const row = db.select().from(risks).where(eq(risks.id, id)).get()
    if (!row) throw new NotFoundError('Risk', id)
    return mapRow(row)
  },

  async create(planId: string, input: CreateRiskInput): Promise<Risk> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      planId,
      title: input.title,
      description: input.description,
      category: input.category,
      likelihood: input.likelihood,
      impact: input.impact,
      status: 'open' as const,
      mitigationStrategy: input.mitigationStrategy ?? '',
      mitigationStatus: '',
      contingencyPlan: input.contingencyPlan ?? '',
      owner: input.owner ?? '',
      reviewDate: input.reviewDate ?? '',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      linkedConstraintIds: '[]',
      linkedIntegrationPointIds: '[]',
      linkedNFRIds: '[]',
      linkedADRIds: '[]',
      linkedOpportunityIds: '[]',
      linkedStakeholderIds: '[]',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(risks).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateRiskInput): Promise<Risk> {
    const db = getDatabase()
    const existing = db.select().from(risks).where(eq(risks.id, id)).get()
    if (!existing) throw new NotFoundError('Risk', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.title !== undefined) updates.title = input.title
    if (input.description !== undefined) updates.description = input.description
    if (input.category !== undefined) updates.category = input.category
    if (input.likelihood !== undefined) updates.likelihood = input.likelihood
    if (input.impact !== undefined) updates.impact = input.impact
    if (input.status !== undefined) updates.status = input.status
    if (input.mitigationStrategy !== undefined) updates.mitigationStrategy = input.mitigationStrategy
    if (input.mitigationStatus !== undefined) updates.mitigationStatus = input.mitigationStatus
    if (input.contingencyPlan !== undefined) updates.contingencyPlan = input.contingencyPlan
    if (input.owner !== undefined) updates.owner = input.owner
    if (input.reviewDate !== undefined) updates.reviewDate = input.reviewDate
    if (input.linkedConstraintIds !== undefined) updates.linkedConstraintIds = JSON.stringify(input.linkedConstraintIds)
    if (input.linkedIntegrationPointIds !== undefined) updates.linkedIntegrationPointIds = JSON.stringify(input.linkedIntegrationPointIds)
    if (input.linkedNFRIds !== undefined) updates.linkedNFRIds = JSON.stringify(input.linkedNFRIds)
    if (input.linkedADRIds !== undefined) updates.linkedADRIds = JSON.stringify(input.linkedADRIds)
    if (input.linkedOpportunityIds !== undefined) updates.linkedOpportunityIds = JSON.stringify(input.linkedOpportunityIds)
    if (input.linkedStakeholderIds !== undefined) updates.linkedStakeholderIds = JSON.stringify(input.linkedStakeholderIds)

    db.update(risks).set(updates).where(eq(risks.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(risks).where(eq(risks.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof risks.$inferSelect): Risk {
  return {
    id: row.id,
    planId: row.planId,
    title: row.title,
    description: row.description,
    category: row.category as Risk['category'],
    likelihood: row.likelihood as Risk['likelihood'],
    impact: row.impact as Risk['impact'],
    status: row.status as Risk['status'],
    mitigationStrategy: row.mitigationStrategy,
    mitigationStatus: (row.mitigationStatus || '') as Risk['mitigationStatus'],
    contingencyPlan: row.contingencyPlan,
    owner: row.owner,
    reviewDate: row.reviewDate,
    createdVia: row.createdVia as Risk['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    linkedConstraintIds: JSON.parse(row.linkedConstraintIds),
    linkedIntegrationPointIds: JSON.parse(row.linkedIntegrationPointIds),
    linkedNFRIds: JSON.parse(row.linkedNFRIds),
    linkedADRIds: JSON.parse(row.linkedADRIds),
    linkedOpportunityIds: JSON.parse(row.linkedOpportunityIds),
    linkedStakeholderIds: JSON.parse(row.linkedStakeholderIds),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
