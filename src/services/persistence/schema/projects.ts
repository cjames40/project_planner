import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  projectType: text('project_type').notNull(),
  status: text('status').notNull().default('active'),
  clientOrOrg: text('client_or_org').notNull().default(''),
  startDate: text('start_date').notNull().default(''),
  targetDate: text('target_date').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
