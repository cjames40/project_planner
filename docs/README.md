# Architect Project Planner — Documentation Index

This directory contains all specification and decision documents for the
Architect Project Planner application. Documents are organized by type.

## Reading Order (for new contributors)

1. [`specs/product-requirements.md`](specs/product-requirements.md) — Start here. Understand the "why."
2. [`specs/data-model.md`](specs/data-model.md) — The core of the system. Read this carefully.
3. [`specs/ui-ux.md`](specs/ui-ux.md) — How users interact with the data model.
4. [`specs/technical-architecture.md`](specs/technical-architecture.md) — How the app is built.
5. [`specs/api.md`](specs/api.md) — The contract between layers.
6. [`decisions/`](decisions/) — Rationale for key choices made during design.
7. [`glossary.md`](glossary.md) — Shared vocabulary; refer to when terms feel ambiguous.

## Document Index

### Specs

| File | Purpose | Status |
|------|---------|--------|
| [`specs/product-requirements.md`](specs/product-requirements.md) | Vision, goals, user stories, NFRs | Draft |
| [`specs/data-model.md`](specs/data-model.md) | Entity definitions, relationships, field rationale | Draft |
| [`specs/technical-architecture.md`](specs/technical-architecture.md) | App architecture, tech stack, component design | Draft |
| [`specs/ui-ux.md`](specs/ui-ux.md) | Wireframes, interaction flows, chat panel behavior | Draft |
| [`specs/api.md`](specs/api.md) | Internal TypeScript interface contracts | Draft |

### Architecture Decision Records

| File | Decision | Status |
|------|---------|--------|
| [`decisions/ADR-001-frontend-framework.md`](decisions/ADR-001-frontend-framework.md) | React + TypeScript + Zustand | Accepted |
| [`decisions/ADR-002-storage-strategy.md`](decisions/ADR-002-storage-strategy.md) | SQLite-WASM for client-local persistence | Accepted |
| [`decisions/ADR-003-llm-integration.md`](decisions/ADR-003-llm-integration.md) | Vercel AI SDK for provider-agnostic LLM calls | Accepted |

### Templates

| File | Purpose |
|------|---------|
| [`templates/adr-template.md`](templates/adr-template.md) | ADR template served to end-users within the app |

## Conventions

- All specs use present tense to describe the system as it *will* exist.
- All ADRs follow the template in [`templates/adr-template.md`](templates/adr-template.md).
- Status values: `Draft` → `Under Review` → `Approved` → `Superseded`.
- When a spec changes materially, bump the revision table inside that file.
- Terms used across documents carry the meaning defined in [`glossary.md`](glossary.md).
