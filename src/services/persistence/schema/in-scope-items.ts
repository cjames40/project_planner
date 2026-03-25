import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const inScopeItems = sqliteTable('in_scope_items', {
  id: text('id').primaryKey(),
  scopeId: text('scope_id').notNull(),
  description: text('description').notNull(),
  rationale: text('rationale').notNull().default(''),
  category: text('category').notNull().default(''),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
