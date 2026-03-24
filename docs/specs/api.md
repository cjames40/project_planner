# API / Data Access Layer Specification
# Architect Project Planner

| Field | Value |
|-------|-------|
| Version | 0.1 |
| Status | Draft |
| Last Revised | 2026-03-24 |

---

## 1. Purpose

This document specifies the internal API — the contract between the UI/domain
layer and the persistence layer. Because MVP is a client-side application with
no network API, this is a TypeScript module interface specification, not an
HTTP API spec.

If a backend is introduced post-MVP, these interfaces map cleanly to REST or
GraphQL endpoints without changes to the domain layer.

All methods return Promises. All IDs are UUIDs (string). Errors are typed —
see Section 10.

---

## 2. ProjectRepository

```typescript
interface ProjectRepository {
  /** Create a new project. Returns the created project with generated id and slug. */
  create(input: CreateProjectInput): Promise<Project>;

  /** Get a project by id. Throws NotFoundError if absent. */
  get(id: string): Promise<Project>;

  /** List all non-archived projects, ordered by updatedAt descending. */
  list(): Promise<ProjectSummary[]>;

  /** Search projects by name (case-insensitive substring match). */
  search(query: string): Promise<ProjectSummary[]>;

  /** Update mutable project fields. Returns updated project. */
  update(id: string, input: UpdateProjectInput): Promise<Project>;

  /** Set project status to 'archived'. */
  archive(id: string): Promise<void>;
}

interface CreateProjectInput {
  name: string;
  projectType: ProjectType;
  description: string;
  clientOrOrg?: string;
  startDate?: string;
  targetDate?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
  clientOrOrg?: string;
  status?: ProjectStatus;
  startDate?: string;
  targetDate?: string;
}

interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  projectType: ProjectType;
  status: ProjectStatus;
  completenessScore: number;
  updatedAt: string;
}
```

---

## 3. PlanRepository

```typescript
interface PlanRepository {
  /**
   * Get the plan for a project.
   * Auto-creates the Plan (and empty Scope + Approach) if not present.
   */
  getByProjectId(projectId: string): Promise<Plan>;
}
```

---

## 4. ScopeRepository

```typescript
interface ScopeRepository {
  getByPlanId(planId: string): Promise<Scope>;
  updateRoot(planId: string, input: UpdateScopeInput): Promise<Scope>;

  // In-scope items
  addInScopeItem(planId: string, input: CreateInScopeItemInput): Promise<InScopeItem>;
  updateInScopeItem(id: string, input: UpdateInScopeItemInput): Promise<InScopeItem>;
  deleteInScopeItem(id: string): Promise<void>;

  // Out-of-scope items
  addOutOfScopeItem(planId: string, input: CreateOutOfScopeItemInput): Promise<OutOfScopeItem>;
  updateOutOfScopeItem(id: string, input: UpdateOutOfScopeItemInput): Promise<OutOfScopeItem>;
  deleteOutOfScopeItem(id: string): Promise<void>;

  // Stakeholders
  addStakeholder(planId: string, input: CreateStakeholderInput): Promise<Stakeholder>;
  updateStakeholder(id: string, input: UpdateStakeholderInput): Promise<Stakeholder>;
  deleteStakeholder(id: string): Promise<void>;

  // Integration points
  addIntegrationPoint(planId: string, input: CreateIntegrationPointInput): Promise<IntegrationPoint>;
  updateIntegrationPoint(id: string, input: UpdateIntegrationPointInput): Promise<IntegrationPoint>;
  deleteIntegrationPoint(id: string): Promise<void>;

  // Constraints
  addConstraint(planId: string, input: CreateConstraintInput): Promise<Constraint>;
  updateConstraint(id: string, input: UpdateConstraintInput): Promise<Constraint>;
  deleteConstraint(id: string): Promise<void>;
}

interface UpdateScopeInput {
  problemStatement?: string;
  solutionSummary?: string;
  assumptions?: string[];
}

interface CreateOutOfScopeItemInput {
  description: string;
  rationale: string;           // required
  deferredTo?: string;
  createdVia: CreatedVia;
}

interface CreateConstraintInput {
  title: string;
  description: string;
  type: ConstraintType;
  source: string;
  isNegotiable: boolean;
  impact: string;
  linkedStakeholderIds?: string[];
  createdVia: CreatedVia;
}

interface CreateStakeholderInput {
  name: string;
  role: string;
  type: StakeholderType;
  primaryConcern: string;
  influenceLevel: InfluenceLevel;
  interestLevel: InterestLevel;
  communicationNeeds?: string;
  linkedRiskIds?: string[];
  linkedConstraintIds?: string[];
  linkedADRIds?: string[];
  linkedOpportunityIds?: string[];
  createdVia: CreatedVia;
}

interface UpdateStakeholderInput {
  name?: string;
  role?: string;
  type?: StakeholderType;
  primaryConcern?: string;
  influenceLevel?: InfluenceLevel;
  interestLevel?: InterestLevel;
  communicationNeeds?: string;
  linkedRiskIds?: string[];
  linkedConstraintIds?: string[];
  linkedADRIds?: string[];
  linkedOpportunityIds?: string[];
}
```

---

## 5. ApproachRepository

```typescript
interface ApproachRepository {
  getByPlanId(planId: string): Promise<Approach>;
  updateRoot(planId: string, input: UpdateApproachInput): Promise<Approach>;

  // Patterns
  addPattern(planId: string, input: CreatePatternInput): Promise<ArchitecturalPattern>;
  updatePattern(id: string, input: UpdatePatternInput): Promise<ArchitecturalPattern>;
  deletePattern(id: string): Promise<void>;

  // Technology choices
  addTechChoice(planId: string, input: CreateTechChoiceInput): Promise<TechnologyChoice>;
  updateTechChoice(id: string, input: UpdateTechChoiceInput): Promise<TechnologyChoice>;
  deleteTechChoice(id: string): Promise<void>;

  // NFRs
  addNFR(planId: string, input: CreateNFRInput): Promise<NFR>;
  updateNFR(id: string, input: UpdateNFRInput): Promise<NFR>;
  deleteNFR(id: string): Promise<void>;

  // Principles
  addPrinciple(planId: string, input: CreatePrincipleInput): Promise<Principle>;
  updatePrinciple(id: string, input: UpdatePrincipleInput): Promise<Principle>;
  deletePrinciple(id: string): Promise<void>;
}

interface UpdateApproachInput {
  strategySummary?: string;
  architecturalStyle?: ArchitecturalStyle;
  architecturalStyleRationale?: string;
}

interface CreatePatternInput {
  name: string;
  description: string;
  tradeoffs: string;           // required
  applicableComponents?: string[];
  alternatives?: string;
  createdVia: CreatedVia;
}

interface CreateNFRInput {
  title: string;
  category: NFRCategory;
  description: string;
  target: string;
  rationale: string;
  priority: MoSCoWPriority;
  verificationApproach?: string;
  createdVia: CreatedVia;
}
```

---

## 6. RiskRepository

```typescript
interface RiskRepository {
  listByPlanId(planId: string): Promise<Risk[]>;
  get(id: string): Promise<Risk>;
  create(planId: string, input: CreateRiskInput): Promise<Risk>;
  update(id: string, input: UpdateRiskInput): Promise<Risk>;
  delete(id: string): Promise<void>;
}

interface CreateRiskInput {
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  mitigationStrategy?: string;
  contingencyPlan?: string;
  owner?: string;
  reviewDate?: string;
  createdVia: CreatedVia;
}

interface UpdateRiskInput {
  title?: string;
  description?: string;
  category?: RiskCategory;
  likelihood?: RiskLikelihood;
  impact?: RiskImpact;
  status?: RiskStatus;
  mitigationStrategy?: string;
  mitigationStatus?: MitigationStatus;
  contingencyPlan?: string;
  owner?: string;
  reviewDate?: string;
  linkedConstraintIds?: string[];
  linkedIntegrationPointIds?: string[];
  linkedNFRIds?: string[];
  linkedADRIds?: string[];
  linkedOpportunityIds?: string[];
  linkedStakeholderIds?: string[];
}
```

---

## 7. OpportunityRepository

```typescript
interface OpportunityRepository {
  listByPlanId(planId: string): Promise<Opportunity[]>;
  get(id: string): Promise<Opportunity>;
  create(planId: string, input: CreateOpportunityInput): Promise<Opportunity>;
  update(id: string, input: UpdateOpportunityInput): Promise<Opportunity>;
  delete(id: string): Promise<void>;
}

interface CreateOpportunityInput {
  title: string;
  description: string;
  category: OpportunityCategory;
  valueStatement: string;
  effortEstimate?: EffortEstimate;
  prerequisites?: string;
  linkedRiskIds?: string[];
  linkedStakeholderIds?: string[];
  createdVia: CreatedVia;
}

interface UpdateOpportunityInput {
  title?: string;
  description?: string;
  category?: OpportunityCategory;
  valueStatement?: string;
  effortEstimate?: EffortEstimate;
  status?: OpportunityStatus;
  statusRationale?: string;
  prerequisites?: string;
  linkedRiskIds?: string[];
  linkedStakeholderIds?: string[];
}
```

---

## 8. ADRRepository

```typescript
interface ADRRepository {
  listByPlanId(planId: string): Promise<ADRSummary[]>;
  get(id: string): Promise<ADR>;

  /** Creates ADR with auto-assigned sequenceNumber for the project. */
  create(planId: string, input: CreateADRInput): Promise<ADR>;
  update(id: string, input: UpdateADRInput): Promise<ADR>;

  /**
   * Transition ADR status. Enforces business rules:
   * - draft → proposed: requires ≥ 2 options
   * - proposed → accepted: requires decisionDate
   * - * → superseded: requires supersededById
   */
  transitionStatus(id: string, newStatus: ADRStatus, meta?: ADRStatusTransitionMeta): Promise<ADR>;

  addOption(adrId: string, option: CreateADROptionInput): Promise<ADROption>;
  updateOption(optionId: string, input: UpdateADROptionInput): Promise<ADROption>;
  deleteOption(optionId: string): Promise<void>;
}

interface CreateADRInput {
  title: string;
  context: string;
  problemStatement: string;
  driverType: ADRDriverType;
  options: CreateADROptionInput[];
  createdVia: CreatedVia;
}

interface ADRStatusTransitionMeta {
  decisionDate?: string;
  supersededById?: string;
}

interface ADRSummary {
  id: string;
  sequenceNumber: number;
  title: string;
  status: ADRStatus;
  driverType: ADRDriverType;
  decisionDate?: string;
  updatedAt: string;
}
```

---

## 9. ChatRepository

```typescript
interface ChatRepository {
  /** Get or create the active session for a plan. */
  getOrCreateSession(planId: string): Promise<ChatSession>;

  listSessions(planId: string): Promise<ChatSessionSummary[]>;

  appendMessage(sessionId: string, message: CreateChatMessageInput): Promise<ChatMessage>;

  listMessages(sessionId: string): Promise<ChatMessage[]>;

  /** Update the extractionStatus of a message after user accepts/rejects cards. */
  updateExtractionStatus(messageId: string, status: ExtractionStatus): Promise<void>;
}

interface CreateChatMessageInput {
  role: MessageRole;
  content: string;
  extractedElements?: ElementRef[];
  extractionStatus?: ExtractionStatus;
}
```

---

## 10. Error Types

```typescript
class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`);
  }
}

class ValidationError extends Error {
  constructor(public readonly errors: FieldError[]) {
    super('Validation failed');
  }
}

class BusinessRuleError extends Error {
  constructor(
    public readonly rule: string,
    message: string
  ) {
    super(message);
  }
}

interface FieldError {
  field: string;
  message: string;
}
```

Business rule errors include:
- `ADR_REQUIRES_TWO_OPTIONS`: thrown when transitioning ADR from `draft` to `proposed` with < 2 options.
- `SUPERSEDED_REQUIRES_REFERENCE`: thrown when marking ADR as `superseded` without `supersededById`.
- `OUT_OF_SCOPE_REQUIRES_RATIONALE`: thrown when creating/updating an OutOfScopeItem without `rationale`.

---

## 11. Shared Type Reference

```typescript
type CreatedVia = 'chat' | 'manual';
type ProjectStatus = 'active' | 'archived' | 'on-hold';
type ProjectType = 'greenfield' | 'migration' | 'modernization' | 'integration' | 'platform' | 'other';
type ConstraintType = 'technical' | 'business' | 'regulatory' | 'resource' | 'time';
type ArchitecturalStyle = 'monolith' | 'modular-monolith' | 'microservices' | 'event-driven' | 'serverless' | 'layered' | 'hexagonal' | 'pipe-and-filter' | 'space-based' | 'mixed' | 'tbd';
type NFRCategory = 'performance' | 'availability' | 'scalability' | 'security' | 'maintainability' | 'observability' | 'portability' | 'compliance' | 'cost' | 'usability' | 'disaster-recovery' | 'other';
type MoSCoWPriority = 'must' | 'should' | 'could';
type RiskCategory = 'technical' | 'integration' | 'data' | 'security' | 'compliance' | 'resource' | 'schedule' | 'organizational' | 'vendor' | 'architectural';
type RiskLikelihood = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
type RiskImpact = 'catastrophic' | 'major' | 'moderate' | 'minor' | 'negligible';
type RiskStatus = 'open' | 'mitigated' | 'accepted' | 'closed' | 'realized';
type MitigationStatus = 'not-started' | 'in-progress' | 'complete';
type OpportunityCategory = 'modernization' | 'performance-improvement' | 'cost-reduction' | 'developer-experience' | 'security-improvement' | 'scalability' | 'technical-debt-reduction' | 'strategic-capability' | 'other';
type EffortEstimate = 'days' | 'weeks' | 'months' | 'quarters';
type OpportunityStatus = 'identified' | 'under-consideration' | 'accepted' | 'deferred' | 'rejected';
type ADRStatus = 'draft' | 'proposed' | 'accepted' | 'deprecated' | 'superseded';
type ADRDriverType = 'constraint-driven' | 'nfr-driven' | 'risk-driven' | 'opportunity-driven' | 'principle-driven' | 'external-mandate';
type TechnologyCategory = 'language' | 'framework' | 'database' | 'messaging' | 'infrastructure' | 'observability' | 'security' | 'devops' | 'testing' | 'other';
type StakeholderType = 'sponsor' | 'decision-maker' | 'subject-matter-expert' | 'end-user' | 'impacted-party' | 'regulator';
type InfluenceLevel = 'high' | 'medium' | 'low';
type InterestLevel = 'high' | 'medium' | 'low';
type MessageRole = 'user' | 'assistant' | 'system';
type ExtractionStatus = 'pending' | 'confirmed' | 'rejected' | 'modified';
type ElementType = 'scope' | 'in-scope-item' | 'out-of-scope-item' | 'stakeholder' | 'integration-point' | 'constraint' | 'approach' | 'pattern' | 'tech-choice' | 'nfr' | 'principle' | 'risk' | 'opportunity' | 'adr' | 'todo';

interface ElementRef {
  elementType: ElementType;
  elementId: string;
  action: 'created' | 'updated' | 'proposed';
}
```
