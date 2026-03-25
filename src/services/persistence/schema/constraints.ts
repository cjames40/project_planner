import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const constraints = sqliteTable('constraints', {
  id: text('id').primaryKey(),
  scopeId: text('scope_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  source: text('source').notNull(),
  isNegotiable: text('is_negotiable').notNull(),
  impact: text('impact').notNull(),
  linkedRiskIds: text('linked_risk_ids').notNull().default('[]'),
  linkedADRIds: text('linked_adr_ids').notNull().default('[]'),
  linkedStakeholderIds: text('linked_stakeholder_ids').notNull().default('[]'),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
