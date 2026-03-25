import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { integrationPoints } from '../schema'
import type { IntegrationPoint, CreateIntegrationPointInput, UpdateIntegrationPointInput } from '@/domain/types'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const integrationPointRepository = {
  async listByScopeId(scopeId: string): Promise<IntegrationPoint[]> {
    const db = getDatabase()
    const rows = db.select().from(integrationPoints).where(eq(integrationPoints.scopeId, scopeId)).all()
    return rows.map(mapRow)
  },

  async create(scopeId: string, input: CreateIntegrationPointInput): Promise<IntegrationPoint> {
    const db = getDatabase()
    const ts = now()
    const row = {
      id: uuidv4(),
      scopeId,
      systemName: input.systemName,
      direction: input.direction,
      protocol: input.protocol ?? '',
      dataClassification: input.dataClassification ?? '',
      owner: input.owner ?? '',
      sla: input.sla ?? '',
      criticality: input.criticality,
      description: input.description,
      status: input.status,
      linkedRiskIds: '[]',
      createdVia: input.createdVia,
      tags: '[]',
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    }
    db.insert(integrationPoints).values(row).run()
    persistDatabase()
    return mapRow(row)
  },

  async update(id: string, input: UpdateIntegrationPointInput): Promise<IntegrationPoint> {
    const db = getDatabase()
    const existing = db.select().from(integrationPoints).where(eq(integrationPoints.id, id)).get()
    if (!existing) throw new NotFoundError('IntegrationPoint', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.systemName !== undefined) updates.systemName = input.systemName
    if (input.direction !== undefined) updates.direction = input.direction
    if (input.protocol !== undefined) updates.protocol = input.protocol
    if (input.dataClassification !== undefined) updates.dataClassification = input.dataClassification
    if (input.owner !== undefined) updates.owner = input.owner
    if (input.sla !== undefined) updates.sla = input.sla
    if (input.criticality !== undefined) updates.criticality = input.criticality
    if (input.description !== undefined) updates.description = input.description
    if (input.status !== undefined) updates.status = input.status
    if (input.linkedRiskIds !== undefined) updates.linkedRiskIds = JSON.stringify(input.linkedRiskIds)

    db.update(integrationPoints).set(updates).where(eq(integrationPoints.id, id)).run()
    persistDatabase()

    const updated = db.select().from(integrationPoints).where(eq(integrationPoints.id, id)).get()
    return mapRow(updated!)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(integrationPoints).where(eq(integrationPoints.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof integrationPoints.$inferSelect): IntegrationPoint {
  return {
    id: row.id,
    scopeId: row.scopeId,
    systemName: row.systemName,
    direction: row.direction as IntegrationPoint['direction'],
    protocol: row.protocol,
    dataClassification: (row.dataClassification || '') as IntegrationPoint['dataClassification'],
    owner: row.owner,
    sla: row.sla,
    criticality: row.criticality as IntegrationPoint['criticality'],
    description: row.description,
    status: row.status as IntegrationPoint['status'],
    linkedRiskIds: JSON.parse(row.linkedRiskIds),
    createdVia: row.createdVia as IntegrationPoint['createdVia'],
    tags: JSON.parse(row.tags),
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
