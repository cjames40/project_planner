import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const approaches = sqliteTable('approaches', {
  id: text('id').primaryKey(),
  planId: text('plan_id').notNull(),
  strategySummary: text('strategy_summary').notNull().default(''),
  architecturalStyle: text('architectural_style').notNull().default('tbd'),
  architecturalStyleRationale: text('architectural_style_rationale').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
