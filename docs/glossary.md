# Glossary

Shared vocabulary for the Architect Project Planner. When a term is used
in any spec or ADR, it carries the meaning defined here unless explicitly
overridden in that document.

---

## A

**ADR (Architecture Decision Record)**
A document that captures a significant architectural decision: its context,
the options considered, the choice made, and the consequences. ADRs are
first-class entities within a Project in this application.

**Approach**
A top-level plan element describing the architectural strategy chosen for
the project: patterns, technology choices, principles, and their tradeoffs.

**Architect**
The primary user persona. A software or solution architect who uses this
tool to structure, communicate, and evolve a project's architectural plan.

**ArchitecturalPattern**
A named design pattern applied within the chosen architectural style (e.g.,
CQRS, Saga, Strangler Fig, BFF). Captured with tradeoffs and alternatives.

**Architectural Style**
The high-level structural approach for a system (e.g., microservices,
modular monolith, event-driven, hexagonal). Distinct from patterns applied
within that style.

---

## C

**Chat Panel**
The right-side UI panel in the project view where the architect converses
with the agentic assistant to tease out plan details.

**ChatSession**
A persisted record of one or more exchanges between the user and the agent
within a project. Multiple sessions can exist per project.

**Completeness Score**
A computed integer (0–100) indicating how fully populated a Plan is across
all required fields and minimum-count thresholds. Not stored; derived on read.

**Constraint**
A non-negotiable boundary on the solution space. Constraints are typed
(Technical, Business, Regulatory, Resource, Time) and captured within Scope.

**createdVia**
A provenance field on every plan element indicating whether the record
originated from `chat` (agent extraction) or `manual` (direct user entry).

---

## D

**Dependency (plan-level)**
A directional relationship between two plan elements indicating that one
cannot be finalized without the other being resolved first.

**Domain Layer**
The part of the application containing plan entities, validation rules, and
business logic. Has no dependency on the UI layer or LLM services.

---

## E

**ElementRef**
A lightweight reference object linking a ChatMessage to one or more plan
elements it proposed, created, or modified.

**ExtractionStatus**
The state of a plan element proposed by the agent within a chat message:
`pending`, `confirmed`, `rejected`, or `modified`.

---

## I

**IntegrationPoint**
An external system, service, or actor that the project system interacts
with. Captured with direction, protocol, data classification, owner, SLA,
and criticality.

**InScopeItem**
A discrete capability, feature, or area explicitly included in the project.

---

## N

**NFR (Non-Functional Requirement)**
A quality attribute requirement: performance, availability, security,
maintainability, etc. NFRs are first-class fields on the Approach element
with typed categories, measurable targets, and verification approaches.

---

## O

**Opportunity**
A plan element identifying a technical improvement, modernization
possibility, cost reduction, or strategic advantage that the project could
realize beyond the core scope.

**OutOfScopeItem**
A discrete capability, feature, or area explicitly excluded from the
project. Requires a `rationale` field (why it was excluded) to prevent
revisiting closed decisions.

---

## P

**Plan**
The complete set of structured elements (Scope, Approach, Risks,
Opportunities, ADRs, TODOs) associated with a Project. Auto-created when
a Project is created. Populated incrementally through the agentic chat.

**Plan Element**
Any first-class structured document within a Plan: Scope, Approach, Risk,
Opportunity, ADR, or TODO item.

**Plan Panel**
The left-side UI panel in the project view showing the structured plan
elements, organized into tabs.

**Principle**
A named architectural guideline that shapes design decisions throughout a
project (e.g., "API-first", "Fail fast", "Defence in depth").

**Project**
The top-level container. Corresponds to one engagement, initiative, or
system an architect is planning. Has exactly one Plan.

**projectType**
An enum classifying the nature of a project: `greenfield`, `migration`,
`modernization`, `integration`, `platform`, or `other`. Used by the agent
to tailor its questioning strategy.

---

## R

**Risk**
A plan element identifying a threat to project success. Has typed category,
likelihood, impact (forming a risk score), status, mitigation strategy, and
contingency plan.

**riskScore**
A computed integer derived from likelihood × impact on a 5×5 matrix.
Not stored; derived on read.

---

## S

**Scope**
A plan element defining what is inside and outside the project boundaries,
who the stakeholders are, what systems are integrated, and what constraints
apply.

**Stakeholder**
A person or organizational role with interest or influence over the project.
Captured with role type, primary concern, influence level, and interest level.

---

## T

**TechnologyChoice**
A specific technology selected for a given category (language, framework,
database, etc.), captured with rationale and alternatives considered.

**TODO**
(Stretch goal for MVP) A lightweight action item or open question associated
with a project, optionally linked to a specific plan element.

---

## U

**UUID**
Universally Unique Identifier. Used as the immutable primary key for all
entities in the data model.
