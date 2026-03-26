import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const nfrs = sqliteTable('nfrs', {
  id: text('id').primaryKey(),
  approachId: text('approach_id').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  target: text('target').notNull(),
  rationale: text('rationale').notNull(),
  verificationApproach: text('verification_approach').notNull().default(''),
  priority: text('priority').notNull(),
  linkedRiskIds: text('linked_risk_ids').notNull().default('[]'),
  linkedConstraintIds: text('linked_constraint_ids').notNull().default('[]'),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
