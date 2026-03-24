# ADR-003: Use Vercel AI SDK for LLM Integration

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-03-24 |
| Deciders | Engineering |
| Driver | `nfr-driven` |

---

## Context

The application's core value proposition depends on an agentic chat that
can extract structured plan elements from natural language (see
`specs/technical-architecture.md`, Section 5.2). This requires:

1. **Streaming responses** — NFR-01 requires chat responses to begin
   streaming within 3 seconds. Streaming must be handled from the LLM
   provider through to the React UI without buffering the full response.

2. **Structured output / tool-calling** — The extraction pipeline needs
   the LLM to return typed JSON conforming to the data model schemas, not
   free-form text. Provider-specific structured output APIs differ in
   implementation.

3. **Provider flexibility** — The initial provider choice (Anthropic or
   OpenAI) should not be a permanent architectural commitment. Architects
   using this tool may have access to different providers or want to swap
   for cost/capability reasons.

4. **React integration** — The streaming state (tokens arriving, cards
   appearing) must integrate cleanly with React state management.

---

## Problem Statement

How should the application integrate with LLM providers to support
streaming, structured output, and provider portability without building
custom wrappers?

---

## Options Considered

### Option A: Vercel AI SDK (chosen)

**Description:** The Vercel AI SDK (`ai` npm package) is a provider-agnostic
TypeScript SDK with first-class React hooks and support for all major LLM
providers via a unified interface.

**Pros:**
- Unified API across Anthropic, OpenAI, Google, Mistral, Groq, etc.
  Provider is swapped by changing an import, not rewriting call sites.
- First-class streaming support: `useChat` and `streamText` handle
  token-by-token streaming into React state with no manual buffering.
- Structured output via `generateObject` / `streamObject` — the SDK handles
  provider-specific tool-calling or JSON mode under the hood.
- TypeScript-native: schema definitions (via Zod) flow through to typed
  response objects.
- Active maintenance (Vercel-backed); widely used in production.
- `useChat` hook manages message history, loading state, and error handling.

**Cons:**
- Dependency on a third-party SDK means staying current with its API
  changes.
- Some provider features are not exposed uniformly (e.g., extended thinking
  modes, provider-specific metadata).
- For a desktop build (Tauri), the React hooks are not available — only the
  core `ai` functions (`generateText`, `streamText`) would be used.

---

### Option B: Direct provider SDKs (Anthropic SDK + OpenAI SDK)

**Description:** Use `@anthropic-ai/sdk` and `openai` npm packages directly,
with a custom abstraction layer to switch between them.

**Pros:**
- Access to provider-specific features not exposed via the Vercel AI SDK.
- No intermediary dependency.

**Cons:**
- Building and maintaining a custom provider abstraction layer is
  non-trivial — it must handle streaming, tool-calling, structured output,
  and error normalization for each provider.
- Duplicated integration effort vs. using an established abstraction.
- The custom abstraction would likely end up reinventing what the Vercel
  AI SDK already provides.

---

### Option C: LangChain.js

**Description:** Use LangChain.js for LLM orchestration, chain construction,
and provider abstraction.

**Pros:**
- Rich orchestration primitives (chains, agents, memory).
- Provider abstraction is mature.

**Cons:**
- LangChain's abstractions are designed for complex multi-step pipelines.
  Our extraction pattern is a single structured LLM call per message —
  LangChain's complexity adds overhead without benefit.
- LangChain.js has had stability and TypeScript type quality issues.
- Bundle size is significantly larger than the Vercel AI SDK.
- The opinionated agent framework conflicts with our custom extraction
  pipeline design.

---

### Option D: Fetch API (raw HTTP)

**Description:** Call LLM provider HTTP APIs directly with `fetch`, parsing
Server-Sent Events manually for streaming.

**Pros:**
- Zero dependency; full control.
- Smallest possible bundle impact.

**Cons:**
- SSE parsing for streaming is tedious and error-prone to implement
  correctly across providers.
- Structured output handling, retry logic, and error normalization must all
  be implemented from scratch.
- Effectively reinventing the Vercel AI SDK without the benefit of its
  ongoing maintenance.

---

## Decision

**Option A: Vercel AI SDK.**

---

## Rationale

The Vercel AI SDK's provider-agnostic design directly addresses the
portability requirement. Its `streamObject` function with Zod schema
validation is precisely the mechanism needed for the extraction pipeline —
it handles structured output differences between Anthropic (tool use) and
OpenAI (JSON mode) transparently.

The `useChat` React hook eliminates significant boilerplate for the streaming
chat UI and integrates naturally with Zustand (chat state lives in Zustand;
`useChat` is used for the active streaming session only).

Building a custom abstraction (Option B) or adopting LangChain (Option C)
would both require more code than the Vercel AI SDK provides out of the box,
with no meaningful benefit for this application's single-turn extraction
pattern.

---

## Positive Consequences

- LLM provider can be changed in a single configuration file.
- `streamObject` with Zod schemas provides compile-time type safety for
  extracted plan elements.
- `useChat` handles streaming state, retries, and error display.
- Community integrations and examples are widely available for this SDK.

## Trade-offs Accepted

- SDK API changes (currently stable, but version pinning is required).
- Some provider-specific capabilities are not exposed (acceptable for MVP;
  the application does not need advanced provider features).
- Tauri desktop path uses the core functions (`streamText`, `streamObject`)
  rather than React hooks, requiring a small adapter.

## Review Triggers

- If a provider with a significantly superior capability profile emerges
  that the Vercel AI SDK does not support.
- If the Vercel AI SDK undergoes a breaking API redesign.
- When the extraction pipeline evolves to require multi-step agentic
  orchestration — at that point, a more capable framework may be warranted.
