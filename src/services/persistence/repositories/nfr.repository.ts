import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { nfrs } from '../schema'
import type { NFR, CreateNFRInput, UpdateNFRInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const nfrRepository = {
  async listByApproachId(approachId: string): Promise<NFR[]> {
    const db = getDatabase()
    const rows = db.select().from(nfrs).where(eq(nfrs.approachId, approachId)).all()
    return rows.map(mapRow)
  },

  async getById(id: string): Promise<NFR> {
    const db = getDatabase()
    const row = db.select().from(nfrs).where(eq(nfrs.id, id)).get()
    if (!row) throw new NotFoundError('NFR', id)
    return mapRow(row)
  },

  async create(approachId: string, input: CreateNFRInput): Promise<NFR> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      approachId,
      title: input.title,
      category: input.category,
      description: input.description,
      target: input.target,
      rationale: input.rationale,
      verificationApproach: input.verificationApproach ?? '',
      priority: input.priority,
      linkedRiskIds: '[]',
      linkedConstraintIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(nfrs).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateNFRInput): Promise<NFR> {
    const db = getDatabase()
    const existing = db.select().from(nfrs).where(eq(nfrs.id, id)).get()
    if (!existing) throw new NotFoundError('NFR', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.title !== undefined) updates.title = input.title
    if (input.category !== undefined) updates.category = input.category
    if (input.description !== undefined) updates.description = input.description
    if (input.target !== undefined) updates.target = input.target
    if (input.rationale !== undefined) updates.rationale = input.rationale
    if (input.verificationApproach !== undefined) updates.verificationApproach = input.verificationApproach
    if (input.priority !== undefined) updates.priority = input.priority
    if (input.linkedRiskIds !== undefined) updates.linkedRiskIds = JSON.stringify(input.linkedRiskIds)
    if (input.linkedConstraintIds !== undefined) updates.linkedConstraintIds = JSON.stringify(input.linkedConstraintIds)

    db.update(nfrs).set(updates).where(eq(nfrs.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(nfrs).where(eq(nfrs.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof nfrs.$inferSelect): NFR {
  return {
    id: row.id,
    approachId: row.approachId,
    title: row.title,
    category: row.category as NFR['category'],
    description: row.description,
    target: row.target,
    rationale: row.rationale,
    verificationApproach: row.verificationApproach,
    priority: row.priority as NFR['priority'],
    linkedRiskIds: JSON.parse(row.linkedRiskIds),
    linkedConstraintIds: JSON.parse(row.linkedConstraintIds),
    createdVia: row.createdVia as NFR['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
