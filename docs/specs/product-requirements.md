# Product Requirements Specification
# Architect Project Planner

| Field | Value |
|-------|-------|
| Version | 0.1 |
| Status | Draft |
| Last Revised | 2026-03-24 |
| Authors | Product, Architecture |

---

## 1. Vision Statement

Architect Project Planner is a focused tool for software and solution
architects to capture, structure, and communicate project plans. It combines
an agentic chat interface with a structured data model so that architects
can think out loud and have those thoughts organized into a durable,
queryable plan — rather than buried in documents or chat logs.

The tool is opinionated about what matters in an architectural plan. It is
not a generic project management tool. It understands concepts like
Architecture Decision Records, constraint types, NFRs, and integration
points natively.

---

## 2. Problem Statement

Architects today maintain project plans across a mix of wikis, slide decks,
Notion documents, and informal chat. Key artifacts — ADRs, risk registers,
scope boundaries — are fragmented. New team members cannot quickly understand
the architectural rationale. Decisions made early in a project are forgotten
or repeated. There is no single place that answers: "What did we decide, and
why?"

---

## 3. Goals and Non-Goals

### Goals (MVP)

- **G1**: Provide a single place for an architect to capture a structured plan.
- **G2**: Use agentic chat to lower the friction of populating plan elements.
- **G3**: Produce plan artifacts that are shareable and navigable by others.
- **G4**: Support the full ADR lifecycle within a project.
- **G5**: Model architectural concepts (NFRs, constraints, integration points)
  as first-class data — not as freeform text.

### Non-Goals (MVP)

- **NG1**: Replace or integrate with existing project management tools (Jira, Linear, Asana).
- **NG2**: Real-time multi-user collaborative editing.
- **NG3**: Diagramming or visualization beyond structured text representations.
- **NG4**: Time tracking, sprint planning, or delivery management.
- **NG5**: Automatic synchronization with code repositories or wikis.
- **NG6**: Desktop packaging (Tauri) — deferred post-MVP.

---

## 4. User Personas

### Primary: The Staff/Principal Architect

- Works on 1–5 concurrent initiatives at any time.
- Needs to onboard stakeholders and new team members quickly.
- Maintains ADRs as a professional practice.
- Wants to capture decisions *during* discussions, not after.
- Comfort level with structured data is high; tolerates well-designed forms.

### Secondary: The Tech Lead (Consumer)

- Reads plans created by an architect.
- Needs to understand scope, approach, and outstanding risks quickly.
- Does not author plans in MVP.

### Out of Scope for MVP

- Executive stakeholders consuming summary views.
- External clients or non-technical stakeholders.

---

## 5. User Stories

### Epic: Project Management

| ID | Story | Priority |
|----|-------|----------|
| US-01 | As an architect, I can create a new project with a name, type, and brief description so that I have a container for my plan. | Must |
| US-02 | As an architect, I can view a list of my projects in the sidebar ordered by last modified so that I can navigate between them. | Must |
| US-03 | As an architect, I can archive a project so that it no longer appears in active navigation but is not deleted. | Should |
| US-04 | As an architect, I can search across projects by name so that I can find older engagements. | Could |
| US-05 | As an architect, I can export a project plan as Markdown so that I can share it outside the application. | Should |

### Epic: Agentic Chat

| ID | Story | Priority |
|----|-------|----------|
| US-06 | As an architect, I can open a chat panel for a project and describe what I'm working on in natural language. | Must |
| US-07 | As an architect, the chat agent prompts me with clarifying questions to extract scope, risks, and approach details. | Must |
| US-08 | As an architect, the agent populates structured plan elements from my chat responses without me filling out forms manually. | Must |
| US-09 | As an architect, I can review, edit, or reject any structured element the agent proposes before it is committed. | Must |
| US-10 | As an architect, I can ask the agent to refine or expand a specific plan element in a follow-up message. | Must |
| US-11 | As an architect, the agent surfaces relevant follow-up questions based on gaps it detects in my plan. | Should |
| US-12 | As an architect, I can see which plan elements were created or modified from a given chat exchange. | Should |
| US-13 | As an architect, the agent adapts its questioning strategy based on the project type (greenfield vs. migration etc.). | Should |

### Epic: Scope

| ID | Story | Priority |
|----|-------|----------|
| US-14 | As an architect, I can define a problem statement and solution summary for the project. | Must |
| US-15 | As an architect, I can list items that are explicitly in scope, categorized by type. | Must |
| US-16 | As an architect, I can list items that are explicitly out of scope, with required rationale for each. | Must |
| US-17 | As an architect, I can capture stakeholders with their role, concern, influence level, and interest level. | Must |
| US-18 | As an architect, I can capture integration points with external systems including direction, protocol, and criticality. | Must |
| US-19 | As an architect, I can record constraints typed as Technical, Business, Regulatory, Resource, or Time, with the source. | Must |
| US-20 | As an architect, I can record project-wide assumptions the scope depends on. | Should |

### Epic: Approach

| ID | Story | Priority |
|----|-------|----------|
| US-21 | As an architect, I can describe the architectural strategy and select the primary architectural style. | Must |
| US-22 | As an architect, I can record NFRs with category, measurable target, rationale, and priority. | Must |
| US-23 | As an architect, I can capture architectural patterns applied with their tradeoffs and alternatives considered. | Must |
| US-24 | As an architect, I can list technology choices with rationale and alternatives considered. | Should |
| US-25 | As an architect, I can record design principles that guide the project. | Should |

### Epic: Risks

| ID | Story | Priority |
|----|-------|----------|
| US-26 | As an architect, I can log risks with likelihood, impact, category, and mitigation strategy. | Must |
| US-27 | As an architect, I can see a risk score derived from likelihood × impact. | Must |
| US-28 | As an architect, I can update a risk's status as the project progresses. | Must |
| US-29 | As an architect, I can link a risk to specific constraints, NFRs, or integration points that cause it. | Should |
| US-30 | As an architect, I can add a contingency plan to a risk distinct from its mitigation strategy. | Should |

### Epic: Opportunities

| ID | Story | Priority |
|----|-------|----------|
| US-31 | As an architect, I can capture technical improvement opportunities with a value statement and effort estimate. | Must |
| US-32 | As an architect, I can mark an opportunity as accepted, deferred, or rejected with rationale. | Should |
| US-33 | As an architect, I can link an opportunity to risks it would address. | Could |

### Epic: ADRs

| ID | Story | Priority |
|----|-------|----------|
| US-34 | As an architect, I can create an ADR within a project using a structured form with at least two options. | Must |
| US-35 | As an architect, I can mark an ADR as Draft, Proposed, Accepted, Deprecated, or Superseded. | Must |
| US-36 | As an architect, ADRs are auto-numbered sequentially within a project (ADR-001, ADR-002…). | Must |
| US-37 | As an architect, I can link an ADR to the risks, constraints, or NFRs that motivated it. | Should |
| US-38 | As an architect, I can supersede an ADR by creating a new one that references it. | Should |
| US-39 | As an architect, the agent can draft an ADR from a chat discussion about a decision. | Should |
| US-40 | As an architect, I can record review triggers — conditions that would prompt revisiting a decision. | Could |

### Epic: TODOs (Stretch Goal)

| ID | Story | Priority |
|----|-------|----------|
| US-41 | As an architect, I can create TODO items linked to a specific plan element. | Could |
| US-42 | As an architect, I can mark a TODO as done or cancelled. | Could |

### Epic: Settings & Configuration

| ID | Story | Priority |
|----|-------|----------|
| US-43 | As an architect, I can configure my LLM provider and API key in a settings panel so that the chat agent can function. | Must |
| US-44 | As an architect, I can test my API key from the settings panel to verify it works before starting a project. | Should |

### Epic: Plan Health & Visibility

| ID | Story | Priority |
|----|-------|----------|
| US-45 | As an architect, I see a plan overview tab showing per-section completeness when I open a project, so I know where to focus. | Should |
| US-46 | As an architect, I can click on incomplete items in the overview to navigate directly to the relevant section. | Should |
| US-47 | As an architect, I can see a weighted breakdown of what contributes to my plan's completeness score. | Should |

### Epic: Chat Session Management

| ID | Story | Priority |
|----|-------|----------|
| US-48 | As an architect, I can create and switch between chat sessions within a project so that I can have focused conversations on different topics. | Should |
| US-49 | As an architect, I can see which elements were extracted in each chat session. | Could |

### Epic: Offline & Resilience

| ID | Story | Priority |
|----|-------|----------|
| US-50 | As an architect, I see a clear indicator when I'm offline and chat is unavailable, while plan editing continues to work. | Should |
| US-51 | As an architect, I see clear error messages and retry options when the LLM provider fails. | Must |

---

## 6. Functional Requirements

### FR-01: Project CRUD
The system shall support creating, reading, updating, and archiving projects.
Projects shall have a unique identifier, name, type, description, creation date,
last-modified date, and status (Active, Archived, On Hold).

### FR-02: Plan Auto-Creation
A Plan shall be automatically created when a Project is created. The user
does not create a Plan explicitly.

### FR-03: Completeness Indicators
The system shall indicate for each plan element whether it is empty, partial,
or complete, based on required field population and minimum item counts.
A numeric completeness score (0–100) shall be shown at the project level.

### FR-04: Chat-to-Structure Extraction
The chat agent shall extract structured data from natural language using
structured output / tool-calling and propose it to the user for confirmation
before persisting. The user shall be able to accept, edit, or reject each
proposed element independently.

### FR-05: Element Linking
The system shall support directional cross-references between plan elements
(e.g., an ADR motivated by a Risk, a Risk linked to a Constraint). Deleting
a referenced element shall remove or nullify the reference, not cascade-delete.

### FR-06: ADR Lifecycle
ADRs shall support status transitions: Draft → Proposed → Accepted →
(Deprecated | Superseded). A superseding ADR must reference the ADR it
replaces. At least two options must be recorded before an ADR can be moved
from Draft to Proposed.

### FR-07: Markdown Export
The system shall support exporting a full project plan as Markdown. The
export filename shall follow the pattern: `[project-slug]-plan-[YYYY-MM-DD].md`.

### FR-08: Persistence
All plan data shall be persisted in browser-local storage. The user shall
not lose data on browser refresh or application restart.

### FR-09: Provenance Tracking
Every plan element shall record whether it was created via chat extraction
or manual entry (`createdVia` field).

### FR-10: Agent Onboarding
On project creation, the agent shall automatically send an opening message
without waiting for user input, tailored to the selected project type.

---

## 7. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Chat responses shall begin streaming within 3 seconds of submission under normal network conditions. |
| NFR-02 | Performance | Project list shall render within 1 second for up to 100 projects. |
| NFR-03 | Reliability | No data loss on unexpected browser termination (crash, power loss mid-write). |
| NFR-04 | Usability | A new user with an architectural background shall produce a first structured plan element within 10 minutes without reading documentation. |
| NFR-05 | Portability | Plan export (Markdown) shall be human-readable without the application. |
| NFR-06 | Privacy | LLM calls shall not persist user plan content in provider logs beyond the provider's stated data retention policy. |
| NFR-07 | Accessibility | The UI shall meet WCAG 2.1 AA for keyboard navigation and color contrast. |
| NFR-08 | Maintainability | Core domain logic (data model, validation, business rules) shall be decoupled from the UI layer and independently unit-testable. |
| NFR-09 | Offline | Plan editing (read, write plan elements) shall function without network connectivity. Chat requires connectivity. |

---

## 8. Constraints and Assumptions

### Constraints

- **C1**: MVP is a single-user application. Multi-tenancy is not in scope.
- **C2**: The LLM provider must support streaming responses.
- **C3**: The application shall not require the user to operate a backend server for MVP.

### Assumptions

- **A1**: Users have access to a configured LLM API key or the app ships with a
  managed provider endpoint.
- **A2**: Users are technically literate architects; the UX does not need to
  explain what an ADR, NFR, or risk register is.

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Time to first structured plan element from a blank project | < 10 minutes |
| % of plan elements created via chat vs. manual form | > 60% |
| ADRs created per active project | ≥ 2 |
| User-reported plan completeness satisfaction | > 4/5 |
