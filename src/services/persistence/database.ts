import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js'
import { drizzle, type SqlJsDatabase as DrizzleSqlJsDb } from 'drizzle-orm/sql-js'
import * as schema from './schema'

const DB_STORAGE_KEY = 'architect-planner-db'

let db: DrizzleSqlJsDb<typeof schema> | null = null
let rawDb: SqlJsDatabase | null = null

/**
 * Initialize SQLite via sql.js and wrap with Drizzle ORM.
 * Persists to localStorage (base64-encoded). OPFS upgrade is tech debt.
 */
export async function initializeDatabase(): Promise<DrizzleSqlJsDb<typeof schema>> {
  if (db) return db

  const SQL = await initSqlJs({
    locateFile: () => '/sql-wasm.wasm',
  })

  // Try to restore from localStorage
  const saved = localStorage.getItem(DB_STORAGE_KEY)
  if (saved) {
    const buf = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0))
    rawDb = new SQL.Database(buf)
  } else {
    rawDb = new SQL.Database()
  }

  db = drizzle(rawDb, { schema })

  // Create tables
  rawDb.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      project_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      client_or_org TEXT NOT NULL DEFAULT '',
      start_date TEXT NOT NULL DEFAULT '',
      target_date TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      last_chat_session_id TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS scopes (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      problem_statement TEXT NOT NULL DEFAULT '',
      solution_summary TEXT NOT NULL DEFAULT '',
      assumptions TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS risks (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      likelihood TEXT NOT NULL,
      impact TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      mitigation_strategy TEXT NOT NULL DEFAULT '',
      mitigation_status TEXT NOT NULL DEFAULT '',
      contingency_plan TEXT NOT NULL DEFAULT '',
      owner TEXT NOT NULL DEFAULT '',
      review_date TEXT NOT NULL DEFAULT '',
      created_via TEXT NOT NULL DEFAULT 'manual',
      tags TEXT NOT NULL DEFAULT '[]',
      notes TEXT NOT NULL DEFAULT '',
      linked_constraint_ids TEXT NOT NULL DEFAULT '[]',
      linked_integration_point_ids TEXT NOT NULL DEFAULT '[]',
      linked_nfr_ids TEXT NOT NULL DEFAULT '[]',
      linked_adr_ids TEXT NOT NULL DEFAULT '[]',
      linked_opportunity_ids TEXT NOT NULL DEFAULT '[]',
      linked_stakeholder_ids TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      started_at TEXT NOT NULL,
      last_message_at TEXT NOT NULL
    )
  `)

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      extracted_elements TEXT NOT NULL DEFAULT '[]',
      extraction_status TEXT NOT NULL DEFAULT ''
    )
  `)

  persistDatabase()

  return db
}

/** Save the current database state to localStorage. */
export function persistDatabase(): void {
  if (!rawDb) return
  const data = rawDb.export()
  const base64 = btoa(String.fromCharCode(...data))
  localStorage.setItem(DB_STORAGE_KEY, base64)
}

/** Get the initialized Drizzle database instance. Throws if not initialized. */
export function getDatabase(): DrizzleSqlJsDb<typeof schema> {
  if (!db) throw new Error('Database not initialized. Call initializeDatabase() first.')
  return db
}
