import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const opportunities = sqliteTable('opportunities', {
  id: text('id').primaryKey(),
  planId: text('plan_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  effortEstimate: text('effort_estimate').notNull().default(''),
  valueStatement: text('value_statement').notNull(),
  status: text('status').notNull().default('identified'),
  statusRationale: text('status_rationale').notNull().default(''),
  prerequisites: text('prerequisites').notNull().default(''),
  linkedRiskIds: text('linked_risk_ids').notNull().default('[]'),
  linkedStakeholderIds: text('linked_stakeholder_ids').notNull().default('[]'),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
