import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const technologyChoices = sqliteTable('technology_choices', {
  id: text('id').primaryKey(),
  approachId: text('approach_id').notNull(),
  category: text('category').notNull(),
  name: text('name').notNull(),
  rationale: text('rationale').notNull(),
  alternativesConsidered: text('alternatives_considered').notNull().default('[]'),
  linkedADRId: text('linked_adr_id').notNull().default(''),
  linkedConstraintIds: text('linked_constraint_ids').notNull().default('[]'),
  linkedNFRIds: text('linked_nfr_ids').notNull().default('[]'),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
