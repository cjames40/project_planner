import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, persistDatabase } from '../database'
import { projects } from '../schema'
import { plans } from '../schema'
import { scopes } from '../schema'
import type { Project, ProjectSummary, CreateProjectInput, UpdateProjectInput } from '@/domain/types'
import { generateSlug } from '@/domain/slug'
import { NotFoundError } from '@/domain/errors'

function now(): string {
  return new Date().toISOString()
}

export const projectRepository = {
  async list(): Promise<ProjectSummary[]> {
    const db = getDatabase()
    const rows = db.select().from(projects).all()
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      projectType: r.projectType as ProjectSummary['projectType'],
      status: r.status as ProjectSummary['status'],
      completenessScore: 0, // Computed on the fly by stores
      updatedAt: r.updatedAt,
    }))
  },

  async getById(id: string): Promise<Project> {
    const db = getDatabase()
    const row = db.select().from(projects).where(eq(projects.id, id)).get()
    if (!row) throw new NotFoundError('Project', id)
    return mapRow(row)
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const db = getDatabase()
    const id = uuidv4()
    const ts = now()
    const slug = generateSlug(input.name)

    const projectRow = {
      id,
      name: input.name,
      slug,
      description: input.description,
      projectType: input.projectType,
      status: 'active' as const,
      clientOrOrg: input.clientOrOrg ?? '',
      startDate: input.startDate ?? '',
      targetDate: input.targetDate ?? '',
      createdAt: ts,
      updatedAt: ts,
    }

    db.insert(projects).values(projectRow).run()

    // Auto-create plan + scope
    const planId = uuidv4()
    db.insert(plans).values({
      id: planId,
      projectId: id,
      lastChatSessionId: '',
      createdAt: ts,
      updatedAt: ts,
    }).run()

    const scopeId = uuidv4()
    db.insert(scopes).values({
      id: scopeId,
      planId,
      problemStatement: '',
      solutionSummary: '',
      assumptions: '[]',
      createdAt: ts,
      updatedAt: ts,
    }).run()

    persistDatabase()
    return mapRow(projectRow)
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const db = getDatabase()
    const existing = db.select().from(projects).where(eq(projects.id, id)).get()
    if (!existing) throw new NotFoundError('Project', id)

    const updates: Record<string, unknown> = { updatedAt: now() }
    if (input.name !== undefined) updates.name = input.name
    if (input.description !== undefined) updates.description = input.description
    if (input.clientOrOrg !== undefined) updates.clientOrOrg = input.clientOrOrg
    if (input.status !== undefined) updates.status = input.status
    if (input.startDate !== undefined) updates.startDate = input.startDate
    if (input.targetDate !== undefined) updates.targetDate = input.targetDate

    db.update(projects).set(updates).where(eq(projects.id, id)).run()
    persistDatabase()

    return this.getById(id)
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase()
    db.delete(projects).where(eq(projects.id, id)).run()
    persistDatabase()
  },
}

function mapRow(row: typeof projects.$inferSelect): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    projectType: row.projectType as Project['projectType'],
    status: row.status as Project['status'],
    clientOrOrg: row.clientOrOrg,
    startDate: row.startDate,
    targetDate: row.targetDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
