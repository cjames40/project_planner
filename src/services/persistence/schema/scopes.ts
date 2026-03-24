import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const scopes = sqliteTable('scopes', {
  id: text('id').primaryKey(),
  planId: text('plan_id').notNull(),
  problemStatement: text('problem_statement').notNull().default(''),
  solutionSummary: text('solution_summary').notNull().default(''),
  assumptions: text('assumptions').notNull().default('[]'), // JSON array
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
