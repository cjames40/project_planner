# Technical Architecture Specification
# Architect Project Planner

| Field | Value |
|-------|-------|
| Version | 0.1 |
| Status | Draft |
| Last Revised | 2026-03-24 |

---

## 1. Overview

Architect Project Planner is a single-user client-side web application. It
consists of a React frontend, a browser-local SQLite persistence layer, and
an integration layer to an external LLM provider. No backend server is
required for MVP.

---

## 2. System Context

```
┌─────────────────────────────────────────────────────┐
│                  User (Architect)                   │
└──────────────────────┬──────────────────────────────┘
                       │ browser
┌──────────────────────▼──────────────────────────────┐
│           Architect Project Planner (App)           │
│                                                     │
│  ┌──────────────┐  ┌───────────────────────────┐   │
│  │  Sidebar UI  │  │   Chat + Plan Panel UI    │   │
│  └──────────────┘  └───────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │           Domain / Application Layer         │  │
│  │   Plan Engine · Extraction Service · Linker  │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │             Persistence Layer                │  │
│  │         SQLite-WASM via Drizzle ORM          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────┘
                              │ HTTPS / streaming
              ┌───────────────▼──────────────┐
              │      LLM Provider API        │
              │  (Anthropic / OpenAI / etc.) │
              └──────────────────────────────┘
```

---

## 3. Architectural Style

**Modular Monolith** for MVP.

All code ships in a single deployable unit (static web app). Modules are
separated by domain concern with clear interfaces. This simplifies MVP
deployment (no server) while preserving a clear path to future extraction
of a backend if needed.

Key modules:

| Module | Responsibility |
|--------|----------------|
| `ui/` | All React components, views, layouts. No business logic. |
| `domain/` | Plan entities, validation rules, business logic. Zero dependency on UI or LLM. |
| `services/chat/` | LLM integration, streaming, extraction pipeline. |
| `services/persistence/` | Repository implementations (SQLite-WASM). |
| `services/export/` | Markdown export generation. |

---

## 4. Tech Stack

See ADRs for rationale. Proposed stack:

| Concern | Choice | ADR |
|---------|--------|-----|
| UI Framework | React 18 + TypeScript | [ADR-001](../decisions/ADR-001-frontend-framework.md) |
| State Management | Zustand | [ADR-001](../decisions/ADR-001-frontend-framework.md) |
| Persistence | SQLite via `@sqlite.org/sqlite-wasm` | [ADR-002](../decisions/ADR-002-storage-strategy.md) |
| ORM / Query builder | Drizzle ORM | [ADR-002](../decisions/ADR-002-storage-strategy.md) |
| LLM Integration | Vercel AI SDK | [ADR-003](../decisions/ADR-003-llm-integration.md) |
| Styling | Tailwind CSS | — |
| Build Tool | Vite | — |
| Testing | Vitest + Testing Library | — |
| Desktop (deferred) | Tauri | Post-MVP |

---

## 5. Module Design

### 5.1 Domain Layer

The domain layer is the heart of the application. It must have **zero
dependency** on React, Zustand, the LLM, or the database — making it
independently testable and portable.

**Plan Engine**
- CRUD operations for all plan entities.
- Enforces business rules:
  - ADR requires ≥ 2 options before transitioning from `draft` to `proposed`.
  - `OutOfScopeItem.rationale` is required.
  - `supersededById` must be set when an ADR is marked `superseded`.
- Computes derived fields: `completenessScore`, `riskScore`.
- Emits domain events (e.g., `RiskCreated`, `ADRStatusChanged`) consumed by UI state.

**Validator**
- Field-level and entity-level validation for each entity type.
- Returns structured validation error objects, not exceptions.
- Shared between frontend form validation and Plan Engine writes.

**Linker**
- Manages cross-references between plan elements (UUID array fields).
- On element deletion: removes stale references from other elements rather
  than cascade-deleting.

### 5.2 Chat / Extraction Service

The extraction pipeline converts natural language into proposed plan elements:

```
User message
    │
    ▼
Build context payload
  (current plan state, project type, recent messages)
    │
    ▼
LLM request (Vercel AI SDK, streaming + tool-calling)
    │
    ▼
Stream tokens → displayed in chat panel
    │
    ▼ (on stream complete)
Structured extraction parser
  (validates JSON against entity schemas)
    │
    ▼
Proposed element cards surfaced in chat UI
    │
    ├── User accepts → Plan Engine writes element
    ├── User edits  → inline form, then Plan Engine writes
    └── User rejects → dismissed, agent notified in next turn
```

**Context construction rules:**
- System prompt includes: project type, current completeness score, a
  compact summary of existing elements (not full detail), and extraction
  format instructions.
- Only the active plan element section is included in full when relevant
  (e.g., if the user is discussing risks, the full risk list is included).
- Chat history is truncated to the most recent ~20 messages to manage token
  count; a summary of earlier context is included as a system message.

**Token budget allocation:**

| Context segment | Budget | Notes |
|-----------------|--------|-------|
| System prompt + extraction instructions | ~1,500 tokens | Fixed per request. |
| Plan summary (compact) | ≤ 4,096 tokens | Compressed representation of all elements. |
| Recent chat messages | ≤ 8,192 tokens | Last ~20 messages; older messages summarized. |
| Earlier context summary | ≤ 1,024 tokens | Generated via a condensing prompt when session exceeds 20 messages. |
| User's new message | ≤ 1,024 tokens | 4000-char limit ≈ ~1000 tokens. |
| Reserved for response | Remaining | Depends on model max context. |

When the session grows beyond 20 messages, a background condensing call
summarizes the earlier portion into a structured "session so far" summary.
This summary is regenerated every 10 messages.

**Extraction format:**
The LLM uses structured output / tool-calling to return a typed JSON array
of proposed elements. Each element includes the entity type, all populated
fields, and a `confidence` score (0.0–1.0).

**Confidence threshold:** 0.7. Elements with confidence ≥ 0.7 are presented
as proposed element cards. Elements with confidence < 0.7 are silently
converted into clarifying questions in the assistant's text response (e.g.,
"I'm not sure about the likelihood of this risk — would you say it's high
or medium?"). The confidence score itself is **not** shown to the user —
the UX is either a proposal card or a question, never a score.

**Malformed extraction handling:** If the LLM returns JSON that fails schema
validation, the extraction is silently discarded and the assistant's text
response is shown as-is (plain conversational response without proposal
cards). The failed extraction is logged to the browser console for
debugging. The user is not interrupted.

### 5.3 Persistence Layer

All storage is abstracted behind a repository interface per entity type
(see `specs/api.md`). The MVP implementation uses SQLite-WASM.

The repository interface ensures the domain layer and UI never depend on
a specific storage technology. A future cloud backend can implement the
same interfaces without domain layer changes.

**Schema strategy:** Drizzle ORM with TypeScript schema definitions.
Migrations are generated by Drizzle Kit. The SQLite database file is
persisted in the browser's Origin Private File System (OPFS) for durability.

### 5.4 Export Service

Input: a fully hydrated `Plan` object.
Output: a Markdown string following a canonical structure.

Export structure:
```
# [Project Name]
## Overview
## Scope
### In Scope / Out of Scope / Stakeholders / Integration Points / Constraints
## Approach
### Strategy / Architectural Style / Patterns / NFRs / Technology Choices / Principles
## Risks
[risk register table]
## Opportunities
[opportunity cards]
## Architecture Decision Records
### ADR-001: [title]
...
## TODOs (if any)
```

---

## 6. Data Flow: Chat-Driven Element Creation

1. User types a message in the chat panel.
2. UI calls `ChatService.sendMessage(text, planContext)`.
3. A streaming request is sent to the LLM API via Vercel AI SDK.
4. Streamed tokens render in the chat panel in real time.
5. On stream completion, the response is parsed for structured extractions.
6. Extracted elements are rendered as "proposed element cards" in the chat.
7. For each card, user clicks Accept, Edit, or Reject:
   - **Accept** → `PlanEngine.save(element)` → persisted, plan view updates.
   - **Edit** → inline form opens, user modifies, then saved.
   - **Reject** → dismissed; agent is notified in next system context.
8. Plan completeness score is recalculated after any change.
9. Plan panel updates reactively via Zustand store subscription.

---

## 7. State Management

Zustand stores are organized by concern:

| Store | Responsibility |
|-------|----------------|
| `projectStore` | Project list, selected project, CRUD actions. |
| `planStore` | Current plan state (all elements), completeness score. |
| `chatStore` | Chat sessions, messages, pending extractions, streaming state. |
| `uiStore` | Sidebar open/closed, active tab, split panel ratio, modal state. |

Stores do not contain business logic — they call domain layer functions and
persist the results. UI components subscribe to store slices, not full stores,
to minimize re-renders.

---

## 8. Security Considerations

- LLM API keys are stored in browser `localStorage` with a user-facing
  warning about key exposure. Key management UI is minimal for MVP.
- Plan data does not leave the device except via LLM API calls.
- Minimum necessary plan context is sent per LLM request.
- Markdown exports contain no API keys or internal IDs.
- No user authentication for MVP (single-user, local app).

---

## 9. Error Handling & Recovery

### 9.1 LLM Provider Errors

| Error Type | Detection | User Experience | Recovery |
|------------|-----------|-----------------|----------|
| **Rate limit** (429) | HTTP status code | Inline message: "The AI provider is busy. Retrying..." | Exponential backoff: 2s, 4s, 8s. Max 3 retries, then show error with "Try again" button. |
| **Timeout** | No response within 30s | Inline message: "Response timed out." | Show "Retry" button. No automatic retry for timeouts. |
| **Auth failure** (401/403) | HTTP status code | Inline error: "API key is invalid or expired." with "Open Settings" link | Direct user to Settings panel to re-enter key. |
| **Server error** (500/502/503) | HTTP status code | Inline message: "The AI provider is experiencing issues. Retrying..." | Same exponential backoff as rate limit. |
| **Network error** | `fetch` rejection / `navigator.onLine` | Yellow banner: "Chat unavailable — you're offline." Input disabled. | Auto-retry when connectivity is restored. |
| **Malformed response** | JSON schema validation failure | No user-visible error. Text response shown as-is without proposal cards. | Logged to console. Agent continues normally on next message. |
| **Context too long** | Provider returns context length error | Inline message: "Message too long for current context. Try a shorter message." | Automatically truncate plan context on retry; if still too long, suggest starting a new session. |

### 9.2 Retry Behavior

- Retries use exponential backoff with jitter: `delay = min(baseDelay * 2^attempt + random(0, 1000ms), 16000ms)`.
- Maximum 3 retries per request.
- During retry, the chat shows a loading indicator with "Retrying (attempt 2/3)..."
- After final retry failure, the user message remains in the chat with an
  error indicator and a "Retry" button. The user can also edit and resend.

### 9.3 Offline Detection

- Primary: `navigator.onLine` API + `online`/`offline` window events.
- Secondary: if an LLM request fails with a network error, treat as offline
  regardless of `navigator.onLine` (which can report false positives).
- On transition to offline: disable chat input, show banner.
- On transition to online: dismiss banner, re-enable input. Do not
  auto-retry any previously failed messages.

### 9.4 Persistence Errors

SQLite write failures (rare, but possible with OPFS):
- Show a non-blocking toast: "Failed to save. Retrying..."
- Retry once after 1 second.
- On second failure, show a persistent toast: "Unable to save changes.
  Your recent edits may be lost if you close the browser." with a
  "Retry" button.

---

## 10. Testing Strategy

| Layer | Approach | Tool |
|-------|----------|------|
| Domain entities and validation | Unit tests, no mocks needed | Vitest |
| Plan Engine business rules | Unit tests with in-memory repository stub | Vitest |
| Extraction parser | Unit tests against fixture LLM responses | Vitest |
| Repository layer | Integration tests against real SQLite-WASM | Vitest |
| UI components | Component tests | Vitest + Testing Library |
| Chat integration | Integration tests with mocked LLM | Vitest |
| Export | Snapshot tests against fixture plan data | Vitest |

**Key principle:** The domain layer's independence from UI and LLM means
its tests run fast, with no mocking complexity.

---

## 11. Deployment (MVP)

MVP deploys as a static web application. SQLite-WASM requires the following
HTTP headers for SharedArrayBuffer support:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These headers are configured in the host (Vite dev server, Vercel, Netlify,
or Caddy/nginx for self-hosting).

The app builds to a static bundle (`dist/`) with no server-side runtime.
