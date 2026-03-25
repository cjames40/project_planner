import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { outOfScopeItems } from '../schema'
import type { OutOfScopeItem, CreateOutOfScopeItemInput, UpdateOutOfScopeItemInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const outOfScopeItemRepository = {
  async listByScopeId(scopeId: string): Promise<OutOfScopeItem[]> {
    const db = getDatabase()
    const rows = db.select().from(outOfScopeItems).where(eq(outOfScopeItems.scopeId, scopeId)).all()
    return rows.map(mapRow)
  },

  async create(scopeId: string, input: CreateOutOfScopeItemInput): Promise<OutOfScopeItem> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      scopeId,
      description: input.description,
      rationale: input.rationale,
      deferredTo: input.deferredTo ?? '',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }
    db.insert(outOfScopeItems).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateOutOfScopeItemInput): Promise<OutOfScopeItem> {
    const db = getDatabase()
    const existing = db.select().from(outOfScopeItems).where(eq(outOfScopeItems.id, id)).get()
    if (!existing) throw new NotFoundError('OutOfScopeItem', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.description !== undefined) updates.description = input.description
    if (input.rationale !== undefined) updates.rationale = input.rationale
    if (input.deferredTo !== undefined) updates.deferredTo = input.deferredTo

    db.update(outOfScopeItems).set(updates).where(eq(outOfScopeItems.id, id)).run()
    persistDatabase()

    const updated = db.select().from(outOfScopeItems).where(eq(outOfScopeItems.id, id)).get()
    return mapRow(updated!)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(outOfScopeItems).where(eq(outOfScopeItems.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof outOfScopeItems.$inferSelect): OutOfScopeItem {
  return {
    id: row.id,
    scopeId: row.scopeId,
    description: row.description,
    rationale: row.rationale,
    deferredTo: row.deferredTo,
    createdVia: row.createdVia as OutOfScopeItem['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
