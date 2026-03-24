import { eq, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { chatSessions, chatMessages } from '../schema'
import type { ChatSession, ChatMessage, CreateChatMessageInput } from '@/domain/types'

function now(): string {
  return new Date().toISOString()
}

export const chatRepository = {
  async getOrCreateSession(planId: string): Promise<ChatSession> {
    const db = getDatabase()
    let row = db.select().from(chatSessions)
      .where(eq(chatSessions.planId, planId))
      .orderBy(desc(chatSessions.lastMessageAt))
      .get()

    if (!row) {
      const ts = now()
      row = {
        id: uuidv4(),
        planId,
        startedAt: ts,
        lastMessageAt: ts,
      }
      db.insert(chatSessions).values(row).run()
      persistDatabase()
    }

    return {
      id: row.id,
      planId: row.planId,
      startedAt: row.startedAt,
      lastMessageAt: row.lastMessageAt,
    }
  },

  async listMessages(sessionId: string): Promise<ChatMessage[]> {
    const db = getDatabase()
    const rows = db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .all()
    return rows.map(mapMessage)
  },

  async appendMessage(sessionId: string, input: CreateChatMessageInput): Promise<ChatMessage> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      sessionId,
      role: input.role,
      content: input.content,
      timestamp: ts,
      extractedElements: JSON.stringify(input.extractedElements ?? []),
      extractionStatus: input.extractionStatus ?? '',
    }

    db.insert(chatMessages).values(row).run()

    // Update session lastMessageAt
    db.update(chatSessions)
      .set({ lastMessageAt: ts })
      .where(eq(chatSessions.id, sessionId))
      .run()

    persistDatabase()
    return mapMessage(row)
  },
}

function mapMessage(row: typeof chatMessages.$inferSelect): ChatMessage {
  return {
    id: row.id,
    sessionId: row.sessionId,
    role: row.role as ChatMessage['role'],
    content: row.content,
    timestamp: row.timestamp,
    extractedElements: JSON.parse(row.extractedElements),
    extractionStatus: (row.extractionStatus || '') as ChatMessage['extractionStatus'],
  }
}
