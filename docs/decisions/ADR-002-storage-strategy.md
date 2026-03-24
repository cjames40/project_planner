# ADR-002: Use SQLite-WASM + Drizzle ORM for Client-Local Persistence

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-03-24 |
| Deciders | Engineering |
| Driver | `constraint-driven` |

---

## Context

The application is a single-user tool (see product requirements, C1 and C3).
It must not require the user to run a backend server for MVP. Plan data must
be durable across browser sessions (not lost on refresh or tab close) and
must function for editing without network connectivity (NFR-09).

The data model is richly relational (see `specs/data-model.md`): Projects
contain Plans which contain Scopes, Approaches, Risks, ADRs, and their
cross-references. This is not a document store pattern — it is a normalized
relational schema with many inter-entity joins and cross-reference UUID
arrays.

The persistence layer is abstracted behind repository interfaces (see
`specs/api.md`), so the storage technology is replaceable without domain
layer changes.

---

## Problem Statement

Where and how should plan data be stored in the browser such that it is
durable, queryable, and does not require a server?

---

## Options Considered

### Option A: SQLite via `@sqlite.org/sqlite-wasm` + Drizzle ORM (chosen)

**Description:** The official SQLite WebAssembly build stored in the browser's
Origin Private File System (OPFS) for persistence. Drizzle ORM provides
type-safe query building and schema migrations.

**Pros:**
- Full SQL query capabilities — joins, aggregations, and cross-reference
  lookups are straightforward.
- OPFS persistence is durable across browser sessions and survives page
  refreshes.
- Drizzle ORM generates TypeScript types from the schema; domain model
  types stay in sync with database schema.
- SQLite-WASM mirrors the desktop SQLite API (via `better-sqlite3` in Tauri),
  so a desktop build reuses the same schema and migrations with minimal
  adapter changes.
- Drizzle Kit generates migration files, giving us a proper migration history.
- Well-maintained; supported by the SQLite project directly.

**Cons:**
- Requires `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`
  headers for SharedArrayBuffer — must be configured on the host.
- WASM bundle adds ~600KB to the initial load (mitigatable with lazy loading).
- OPFS is not supported in all browsers (notably, Safari added it in 16.4;
  iOS Safari requires 16.4+).

---

### Option B: IndexedDB (via Dexie.js)

**Description:** Browser-native IndexedDB with Dexie.js as a friendly wrapper.

**Pros:**
- No WASM bundle size overhead.
- Works in all modern browsers without special HTTP headers.
- Dexie provides a reasonable query API and TypeScript support.

**Cons:**
- IndexedDB is a document/object store, not a relational database. Complex
  cross-entity queries (e.g., "all risks linked to this constraint") require
  application-level join logic.
- No SQL; all query logic is imperative JavaScript.
- Schema migrations in IndexedDB are error-prone and poorly documented.
- The plan data model's relational shape is fighting the grain of IndexedDB.

---

### Option C: localStorage / sessionStorage + JSON

**Description:** Serialize the entire plan as a JSON blob per project into
`localStorage`.

**Pros:**
- Zero dependencies; trivially simple.
- Synchronous API.

**Cons:**
- 5–10MB storage limit in most browsers — plan data with many elements and
  chat history will hit this ceiling.
- No querying — the entire plan must be deserialized to read any element.
- No migration story — format changes require data transformation on read.
- Completely unsuitable for the rich relational data model in this project.

---

### Option D: Remote API + PostgreSQL (server-required)

**Description:** A backend API (Node.js/Express or similar) with a PostgreSQL
database.

**Pros:**
- Full relational database with mature tooling.
- Enables future multi-user and sync features.

**Cons:**
- Violates constraint C3 (no server required for MVP).
- Adds significant deployment complexity for a single-user MVP.
- Post-MVP path: the repository interface abstraction means this can be
  introduced later without domain layer changes.

---

## Decision

**Option A: SQLite-WASM with OPFS persistence + Drizzle ORM.**

---

## Rationale

The plan data model is inherently relational and benefits from SQL query
capabilities. IndexedDB's object-store model would force application-level
join logic that belongs in the database. localStorage is unsuitable at scale.

SQLite-WASM + OPFS is the most production-ready client-local relational
option available in browsers today. The COOP/COEP header requirement is a
known, well-documented configuration step. The WASM bundle overhead is
acceptable for this application's use case (a productivity tool, not a
public consumer app where bundle size is critical).

Drizzle ORM's schema-first approach with generated TypeScript types aligns
well with the application's strong typing philosophy.

---

## Positive Consequences

- SQL query capabilities match the relational data model perfectly.
- Schema migrations are first-class (Drizzle Kit).
- Desktop path (Tauri + better-sqlite3) reuses the same schema.
- Repository interface abstraction means a cloud backend can be added
  post-MVP without touching domain logic.

## Trade-offs Accepted

- COOP/COEP headers must be configured on every deployment target.
- Safari 16.3 and older are not supported.
- Initial WASM load time adds latency on first visit (mitigated by caching).

## Review Triggers

- If a compelling alternative (e.g., PGlite, a PostgreSQL-WASM port) matures
  and offers meaningful advantages.
- If browser support requirements change to include environments where
  SharedArrayBuffer is unavailable.
- When multi-user/sync features are introduced — at that point a server-side
  database becomes appropriate and this ADR should be revisited.
