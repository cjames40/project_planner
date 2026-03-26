import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { technologyChoices } from '../schema'
import type { TechnologyChoice, CreateTechChoiceInput, UpdateTechChoiceInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const techChoiceRepository = {
  async listByApproachId(approachId: string): Promise<TechnologyChoice[]> {
    const db = getDatabase()
    const rows = db.select().from(technologyChoices).where(eq(technologyChoices.approachId, approachId)).all()
    return rows.map(mapRow)
  },

  async getById(id: string): Promise<TechnologyChoice> {
    const db = getDatabase()
    const row = db.select().from(technologyChoices).where(eq(technologyChoices.id, id)).get()
    if (!row) throw new NotFoundError('TechnologyChoice', id)
    return mapRow(row)
  },

  async create(approachId: string, input: CreateTechChoiceInput): Promise<TechnologyChoice> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      approachId,
      category: input.category,
      name: input.name,
      rationale: input.rationale,
      alternativesConsidered: JSON.stringify(input.alternativesConsidered ?? []),
      linkedADRId: '',
      linkedConstraintIds: '[]',
      linkedNFRIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(technologyChoices).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateTechChoiceInput): Promise<TechnologyChoice> {
    const db = getDatabase()
    const existing = db.select().from(technologyChoices).where(eq(technologyChoices.id, id)).get()
    if (!existing) throw new NotFoundError('TechnologyChoice', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.category !== undefined) updates.category = input.category
    if (input.name !== undefined) updates.name = input.name
    if (input.rationale !== undefined) updates.rationale = input.rationale
    if (input.alternativesConsidered !== undefined) updates.alternativesConsidered = JSON.stringify(input.alternativesConsidered)
    if (input.linkedADRId !== undefined) updates.linkedADRId = input.linkedADRId
    if (input.linkedConstraintIds !== undefined) updates.linkedConstraintIds = JSON.stringify(input.linkedConstraintIds)
    if (input.linkedNFRIds !== undefined) updates.linkedNFRIds = JSON.stringify(input.linkedNFRIds)

    db.update(technologyChoices).set(updates).where(eq(technologyChoices.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(technologyChoices).where(eq(technologyChoices.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof technologyChoices.$inferSelect): TechnologyChoice {
  return {
    id: row.id,
    approachId: row.approachId,
    category: row.category as TechnologyChoice['category'],
    name: row.name,
    rationale: row.rationale,
    alternativesConsidered: JSON.parse(row.alternativesConsidered),
    linkedADRId: row.linkedADRId,
    linkedConstraintIds: JSON.parse(row.linkedConstraintIds),
    linkedNFRIds: JSON.parse(row.linkedNFRIds),
    createdVia: row.createdVia as TechnologyChoice['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
