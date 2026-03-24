# Data Model Specification
# Architect Project Planner

| Field | Value |
|-------|-------|
| Version | 0.1 |
| Status | Draft |
| Last Revised | 2026-03-24 |

---

## 1. Design Philosophy

This data model is built around what an architect *actually thinks about*
when planning a system — not what a generic project tool exposes. Key
principles:

1. **Typed over freeform.** Wherever a field has a known set of meaningful
   values (constraint type, risk category, ADR status), it is an enum —
   not a text field. This enables filtering, completeness checking, and
   reliable agentic extraction.

2. **Context is not optional.** Every significant field carries a `rationale`
   or `context` companion. Architects revisiting a plan months later need
   to understand *why* a choice was made, not just *what* was chosen.

3. **Relationships are first-class.** Plan elements link to each other.
   A Risk links to the Constraint that creates it. An ADR links to the
   NFRs that motivated it. These links make the plan a graph, not a flat
   document.

4. **Temporal provenance.** The model records when something was created,
   whether via chat or manual entry (`createdVia`), and when it was last
   revised.

5. **Structured NFRs.** Non-functional requirements are typed, measurable,
   and associated with their rationale and verification approach — not
   tucked into a freeform "other requirements" blob.

---

## 2. Entity Overview

```
Project
└── Plan
    ├── Scope
    │   ├── InScopeItem[]
    │   ├── OutOfScopeItem[]
    │   ├── Stakeholder[]
    │   ├── IntegrationPoint[]
    │   └── Constraint[]
    ├── Approach
    │   ├── ArchitecturalPattern[]
    │   ├── TechnologyChoice[]
    │   ├── NFR[]
    │   └── Principle[]
    ├── Risk[]
    ├── Opportunity[]
    ├── ADR[]
    │   └── ADROption[]
    ├── TodoItem[]          (stretch goal)
    └── ChatSession[]
        └── ChatMessage[]
```

---

## 3. Base Fields (All Entities)

Every entity in the system carries these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Immutable unique identifier. |
| `createdAt` | ISO 8601 timestamp | Yes | When the record was created. |
| `updatedAt` | ISO 8601 timestamp | Yes | When the record was last modified. |
| `createdVia` | Enum: `chat`, `manual` | Yes | Whether the record originated from agent extraction or direct user entry. |
| `tags` | string[] | No | Free-form tags for cross-cutting search. |
| `notes` | string | No | Architect's private scratchpad for this element. Excluded from export by default. |

---

## 4. Project

The top-level container for an engagement or initiative.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `name` | string (max 120) | Yes | Human-readable project name. |
| `slug` | string | Yes | URL-safe unique identifier derived from name. Used in export filenames. |
| `description` | string (max 500) | Yes | Brief statement of what this project is. |
| `status` | Enum: `active`, `archived`, `on-hold` | Yes | Default: `active`. |
| `clientOrOrg` | string | No | Organization or client name for the engagement. |
| `projectType` | Enum: `greenfield`, `migration`, `modernization`, `integration`, `platform`, `other` | Yes | Informs the agent's questioning strategy on project creation. |
| `startDate` | ISO 8601 date | No | When the engagement begins. |
| `targetDate` | ISO 8601 date | No | Target delivery or review date. |
| `createdAt` | timestamp | Yes | |
| `updatedAt` | timestamp | Yes | |

**Rationale for `projectType`:** An architect starting a migration faces
different default risks and questions than one starting a greenfield build.
The agent uses this to prime its opening questions. A migration project
immediately explores current-state pain points; a greenfield project starts
with vision, team, and constraints.

---

## 5. Plan

One Plan per Project. Auto-created with the Project; not user-created directly.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `projectId` | UUID (FK → Project) | Yes | |
| `completenessScore` | int 0–100 | Computed | Derived from required field population across all elements. Not stored; calculated on read. See Section 15. |
| `lastChatSessionId` | UUID | No | Reference to the most recent chat session. |
| `createdAt` | timestamp | Yes | |
| `updatedAt` | timestamp | Yes | |

---

## 6. Scope

One Scope per Plan. Describes the problem space and its boundaries.

### 6.1 Scope Root

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `planId` | UUID (FK → Plan) | Yes | |
| `problemStatement` | string | Yes | One-paragraph description of the problem being solved. |
| `solutionSummary` | string | No | One-paragraph high-level description of the proposed solution. |
| `assumptions` | string[] | No | Explicit assumptions the scope depends on. |
| `createdAt` | timestamp | Yes | |
| `updatedAt` | timestamp | Yes | |

### 6.2 InScopeItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `scopeId` | UUID (FK → Scope) | Yes | |
| `description` | string | Yes | What is included. |
| `rationale` | string | No | Why this is in scope (especially useful when non-obvious). |
| `category` | Enum: `functional`, `data`, `integration`, `infrastructure`, `process`, `security`, `other` | No | |

### 6.3 OutOfScopeItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `scopeId` | UUID (FK → Scope) | Yes | |
| `description` | string | Yes | What is excluded. |
| `rationale` | string | **Yes** | Why this is explicitly out of scope. Required to prevent scope creep debates. |
| `deferredTo` | string | No | If deferred, which future phase or project it belongs to. |

**Rationale for required `rationale`:** The most common architectural
conversation is "but why aren't we doing X?" Having the reason captured
prevents relitigating closed decisions with every new team member.

### 6.4 Stakeholder

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `scopeId` | UUID (FK → Scope) | Yes | |
| `name` | string | Yes | Person or role name. |
| `role` | string | Yes | Organizational role (e.g., "VP Engineering", "Data Privacy Officer"). |
| `type` | Enum: `sponsor`, `decision-maker`, `subject-matter-expert`, `end-user`, `impacted-party`, `regulator` | Yes | |
| `primaryConcern` | string | Yes | What they care most about in this project. |
| `influenceLevel` | Enum: `high`, `medium`, `low` | Yes | Their ability to influence project direction. |
| `interestLevel` | Enum: `high`, `medium`, `low` | Yes | How much they care about the outcome. |
| `communicationNeeds` | string | No | How and how often they need to be updated. |
| `linkedRiskIds` | UUID[] | No | Risks directly relevant to this stakeholder. |
| `linkedConstraintIds` | UUID[] | No | Constraints this stakeholder imposed or cares about. |
| `linkedADRIds` | UUID[] | No | ADRs that affect this stakeholder's concerns. |
| `linkedOpportunityIds` | UUID[] | No | Opportunities relevant to this stakeholder. |

**Rationale for influence/interest matrix:** Capturing influence and interest
separately supports the classic stakeholder management matrix (manage closely,
keep informed, keep satisfied, monitor). This is standard architect practice
but rarely captured in structured form.

### 6.5 IntegrationPoint

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `scopeId` | UUID (FK → Scope) | Yes | |
| `systemName` | string | Yes | Name of the external system or service. |
| `direction` | Enum: `inbound`, `outbound`, `bidirectional` | Yes | Data/call flow direction. |
| `protocol` | string | No | e.g., "REST", "gRPC", "SFTP", "message queue", "event stream". |
| `dataClassification` | Enum: `public`, `internal`, `confidential`, `restricted` | No | Sensitivity of data crossing this boundary. |
| `owner` | string | No | Team or party responsible for the external system. |
| `sla` | string | No | Known SLA of the external system (e.g., "99.9% uptime, 200ms p99"). |
| `criticality` | Enum: `critical`, `high`, `medium`, `low` | Yes | How dependent the project is on this integration. |
| `description` | string | Yes | What data or calls flow across this integration. |
| `linkedRiskIds` | UUID[] | No | Risks associated with this integration point. |
| `status` | Enum: `confirmed`, `assumed`, `tbd` | Yes | How certain we are this integration exists as described. |

**Rationale:** Integration points are the single most common source of
architectural surprises. Capturing protocol, ownership, data classification,
and SLA turns vague "we integrate with X" into actionable information. The
`status` field is particularly important — "assumed" integrations need
validation before design is finalized.

### 6.6 Constraint

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `scopeId` | UUID (FK → Scope) | Yes | |
| `title` | string | Yes | Short label, e.g., "Must deploy on-premise". |
| `description` | string | Yes | Full description of the constraint and its implications. |
| `type` | Enum: `technical`, `business`, `regulatory`, `resource`, `time` | Yes | |
| `source` | string | Yes | Who or what imposed this constraint (e.g., "GDPR Article 17", "IT Security Policy v3", "CTO mandate"). |
| `isNegotiable` | boolean | Yes | Whether this can be challenged with sufficient justification. |
| `impact` | string | Yes | How this constraint affects the solution space. |
| `linkedRiskIds` | UUID[] | No | Risks that this constraint creates or amplifies. |
| `linkedADRIds` | UUID[] | No | ADRs that respond to this constraint. |
| `linkedStakeholderIds` | UUID[] | No | Stakeholders who imposed or are affected by this constraint. |

**Rationale for typed constraints:** The distinction between technical
("must use AWS"), business ("must integrate with legacy ERP"), regulatory
("must not store PII in US"), resource ("team of 3 for 6 months"), and time
("must go live before Q4 audit") constraints drives completely different risk
profiles. Mixing them into freeform text loses this signal.

---

## 7. Approach

One Approach per Plan. Describes the architectural strategy.

### 7.1 Approach Root

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `planId` | UUID (FK → Plan) | Yes | |
| `strategySummary` | string | Yes | Narrative description of the overall architectural approach. |
| `architecturalStyle` | Enum: `monolith`, `modular-monolith`, `microservices`, `event-driven`, `serverless`, `layered`, `hexagonal`, `pipe-and-filter`, `space-based`, `mixed`, `tbd` | Yes | Primary architectural style. |
| `architecturalStyleRationale` | string | Yes | Why this style was chosen for this context. |
| `createdAt` | timestamp | Yes | |
| `updatedAt` | timestamp | Yes | |

### 7.2 ArchitecturalPattern

Patterns applied within the chosen style (e.g., CQRS, Saga, BFF, Strangler Fig).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `approachId` | UUID (FK → Approach) | Yes | |
| `name` | string | Yes | Pattern name (e.g., "CQRS", "Strangler Fig", "Saga", "BFF"). |
| `description` | string | Yes | How this pattern is applied in this specific context. |
| `applicableComponents` | string[] | No | Which subsystems or components use this pattern. |
| `tradeoffs` | string | **Yes** | Explicit statement of what this pattern costs (complexity, latency, consistency, etc.). |
| `alternatives` | string | No | Patterns considered and rejected, with brief reasons. |
| `linkedADRIds` | UUID[] | No | ADR that formalized the adoption of this pattern. |

**Rationale for required `tradeoffs`:** Patterns without stated tradeoffs
become cargo-culted. Recording "we chose CQRS, and it adds read/write model
synchronization complexity" creates honesty about the decision and makes
future reviews more productive.

### 7.3 TechnologyChoice

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `approachId` | UUID (FK → Approach) | Yes | |
| `category` | Enum: `language`, `framework`, `database`, `messaging`, `infrastructure`, `observability`, `security`, `devops`, `testing`, `other` | Yes | |
| `name` | string | Yes | Technology name and version where applicable. |
| `rationale` | string | Yes | Why this technology was chosen. |
| `alternativesConsidered` | AlternativeOption[] | No | See sub-type below. |
| `linkedADRId` | UUID | No | ADR that formally records this choice. |
| `linkedConstraintIds` | UUID[] | No | Constraints that drove or limited this choice. |
| `linkedNFRIds` | UUID[] | No | NFRs this technology is intended to satisfy. |

**AlternativeOption (sub-type):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Alternative technology name. |
| `rejectionReason` | string | Yes | Why it was not chosen. |

### 7.4 NFR (Non-Functional Requirement)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `approachId` | UUID (FK → Approach) | Yes | |
| `title` | string | Yes | Short label, e.g., "API Response Latency". |
| `category` | Enum: `performance`, `availability`, `scalability`, `security`, `maintainability`, `observability`, `portability`, `compliance`, `cost`, `usability`, `disaster-recovery`, `other` | Yes | |
| `description` | string | Yes | What the requirement is. |
| `target` | string | Yes | Measurable target, e.g., "p95 < 200ms at 1000 RPS". |
| `rationale` | string | Yes | Why this target matters for this project. |
| `verificationApproach` | string | No | How this NFR will be validated (load test, penetration test, audit, etc.). |
| `priority` | Enum: `must`, `should`, `could` | Yes | MoSCoW priority. |
| `linkedRiskIds` | UUID[] | No | Risks to achieving this NFR. |
| `linkedConstraintIds` | UUID[] | No | Constraints that drive this NFR. |

**Rationale for typed NFR categories:** Performance, security, and disaster
recovery NFRs require different testing approaches, team responsibilities,
and vendor selection criteria. Architects who conflate them produce plans
that are hard to validate.

### 7.5 Principle

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `approachId` | UUID (FK → Approach) | Yes | |
| `title` | string | Yes | e.g., "API-first", "Fail fast", "Defence in depth". |
| `description` | string | Yes | What this principle means in practice for this project. |
| `rationale` | string | No | Why this principle is important here. |
| `implications` | string | No | What decisions or constraints this principle creates. |

---

## 8. Risk

One Risk entity per identified risk. A flat list under the Plan.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `planId` | UUID (FK → Plan) | Yes | |
| `title` | string | Yes | Short noun-phrase label, e.g., "Third-party API instability". |
| `description` | string | Yes | Full description of the risk and how it could manifest. |
| `category` | Enum: `technical`, `integration`, `data`, `security`, `compliance`, `resource`, `schedule`, `organizational`, `vendor`, `architectural` | Yes | |
| `likelihood` | Enum: `very-high`, `high`, `medium`, `low`, `very-low` | Yes | Scored 5–1. |
| `impact` | Enum: `catastrophic`, `major`, `moderate`, `minor`, `negligible` | Yes | Scored 5–1. |
| `riskScore` | int 1–25 | Computed | likelihood × impact (5×5 matrix). Not stored; derived on read. |
| `status` | Enum: `open`, `mitigated`, `accepted`, `closed`, `realized` | Yes | Default: `open`. |
| `mitigationStrategy` | string | No | What actions reduce this risk. |
| `mitigationStatus` | Enum: `not-started`, `in-progress`, `complete` | No | |
| `contingencyPlan` | string | No | What to do if the risk is realized despite mitigation. |
| `owner` | string | No | Who is responsible for monitoring and mitigating this risk. |
| `reviewDate` | ISO 8601 date | No | When this risk should be re-evaluated. |
| `linkedConstraintIds` | UUID[] | No | Constraints that create or amplify this risk. |
| `linkedIntegrationPointIds` | UUID[] | No | Integration points this risk is associated with. |
| `linkedNFRIds` | UUID[] | No | NFRs this risk threatens. |
| `linkedADRIds` | UUID[] | No | ADRs that respond to this risk. |
| `linkedOpportunityIds` | UUID[] | No | Opportunities that emerge from addressing this risk. |
| `linkedStakeholderIds` | UUID[] | No | Stakeholders affected by or concerned about this risk. |

**Rationale for `category: architectural`:** Generic risk registers don't
distinguish architectural risks from project management risks. An
"architectural" risk (e.g., "chosen pattern doesn't support required
throughput") needs a different response than a "schedule" risk, and should
trigger ADR review rather than project management escalation.

**Rationale for `contingencyPlan` distinct from `mitigationStrategy`:**
Mitigation reduces the probability or impact before the risk occurs.
Contingency is what you do when it occurs anyway. Conflating them produces
plans that have no real response when something goes wrong.

---

## 9. Opportunity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `planId` | UUID (FK → Plan) | Yes | |
| `title` | string | Yes | Short label. |
| `description` | string | Yes | What the opportunity is and how it could be realized. |
| `category` | Enum: `modernization`, `performance-improvement`, `cost-reduction`, `developer-experience`, `security-improvement`, `scalability`, `technical-debt-reduction`, `strategic-capability`, `other` | Yes | |
| `effortEstimate` | Enum: `days`, `weeks`, `months`, `quarters` | No | Rough effort sizing. |
| `valueStatement` | string | Yes | Concrete description of the value if realized. |
| `status` | Enum: `identified`, `under-consideration`, `accepted`, `deferred`, `rejected` | Yes | Default: `identified`. |
| `statusRationale` | string | No | Required when status is `deferred` or `rejected`. |
| `prerequisites` | string | No | What must be true before this opportunity can be pursued. |
| `linkedRiskIds` | UUID[] | No | Risks that would be addressed by pursuing this opportunity. |
| `linkedStakeholderIds` | UUID[] | No | Stakeholders who would benefit from this opportunity. |

---

## 10. ADR (Architecture Decision Record)

ADRs are first-class entities within a Plan. They follow an established form
(Nygard/MADR-inspired) extended with structured fields.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `planId` | UUID (FK → Plan) | Yes | |
| `sequenceNumber` | int | Yes | Auto-incremented per project. Drives display labels: ADR-001, ADR-002… |
| `title` | string | Yes | Imperative title, e.g., "Use PostgreSQL as primary data store". |
| `status` | Enum: `draft`, `proposed`, `accepted`, `deprecated`, `superseded` | Yes | Default: `draft`. |
| `decisionDate` | ISO 8601 date | No | When the decision was finalized. Required when transitioning to `accepted`. |
| `deciders` | string[] | No | Names or roles of people involved in the decision. |
| `context` | string | Yes | The situation and forces that make this decision necessary. Include technical, business, and organizational context. |
| `problemStatement` | string | Yes | The specific question or problem this ADR answers. |
| `driverType` | Enum: `constraint-driven`, `nfr-driven`, `risk-driven`, `opportunity-driven`, `principle-driven`, `external-mandate` | Yes | Primary driver category. |
| `options` | ADROption[] | Yes | **Minimum 2 options required** before transitioning from `draft` to `proposed`. |
| `decisionOutcome` | string | Yes | Which option was chosen. |
| `decisionRationale` | string | Yes | Why this option was chosen over the others. |
| `positiveConsequences` | string[] | No | Good things that follow from this decision. |
| `negativeConsequences` | string[] | No | Trade-offs accepted with this decision. |
| `reviewTriggers` | string[] | No | Conditions that would prompt revisiting this ADR (e.g., "If throughput exceeds 10k RPS"). |
| `supersededById` | UUID | No | If status is `superseded`, the ADR that replaces this one. |
| `supersedes` | UUID[] | No | ADRs that this ADR replaces. |
| `linkedConstraintIds` | UUID[] | No | |
| `linkedNFRIds` | UUID[] | No | |
| `linkedRiskIds` | UUID[] | No | |
| `linkedOpportunityIds` | UUID[] | No | |
| `linkedStakeholderIds` | UUID[] | No | Stakeholders involved in or affected by this decision. |

**ADROption (sub-type):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `title` | string | Yes | Name of the option. |
| `description` | string | Yes | How this option would work. |
| `pros` | string[] | No | Advantages of this option. |
| `cons` | string[] | No | Disadvantages of this option. |
| `isChosen` | boolean | Yes | Whether this is the selected option. |

**Rationale for `driverType`:** Understanding whether a decision was
constraint-driven, NFR-driven, or risk-driven changes how we evaluate it
later. Constraint-driven decisions should be revisited when constraints
change. NFR-driven decisions should be reviewed when NFR targets shift.

**Rationale for requiring 2+ options:** ADRs with no alternatives recorded
are not real decisions — they are mandates. The presence of at least two
recorded options proves that alternatives were genuinely evaluated. This is
enforced at the application layer: an ADR cannot transition from `draft` to
`proposed` with fewer than two options.

---

## 11. TodoItem (Stretch Goal)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `planId` | UUID (FK → Plan) | Yes | |
| `description` | string | Yes | What needs to be done. |
| `status` | Enum: `open`, `in-progress`, `done`, `cancelled` | Yes | Default: `open`. |
| `linkedElementType` | Enum: `scope`, `approach`, `risk`, `opportunity`, `adr` | No | Type of plan element this TODO relates to. |
| `linkedElementId` | UUID | No | Specific element this TODO relates to. |
| `dueDate` | ISO 8601 date | No | |
| `assignee` | string | No | |

---

## 12. ChatSession and ChatMessage

Supporting entities for the agentic chat history.

### ChatSession

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `planId` | UUID (FK → Plan) | Yes | |
| `startedAt` | timestamp | Yes | |
| `lastMessageAt` | timestamp | Yes | |
| `extractedElementRefs` | ElementRef[] | No | References to all plan elements created or modified in this session. |

### ChatMessage

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | |
| `sessionId` | UUID (FK → ChatSession) | Yes | |
| `role` | Enum: `user`, `assistant`, `system` | Yes | |
| `content` | string | Yes | Message text. |
| `timestamp` | timestamp | Yes | |
| `extractedElements` | ElementRef[] | No | Plan elements proposed by the assistant in this message. |
| `extractionStatus` | Enum: `pending`, `confirmed`, `rejected`, `modified` | No | Aggregate status of all proposed extractions in this message. |

### ElementRef (sub-type)

| Field | Type | Description |
|-------|------|-------------|
| `elementType` | Enum: `scope`, `in-scope-item`, `out-of-scope-item`, `stakeholder`, `integration-point`, `constraint`, `approach`, `pattern`, `tech-choice`, `nfr`, `principle`, `risk`, `opportunity`, `adr`, `todo` | The type of plan element referenced. |
| `elementId` | UUID | The specific element. |
| `action` | Enum: `created`, `updated`, `proposed` | What happened to this element. |

---

## 13. Entity Relationship Summary

```
Project (1) ──── (1) Plan
Plan (1) ──── (1) Scope
Plan (1) ──── (1) Approach
Plan (1) ──── (*) Risk
Plan (1) ──── (*) Opportunity
Plan (1) ──── (*) ADR
Plan (1) ──── (*) TodoItem         [stretch]
Plan (1) ──── (*) ChatSession

Scope (1) ──── (*) InScopeItem
Scope (1) ──── (*) OutOfScopeItem
Scope (1) ──── (*) Stakeholder
Scope (1) ──── (*) IntegrationPoint
Scope (1) ──── (*) Constraint

Approach (1) ──── (*) ArchitecturalPattern
Approach (1) ──── (*) TechnologyChoice
Approach (1) ──── (*) NFR
Approach (1) ──── (*) Principle

ADR (1) ──── (*) ADROption
ADR (*) ──── (*) ADR              [supersedes relationship]

--- Cross-references (UUID arrays, not FK constraints) ---

Risk (*) ──── (*) Constraint
Risk (*) ──── (*) IntegrationPoint
Risk (*) ──── (*) NFR
Risk (*) ──── (*) ADR
Risk (*) ──── (*) Opportunity
Risk (*) ──── (*) Stakeholder

ADR (*) ──── (*) Constraint
ADR (*) ──── (*) NFR
ADR (*) ──── (*) Risk
ADR (*) ──── (*) Opportunity
ADR (*) ──── (*) Stakeholder

Constraint (*) ──── (*) Stakeholder
Opportunity (*) ──── (*) Stakeholder

Stakeholder (*) ──── (*) Risk
Stakeholder (*) ──── (*) Constraint
Stakeholder (*) ──── (*) ADR
Stakeholder (*) ──── (*) Opportunity

ChatSession (1) ──── (*) ChatMessage
ChatMessage (*) ──── references (*) any plan element via ElementRef
```

---

## 14. Enum Reference

### projectType
`greenfield` | `migration` | `modernization` | `integration` | `platform` | `other`

### constraintType
`technical` | `business` | `regulatory` | `resource` | `time`

### stakeholderType
`sponsor` | `decision-maker` | `subject-matter-expert` | `end-user` | `impacted-party` | `regulator`

### integrationPointStatus
`confirmed` | `assumed` | `tbd`

### architecturalStyle
`monolith` | `modular-monolith` | `microservices` | `event-driven` | `serverless` | `layered` | `hexagonal` | `pipe-and-filter` | `space-based` | `mixed` | `tbd`

### nfrCategory
`performance` | `availability` | `scalability` | `security` | `maintainability` | `observability` | `portability` | `compliance` | `cost` | `usability` | `disaster-recovery` | `other`

### riskCategory
`technical` | `integration` | `data` | `security` | `compliance` | `resource` | `schedule` | `organizational` | `vendor` | `architectural`

### riskLikelihood (score)
`very-high` (5) | `high` (4) | `medium` (3) | `low` (2) | `very-low` (1)

### riskImpact (score)
`catastrophic` (5) | `major` (4) | `moderate` (3) | `minor` (2) | `negligible` (1)

### riskStatus
`open` | `mitigated` | `accepted` | `closed` | `realized`

### opportunityCategory
`modernization` | `performance-improvement` | `cost-reduction` | `developer-experience` | `security-improvement` | `scalability` | `technical-debt-reduction` | `strategic-capability` | `other`

### opportunityStatus
`identified` | `under-consideration` | `accepted` | `deferred` | `rejected`

### adrStatus
`draft` | `proposed` | `accepted` | `deprecated` | `superseded`

### adrDriverType
`constraint-driven` | `nfr-driven` | `risk-driven` | `opportunity-driven` | `principle-driven` | `external-mandate`

### technologyCategory
`language` | `framework` | `database` | `messaging` | `infrastructure` | `observability` | `security` | `devops` | `testing` | `other`

---

## 15. Completeness Score Calculation

The Plan `completenessScore` (0–100) is a weighted percentage derived from
required field population and minimum item counts:

| Element | Weight | Complete when |
|---------|--------|---------------|
| `Scope.problemStatement` non-empty | 10 | Field populated |
| `InScopeItem` count | 5 | ≥ 3 items |
| `OutOfScopeItem` count | 5 | ≥ 1 item |
| `Stakeholder` count | 8 | ≥ 2 stakeholders |
| `IntegrationPoint` count | 5 | ≥ 1 (or explicitly marked "none") |
| `Constraint` count | 7 | ≥ 1 (or explicitly marked "none") |
| `Approach.strategySummary` non-empty | 10 | Field populated |
| `NFR` count | 8 | ≥ 3 NFRs |
| `ArchitecturalPattern` count | 5 | ≥ 1 pattern |
| `TechnologyChoice` count | 5 | ≥ 2 choices |
| `Risk` count | 10 | ≥ 2 risks |
| Risk mitigation coverage | 7 | ≥ 50% of risks have `mitigationStrategy` |
| `ADR` count | 10 | ≥ 1 ADR |
| ADR options coverage | 5 | All ADRs have ≥ 2 options |
| **Total** | **100** | |

Score interpretation:
- 0–39: **Early Draft** (gray indicator)
- 40–69: **In Progress** (amber indicator)
- 70–89: **Substantial** (blue indicator)
- 90–100: **Complete** (green indicator)
