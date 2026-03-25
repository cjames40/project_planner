import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { inScopeItems } from '../schema'
import type { InScopeItem, CreateInScopeItemInput, UpdateInScopeItemInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const inScopeItemRepository = {
  async listByScopeId(scopeId: string): Promise<InScopeItem[]> {
    const db = getDatabase()
    const rows = db.select().from(inScopeItems).where(eq(inScopeItems.scopeId, scopeId)).all()
    return rows.map(mapRow)
  },

  async create(scopeId: string, input: CreateInScopeItemInput): Promise<InScopeItem> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      scopeId,
      description: input.description,
      rationale: input.rationale ?? '',
      category: input.category ?? '',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }
    db.insert(inScopeItems).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateInScopeItemInput): Promise<InScopeItem> {
    const db = getDatabase()
    const existing = db.select().from(inScopeItems).where(eq(inScopeItems.id, id)).get()
    if (!existing) throw new NotFoundError('InScopeItem', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.description !== undefined) updates.description = input.description
    if (input.rationale !== undefined) updates.rationale = input.rationale
    if (input.category !== undefined) updates.category = input.category

    db.update(inScopeItems).set(updates).where(eq(inScopeItems.id, id)).run()
    persistDatabase()

    const updated = db.select().from(inScopeItems).where(eq(inScopeItems.id, id)).get()
    return mapRow(updated!)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(inScopeItems).where(eq(inScopeItems.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof inScopeItems.$inferSelect): InScopeItem {
  return {
    id: row.id,
    scopeId: row.scopeId,
    description: row.description,
    rationale: row.rationale,
    category: (row.category || '') as InScopeItem['category'],
    createdVia: row.createdVia as InScopeItem['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
