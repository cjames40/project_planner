import type {
  ProjectType, ProjectStatus, CreatedVia,
  RiskCategory, RiskLikelihood, RiskImpact, RiskStatus, MitigationStatus,
  MessageRole, ExtractionStatus, ElementType,
  InScopeCategory, ConstraintType, StakeholderType, InfluenceLevel, InterestLevel,
  IntegrationDirection, DataClassification, Criticality, IntegrationPointStatus,
} from './enums'

// --- Base fields shared by most entities ---

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
  createdVia: CreatedVia
  tags: string[]
  notes: string
}

// --- Project ---

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  projectType: ProjectType
  status: ProjectStatus
  clientOrOrg: string
  startDate: string
  targetDate: string
  createdAt: string
  updatedAt: string
}

export interface ProjectSummary {
  id: string
  name: string
  slug: string
  projectType: ProjectType
  status: ProjectStatus
  completenessScore: number
  updatedAt: string
}

export interface CreateProjectInput {
  name: string
  projectType: ProjectType
  description: string
  clientOrOrg?: string
  startDate?: string
  targetDate?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  clientOrOrg?: string
  status?: ProjectStatus
  startDate?: string
  targetDate?: string
}

// --- Plan ---

export interface Plan {
  id: string
  projectId: string
  lastChatSessionId: string
  createdAt: string
  updatedAt: string
}

// --- Scope ---

export interface Scope {
  id: string
  planId: string
  problemStatement: string
  solutionSummary: string
  assumptions: string[]
  createdAt: string
  updatedAt: string
}

export interface UpdateScopeInput {
  problemStatement?: string
  solutionSummary?: string
  assumptions?: string[]
}

// --- InScopeItem ---

export interface InScopeItem extends BaseEntity {
  scopeId: string
  description: string
  rationale: string
  category: InScopeCategory | ''
}

export interface CreateInScopeItemInput {
  description: string
  rationale?: string
  category?: InScopeCategory
  createdVia: CreatedVia
}

export interface UpdateInScopeItemInput {
  description?: string
  rationale?: string
  category?: InScopeCategory
}

// --- OutOfScopeItem ---

export interface OutOfScopeItem extends BaseEntity {
  scopeId: string
  description: string
  rationale: string
  deferredTo: string
}

export interface CreateOutOfScopeItemInput {
  description: string
  rationale: string
  deferredTo?: string
  createdVia: CreatedVia
}

export interface UpdateOutOfScopeItemInput {
  description?: string
  rationale?: string
  deferredTo?: string
}

// --- Stakeholder ---

export interface Stakeholder extends BaseEntity {
  scopeId: string
  name: string
  role: string
  type: StakeholderType
  primaryConcern: string
  influenceLevel: InfluenceLevel
  interestLevel: InterestLevel
  communicationNeeds: string
  linkedRiskIds: string[]
  linkedConstraintIds: string[]
  linkedADRIds: string[]
  linkedOpportunityIds: string[]
}

export interface CreateStakeholderInput {
  name: string
  role: string
  type: StakeholderType
  primaryConcern: string
  influenceLevel: InfluenceLevel
  interestLevel: InterestLevel
  communicationNeeds?: string
  createdVia: CreatedVia
}

export interface UpdateStakeholderInput {
  name?: string
  role?: string
  type?: StakeholderType
  primaryConcern?: string
  influenceLevel?: InfluenceLevel
  interestLevel?: InterestLevel
  communicationNeeds?: string
  linkedRiskIds?: string[]
  linkedConstraintIds?: string[]
  linkedADRIds?: string[]
  linkedOpportunityIds?: string[]
}

// --- IntegrationPoint ---

export interface IntegrationPoint extends BaseEntity {
  scopeId: string
  systemName: string
  direction: IntegrationDirection
  protocol: string
  dataClassification: DataClassification | ''
  owner: string
  sla: string
  criticality: Criticality
  description: string
  status: IntegrationPointStatus
  linkedRiskIds: string[]
}

export interface CreateIntegrationPointInput {
  systemName: string
  direction: IntegrationDirection
  criticality: Criticality
  description: string
  status: IntegrationPointStatus
  protocol?: string
  dataClassification?: DataClassification
  owner?: string
  sla?: string
  createdVia: CreatedVia
}

export interface UpdateIntegrationPointInput {
  systemName?: string
  direction?: IntegrationDirection
  protocol?: string
  dataClassification?: DataClassification
  owner?: string
  sla?: string
  criticality?: Criticality
  description?: string
  status?: IntegrationPointStatus
  linkedRiskIds?: string[]
}

// --- Constraint ---

export interface Constraint extends BaseEntity {
  scopeId: string
  title: string
  description: string
  type: ConstraintType
  source: string
  isNegotiable: boolean
  impact: string
  linkedRiskIds: string[]
  linkedADRIds: string[]
  linkedStakeholderIds: string[]
}

export interface CreateConstraintInput {
  title: string
  description: string
  type: ConstraintType
  source: string
  isNegotiable: boolean
  impact: string
  createdVia: CreatedVia
}

export interface UpdateConstraintInput {
  title?: string
  description?: string
  type?: ConstraintType
  source?: string
  isNegotiable?: boolean
  impact?: string
  linkedRiskIds?: string[]
  linkedADRIds?: string[]
  linkedStakeholderIds?: string[]
}

// --- Risk ---

export interface Risk extends BaseEntity {
  planId: string
  title: string
  description: string
  category: RiskCategory
  likelihood: RiskLikelihood
  impact: RiskImpact
  status: RiskStatus
  mitigationStrategy: string
  mitigationStatus: MitigationStatus | ''
  contingencyPlan: string
  owner: string
  reviewDate: string
  linkedConstraintIds: string[]
  linkedIntegrationPointIds: string[]
  linkedNFRIds: string[]
  linkedADRIds: string[]
  linkedOpportunityIds: string[]
  linkedStakeholderIds: string[]
}

export interface CreateRiskInput {
  title: string
  description: string
  category: RiskCategory
  likelihood: RiskLikelihood
  impact: RiskImpact
  mitigationStrategy?: string
  contingencyPlan?: string
  owner?: string
  reviewDate?: string
  createdVia: CreatedVia
}

export interface UpdateRiskInput {
  title?: string
  description?: string
  category?: RiskCategory
  likelihood?: RiskLikelihood
  impact?: RiskImpact
  status?: RiskStatus
  mitigationStrategy?: string
  mitigationStatus?: MitigationStatus
  contingencyPlan?: string
  owner?: string
  reviewDate?: string
  linkedConstraintIds?: string[]
  linkedIntegrationPointIds?: string[]
  linkedNFRIds?: string[]
  linkedADRIds?: string[]
  linkedOpportunityIds?: string[]
  linkedStakeholderIds?: string[]
}

// --- Chat ---

export interface ElementRef {
  elementType: ElementType
  elementId: string
  action: 'created' | 'updated' | 'proposed'
}

export interface ChatSession {
  id: string
  planId: string
  startedAt: string
  lastMessageAt: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: MessageRole
  content: string
  timestamp: string
  extractedElements: ElementRef[]
  extractionStatus: ExtractionStatus | ''
}

export interface CreateChatMessageInput {
  role: MessageRole
  content: string
  extractedElements?: ElementRef[]
  extractionStatus?: ExtractionStatus
}

// --- Proposed extraction (UI-only, not persisted) ---

export interface ProposedRisk {
  type: 'risk'
  data: CreateRiskInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedInScopeItem {
  type: 'in-scope-item'
  data: CreateInScopeItemInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedOutOfScopeItem {
  type: 'out-of-scope-item'
  data: CreateOutOfScopeItemInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedStakeholder {
  type: 'stakeholder'
  data: CreateStakeholderInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedIntegrationPoint {
  type: 'integration-point'
  data: CreateIntegrationPointInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedConstraint {
  type: 'constraint'
  data: CreateConstraintInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export type ProposedElement =
  | ProposedRisk
  | ProposedInScopeItem
  | ProposedOutOfScopeItem
  | ProposedStakeholder
  | ProposedIntegrationPoint
  | ProposedConstraint
