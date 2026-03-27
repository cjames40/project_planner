import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { adrs } from '../schema'
import type { ADR, CreateADRInput, UpdateADRInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const adrRepository = {
  async listByPlanId(planId: string): Promise<ADR[]> {
    const db = getDatabase()
    const rows = db.select().from(adrs).where(eq(adrs.planId, planId)).all()
    return rows.map(mapRow).sort((a, b) => a.sequenceNumber - b.sequenceNumber)
  },

  async getById(id: string): Promise<ADR> {
    const db = getDatabase()
    const row = db.select().from(adrs).where(eq(adrs.id, id)).get()
    if (!row) throw new NotFoundError('ADR', id)
    return mapRow(row)
  },

  async create(planId: string, input: CreateADRInput): Promise<ADR> {
    const db = getDatabase()
    const ts = now()

    // Auto-increment sequence number per plan
    const existing = db.select().from(adrs).where(eq(adrs.planId, planId)).all()
    const maxSeq = existing.reduce((max, r) => Math.max(max, r.sequenceNumber), 0)

    const row = {
      id: uuidv4(),
      planId,
      sequenceNumber: maxSeq + 1,
      title: input.title,
      status: 'draft' as const,
      decisionDate: '',
      deciders: '[]',
      context: input.context,
      problemStatement: input.problemStatement,
      driverType: input.driverType,
      options: JSON.stringify(input.options ?? []),
      decisionOutcome: input.decisionOutcome ?? '',
      decisionRationale: input.decisionRationale ?? '',
      positiveConsequences: '[]',
      negativeConsequences: '[]',
      reviewTriggers: '[]',
      supersededById: '',
      supersedes: '[]',
      linkedConstraintIds: '[]',
      linkedNFRIds: '[]',
      linkedRiskIds: '[]',
      linkedOpportunityIds: '[]',
      linkedStakeholderIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(adrs).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateADRInput): Promise<ADR> {
    const db = getDatabase()
    const existing = db.select().from(adrs).where(eq(adrs.id, id)).get()
    if (!existing) throw new NotFoundError('ADR', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.title !== undefined) updates.title = input.title
    if (input.status !== undefined) updates.status = input.status
    if (input.decisionDate !== undefined) updates.decisionDate = input.decisionDate
    if (input.deciders !== undefined) updates.deciders = JSON.stringify(input.deciders)
    if (input.context !== undefined) updates.context = input.context
    if (input.problemStatement !== undefined) updates.problemStatement = input.problemStatement
    if (input.driverType !== undefined) updates.driverType = input.driverType
    if (input.options !== undefined) updates.options = JSON.stringify(input.options)
    if (input.decisionOutcome !== undefined) updates.decisionOutcome = input.decisionOutcome
    if (input.decisionRationale !== undefined) updates.decisionRationale = input.decisionRationale
    if (input.positiveConsequences !== undefined) updates.positiveConsequences = JSON.stringify(input.positiveConsequences)
    if (input.negativeConsequences !== undefined) updates.negativeConsequences = JSON.stringify(input.negativeConsequences)
    if (input.reviewTriggers !== undefined) updates.reviewTriggers = JSON.stringify(input.reviewTriggers)
    if (input.supersededById !== undefined) updates.supersededById = input.supersededById
    if (input.supersedes !== undefined) updates.supersedes = JSON.stringify(input.supersedes)
    if (input.linkedConstraintIds !== undefined) updates.linkedConstraintIds = JSON.stringify(input.linkedConstraintIds)
    if (input.linkedNFRIds !== undefined) updates.linkedNFRIds = JSON.stringify(input.linkedNFRIds)
    if (input.linkedRiskIds !== undefined) updates.linkedRiskIds = JSON.stringify(input.linkedRiskIds)
    if (input.linkedOpportunityIds !== undefined) updates.linkedOpportunityIds = JSON.stringify(input.linkedOpportunityIds)
    if (input.linkedStakeholderIds !== undefined) updates.linkedStakeholderIds = JSON.stringify(input.linkedStakeholderIds)

    db.update(adrs).set(updates).where(eq(adrs.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(adrs).where(eq(adrs.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof adrs.$inferSelect): ADR {
  return {
    id: row.id,
    planId: row.planId,
    sequenceNumber: row.sequenceNumber,
    title: row.title,
    status: row.status as ADR['status'],
    decisionDate: row.decisionDate,
    deciders: JSON.parse(row.deciders),
    context: row.context,
    problemStatement: row.problemStatement,
    driverType: row.driverType as ADR['driverType'],
    options: JSON.parse(row.options),
    decisionOutcome: row.decisionOutcome,
    decisionRationale: row.decisionRationale,
    positiveConsequences: JSON.parse(row.positiveConsequences),
    negativeConsequences: JSON.parse(row.negativeConsequences),
    reviewTriggers: JSON.parse(row.reviewTriggers),
    supersededById: row.supersededById,
    supersedes: JSON.parse(row.supersedes),
    linkedConstraintIds: JSON.parse(row.linkedConstraintIds),
    linkedNFRIds: JSON.parse(row.linkedNFRIds),
    linkedRiskIds: JSON.parse(row.linkedRiskIds),
    linkedOpportunityIds: JSON.parse(row.linkedOpportunityIds),
    linkedStakeholderIds: JSON.parse(row.linkedStakeholderIds),
    createdVia: row.createdVia as ADR['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
