import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { architecturalPatterns } from '../schema'
import type { ArchitecturalPattern, CreatePatternInput, UpdatePatternInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const patternRepository = {
  async listByApproachId(approachId: string): Promise<ArchitecturalPattern[]> {
    const db = getDatabase()
    const rows = db.select().from(architecturalPatterns).where(eq(architecturalPatterns.approachId, approachId)).all()
    return rows.map(mapRow)
  },

  async getById(id: string): Promise<ArchitecturalPattern> {
    const db = getDatabase()
    const row = db.select().from(architecturalPatterns).where(eq(architecturalPatterns.id, id)).get()
    if (!row) throw new NotFoundError('ArchitecturalPattern', id)
    return mapRow(row)
  },

  async create(approachId: string, input: CreatePatternInput): Promise<ArchitecturalPattern> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      approachId,
      name: input.name,
      description: input.description,
      applicableComponents: JSON.stringify(input.applicableComponents ?? []),
      tradeoffs: input.tradeoffs,
      alternatives: input.alternatives ?? '',
      linkedADRIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(architecturalPatterns).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdatePatternInput): Promise<ArchitecturalPattern> {
    const db = getDatabase()
    const existing = db.select().from(architecturalPatterns).where(eq(architecturalPatterns.id, id)).get()
    if (!existing) throw new NotFoundError('ArchitecturalPattern', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.name !== undefined) updates.name = input.name
    if (input.description !== undefined) updates.description = input.description
    if (input.tradeoffs !== undefined) updates.tradeoffs = input.tradeoffs
    if (input.applicableComponents !== undefined) updates.applicableComponents = JSON.stringify(input.applicableComponents)
    if (input.alternatives !== undefined) updates.alternatives = input.alternatives
    if (input.linkedADRIds !== undefined) updates.linkedADRIds = JSON.stringify(input.linkedADRIds)

    db.update(architecturalPatterns).set(updates).where(eq(architecturalPatterns.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(architecturalPatterns).where(eq(architecturalPatterns.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof architecturalPatterns.$inferSelect): ArchitecturalPattern {
  return {
    id: row.id,
    approachId: row.approachId,
    name: row.name,
    description: row.description,
    applicableComponents: JSON.parse(row.applicableComponents),
    tradeoffs: row.tradeoffs,
    alternatives: row.alternatives,
    linkedADRIds: JSON.parse(row.linkedADRIds),
    createdVia: row.createdVia as ArchitecturalPattern['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
