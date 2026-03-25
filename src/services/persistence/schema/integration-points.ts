import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const integrationPoints = sqliteTable('integration_points', {
  id: text('id').primaryKey(),
  scopeId: text('scope_id').notNull(),
  systemName: text('system_name').notNull(),
  direction: text('direction').notNull(),
  protocol: text('protocol').notNull().default(''),
  dataClassification: text('data_classification').notNull().default(''),
  owner: text('owner').notNull().default(''),
  sla: text('sla').notNull().default(''),
  criticality: text('criticality').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull(),
  linkedRiskIds: text('linked_risk_ids').notNull().default('[]'),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
