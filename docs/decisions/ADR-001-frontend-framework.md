# ADR-001: Use React + TypeScript + Zustand for the Frontend

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-03-24 |
| Deciders | Engineering |
| Driver | `nfr-driven` |

---

## Context

The application is a client-side single-page application with two primary
interaction surfaces: a structured plan editor (many small, independent
editable fields across tabs) and a real-time streaming chat panel. These
two panels must stay in sync — when the chat agent creates a plan element,
the plan panel must update reactively without a page reload.

The application will have significant TypeScript domain models (see
`specs/data-model.md`) that must be shared across UI components and the
domain layer. Type safety is a priority given the number of entity types and
their cross-references.

The team building this project has existing experience with React and
TypeScript in production applications.

---

## Problem Statement

Which UI framework and state management approach should be used for the
Architect Project Planner frontend?

---

## Options Considered

### Option A: React 18 + TypeScript + Zustand (chosen)

**Description:** React as the component library, TypeScript throughout,
Zustand for global state management.

**Pros:**
- Largest ecosystem: tooling, component libraries, community support are
  mature.
- TypeScript support is first-class; the React + TypeScript combination is
  the most widely documented.
- Zustand is a minimal, non-magical state manager. Stores are plain
  TypeScript modules — easy to unit test without React.
- React's concurrent mode and `useTransition` handle streaming UI updates
  gracefully.
- Vercel AI SDK's React hooks (`useChat`, `useCompletion`) integrate
  natively with React.
- The team has existing React/TypeScript expertise.

**Cons:**
- More verbose than Vue or Svelte for simple UI tasks.
- React's component model requires discipline to avoid unnecessary
  re-renders, especially with many editable fields.

---

### Option B: Vue 3 + TypeScript + Pinia

**Description:** Vue 3 Composition API with TypeScript, Pinia for state.

**Pros:**
- Excellent TypeScript support in Vue 3; Pinia is type-safe by design.
- Template syntax is more concise than JSX for form-heavy UI.
- Two-way binding via `v-model` simplifies inline editing patterns.

**Cons:**
- Team has no existing Vue experience — learning curve adds risk.
- Vercel AI SDK has React-first hooks; Vue integration requires more
  manual wiring for streaming.
- Smaller ecosystem for the niche tooling this app needs (e.g., resizable
  split panels, SQLite-WASM integration examples).

---

### Option C: Svelte / SvelteKit + TypeScript

**Description:** Svelte with TypeScript, built-in reactivity.

**Pros:**
- Minimal boilerplate; reactive assignments feel natural.
- No virtual DOM overhead; potentially faster rendering.
- SvelteKit provides routing and build tooling.

**Cons:**
- Smallest ecosystem of the three; fewer ready-made component libraries.
- Team has no existing Svelte experience.
- Vercel AI SDK Svelte support is less mature than React.
- TypeScript support in Svelte templates (`.svelte` files) has historically
  had rough edges, though improving.

---

## Decision

**Option A: React 18 + TypeScript + Zustand.**

---

## Rationale

The combination of existing team expertise, Vercel AI SDK's native React
support, and React's mature ecosystem for the specific patterns needed
(streaming UI, resizable panels, many-field inline editing) makes React the
clear choice. The team productivity cost of learning Vue or Svelte during
an MVP build is not justified by their advantages in this context.

Zustand was chosen over Redux Toolkit (too much boilerplate for the app's
scale) and Jotai/Recoil (atom-based models are less natural for the
entity-relationship shape of plan data).

---

## Positive Consequences

- AI SDK hooks (`useChat`) work without adapter layers.
- Domain model TypeScript types are shared directly with components.
- Large pool of developers familiar with this stack.

## Trade-offs Accepted

- JSX verbosity compared to Vue templates for the form-heavy plan panel.
- React's re-render model requires care when many fields are editable
  independently (mitigated by Zustand slice subscriptions and memoization).

## Review Triggers

- If a significant portion of the team transitions to a Vue or Svelte shop.
- If the Vercel AI SDK drops React-first support or a competitor SDK
  emerges with better multi-framework support.
