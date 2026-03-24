import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  lastChatSessionId: text('last_chat_session_id').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
