import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { plans, scopes, approaches } from '../schema'
import type { Plan } from '@/domain/types'

function now(): string {
  return new Date().toISOString()
}

export const planRepository = {
  async getByProjectId(projectId: string): Promise<Plan> {
    const db = getDatabase()
    let row = db.select().from(plans).where(eq(plans.projectId, projectId)).get()

    if (!row) {
      // Auto-create plan + scope if missing
      const ts = now()
      const planId = uuidv4()
      row = {
        id: planId,
        projectId,
        lastChatSessionId: '',
        createdAt: ts,
        updatedAt: ts,
      }
      db.insert(plans).values(row).run()

      db.insert(scopes).values({
        id: uuidv4(),
        planId,
        problemStatement: '',
        solutionSummary: '',
        assumptions: '[]',
        createdAt: ts,
        updatedAt: ts,
      }).run()

      db.insert(approaches).values({
        id: uuidv4(),
        planId,
        strategySummary: '',
        architecturalStyle: 'tbd',
        architecturalStyleRationale: '',
        createdAt: ts,
        updatedAt: ts,
      }).run()

      persistDatabase()
    }

    return {
      id: row.id,
      projectId: row.projectId,
      lastChatSessionId: row.lastChatSessionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  },
}
