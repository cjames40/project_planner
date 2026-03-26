import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const principles = sqliteTable('principles', {
  id: text('id').primaryKey(),
  approachId: text('approach_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  rationale: text('rationale').notNull().default(''),
  implications: text('implications').notNull().default(''),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
