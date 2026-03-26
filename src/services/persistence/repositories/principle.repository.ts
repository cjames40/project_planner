import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { principles } from '../schema'
import type { Principle, CreatePrincipleInput, UpdatePrincipleInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const principleRepository = {
  async listByApproachId(approachId: string): Promise<Principle[]> {
    const db = getDatabase()
    const rows = db.select().from(principles).where(eq(principles.approachId, approachId)).all()
    return rows.map(mapRow)
  },

  async getById(id: string): Promise<Principle> {
    const db = getDatabase()
    const row = db.select().from(principles).where(eq(principles.id, id)).get()
    if (!row) throw new NotFoundError('Principle', id)
    return mapRow(row)
  },

  async create(approachId: string, input: CreatePrincipleInput): Promise<Principle> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      approachId,
      title: input.title,
      description: input.description,
      rationale: input.rationale ?? '',
      implications: input.implications ?? '',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(principles).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdatePrincipleInput): Promise<Principle> {
    const db = getDatabase()
    const existing = db.select().from(principles).where(eq(principles.id, id)).get()
    if (!existing) throw new NotFoundError('Principle', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.title !== undefined) updates.title = input.title
    if (input.description !== undefined) updates.description = input.description
    if (input.rationale !== undefined) updates.rationale = input.rationale
    if (input.implications !== undefined) updates.implications = input.implications

    db.update(principles).set(updates).where(eq(principles.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(principles).where(eq(principles.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof principles.$inferSelect): Principle {
  return {
    id: row.id,
    approachId: row.approachId,
    title: row.title,
    description: row.description,
    rationale: row.rationale,
    implications: row.implications,
    createdVia: row.createdVia as Principle['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
