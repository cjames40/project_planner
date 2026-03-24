import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const risks = sqliteTable('risks', {
  id: text('id').primaryKey(),
  planId: text('plan_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  likelihood: text('likelihood').notNull(),
  impact: text('impact').notNull(),
  status: text('status').notNull().default('open'),
  mitigationStrategy: text('mitigation_strategy').notNull().default(''),
  mitigationStatus: text('mitigation_status').notNull().default(''),
  contingencyPlan: text('contingency_plan').notNull().default(''),
  owner: text('owner').notNull().default(''),
  reviewDate: text('review_date').notNull().default(''),
  createdVia: text('created_via').notNull().default('manual'),
  tags: text('tags').notNull().default('[]'), // JSON array
  notes: text('notes').notNull().default(''),
  linkedConstraintIds: text('linked_constraint_ids').notNull().default('[]'),
  linkedIntegrationPointIds: text('linked_integration_point_ids').notNull().default('[]'),
  linkedNFRIds: text('linked_nfr_ids').notNull().default('[]'),
  linkedADRIds: text('linked_adr_ids').notNull().default('[]'),
  linkedOpportunityIds: text('linked_opportunity_ids').notNull().default('[]'),
  linkedStakeholderIds: text('linked_stakeholder_ids').notNull().default('[]'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
