import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const stakeholders = sqliteTable('stakeholders', {
  id: text('id').primaryKey(),
  scopeId: text('scope_id').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  type: text('type').notNull(),
  primaryConcern: text('primary_concern').notNull(),
  influenceLevel: text('influence_level').notNull(),
  interestLevel: text('interest_level').notNull(),
  communicationNeeds: text('communication_needs').notNull().default(''),
  linkedRiskIds: text('linked_risk_ids').notNull().default('[]'),
  linkedConstraintIds: text('linked_constraint_ids').notNull().default('[]'),
  linkedADRIds: text('linked_adr_ids').notNull().default('[]'),
  linkedOpportunityIds: text('linked_opportunity_ids').notNull().default('[]'),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
