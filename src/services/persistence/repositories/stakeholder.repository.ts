import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { stakeholders } from '../schema'
import type { Stakeholder, CreateStakeholderInput, UpdateStakeholderInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const stakeholderRepository = {
  async listByScopeId(scopeId: string): Promise<Stakeholder[]> {
    const db = getDatabase()
    const rows = db.select().from(stakeholders).where(eq(stakeholders.scopeId, scopeId)).all()
    return rows.map(mapRow)
  },

  async create(scopeId: string, input: CreateStakeholderInput): Promise<Stakeholder> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      scopeId,
      name: input.name,
      role: input.role,
      type: input.type,
      primaryConcern: input.primaryConcern,
      influenceLevel: input.influenceLevel,
      interestLevel: input.interestLevel,
      communicationNeeds: input.communicationNeeds ?? '',
      linkedRiskIds: '[]',
      linkedConstraintIds: '[]',
      linkedADRIds: '[]',
      linkedOpportunityIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }
    db.insert(stakeholders).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateStakeholderInput): Promise<Stakeholder> {
    const db = getDatabase()
    const existing = db.select().from(stakeholders).where(eq(stakeholders.id, id)).get()
    if (!existing) throw new NotFoundError('Stakeholder', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.name !== undefined) updates.name = input.name
    if (input.role !== undefined) updates.role = input.role
    if (input.type !== undefined) updates.type = input.type
    if (input.primaryConcern !== undefined) updates.primaryConcern = input.primaryConcern
    if (input.influenceLevel !== undefined) updates.influenceLevel = input.influenceLevel
    if (input.interestLevel !== undefined) updates.interestLevel = input.interestLevel
    if (input.communicationNeeds !== undefined) updates.communicationNeeds = input.communicationNeeds
    if (input.linkedRiskIds !== undefined) updates.linkedRiskIds = JSON.stringify(input.linkedRiskIds)
    if (input.linkedConstraintIds !== undefined) updates.linkedConstraintIds = JSON.stringify(input.linkedConstraintIds)
    if (input.linkedADRIds !== undefined) updates.linkedADRIds = JSON.stringify(input.linkedADRIds)
    if (input.linkedOpportunityIds !== undefined) updates.linkedOpportunityIds = JSON.stringify(input.linkedOpportunityIds)

    db.update(stakeholders).set(updates).where(eq(stakeholders.id, id)).run()
    persistDatabase()

    const updated = db.select().from(stakeholders).where(eq(stakeholders.id, id)).get()
    return mapRow(updated!)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(stakeholders).where(eq(stakeholders.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof stakeholders.$inferSelect): Stakeholder {
  return {
    id: row.id,
    scopeId: row.scopeId,
    name: row.name,
    role: row.role,
    type: row.type as Stakeholder['type'],
    primaryConcern: row.primaryConcern,
    influenceLevel: row.influenceLevel as Stakeholder['influenceLevel'],
    interestLevel: row.interestLevel as Stakeholder['interestLevel'],
    communicationNeeds: row.communicationNeeds,
    linkedRiskIds: JSON.parse(row.linkedRiskIds),
    linkedConstraintIds: JSON.parse(row.linkedConstraintIds),
    linkedADRIds: JSON.parse(row.linkedADRIds),
    linkedOpportunityIds: JSON.parse(row.linkedOpportunityIds),
    createdVia: row.createdVia as Stakeholder['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
