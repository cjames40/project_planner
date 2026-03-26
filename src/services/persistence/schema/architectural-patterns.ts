import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const architecturalPatterns = sqliteTable('architectural_patterns', {
  id: text('id').primaryKey(),
  approachId: text('approach_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  applicableComponents: text('applicable_components').notNull().default('[]'),
  tradeoffs: text('tradeoffs').notNull(),
  alternatives: text('alternatives').notNull().default(''),
  linkedADRIds: text('linked_adr_ids').notNull().default('[]'),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
