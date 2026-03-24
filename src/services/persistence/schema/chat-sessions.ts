import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const chatSessions = sqliteTable('chat_sessions', {
  id: text('id').primaryKey(),
  planId: text('plan_id').notNull(),
  startedAt: text('started_at').notNull(),
  lastMessageAt: text('last_message_at').notNull(),
})

export const chatMessages = sqliteTable('chat_messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  timestamp: text('timestamp').notNull(),
  extractedElements: text('extracted_elements').notNull().default('[]'), // JSON array
  extractionStatus: text('extraction_status').notNull().default(''),
})
