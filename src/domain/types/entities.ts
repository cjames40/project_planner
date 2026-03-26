import type {
  ProjectType, ProjectStatus, CreatedVia,
  RiskCategory, RiskLikelihood, RiskImpact, RiskStatus, MitigationStatus,
  MessageRole, ExtractionStatus, ElementType,
  InScopeCategory, ConstraintType, StakeholderType, InfluenceLevel, InterestLevel,
  IntegrationDirection, DataClassification, Criticality, IntegrationPointStatus,
  ArchitecturalStyle, NFRCategory, MoSCoWPriority, TechnologyCategory,
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

// --- Approach ---

export interface Approach {
  id: string
  planId: string
  strategySummary: string
  architecturalStyle: ArchitecturalStyle
  architecturalStyleRationale: string
  createdAt: string
  updatedAt: string
}

export interface UpdateApproachInput {
  strategySummary?: string
  architecturalStyle?: ArchitecturalStyle
  architecturalStyleRationale?: string
}

// --- ArchitecturalPattern ---

export interface ArchitecturalPattern extends BaseEntity {
  approachId: string
  name: string
  description: string
  applicableComponents: string[]
  tradeoffs: string
  alternatives: string
  linkedADRIds: string[]
}

export interface CreatePatternInput {
  name: string
  description: string
  tradeoffs: string
  applicableComponents?: string[]
  alternatives?: string
  createdVia: CreatedVia
}

export interface UpdatePatternInput {
  name?: string
  description?: string
  tradeoffs?: string
  applicableComponents?: string[]
  alternatives?: string
  linkedADRIds?: string[]
}

// --- TechnologyChoice ---

export interface AlternativeOption {
  name: string
  rejectionReason: string
}

export interface TechnologyChoice extends BaseEntity {
  approachId: string
  category: TechnologyCategory
  name: string
  rationale: string
  alternativesConsidered: AlternativeOption[]
  linkedADRId: string
  linkedConstraintIds: string[]
  linkedNFRIds: string[]
}

export interface CreateTechChoiceInput {
  category: TechnologyCategory
  name: string
  rationale: string
  alternativesConsidered?: AlternativeOption[]
  createdVia: CreatedVia
}

export interface UpdateTechChoiceInput {
  category?: TechnologyCategory
  name?: string
  rationale?: string
  alternativesConsidered?: AlternativeOption[]
  linkedADRId?: string
  linkedConstraintIds?: string[]
  linkedNFRIds?: string[]
}

// --- NFR ---

export interface NFR extends BaseEntity {
  approachId: string
  title: string
  category: NFRCategory
  description: string
  target: string
  rationale: string
  verificationApproach: string
  priority: MoSCoWPriority
  linkedRiskIds: string[]
  linkedConstraintIds: string[]
}

export interface CreateNFRInput {
  title: string
  category: NFRCategory
  description: string
  target: string
  rationale: string
  priority: MoSCoWPriority
  verificationApproach?: string
  createdVia: CreatedVia
}

export interface UpdateNFRInput {
  title?: string
  category?: NFRCategory
  description?: string
  target?: string
  rationale?: string
  verificationApproach?: string
  priority?: MoSCoWPriority
  linkedRiskIds?: string[]
  linkedConstraintIds?: string[]
}

// --- Principle ---

export interface Principle extends BaseEntity {
  approachId: string
  title: string
  description: string
  rationale: string
  implications: string
}

export interface CreatePrincipleInput {
  title: string
  description: string
  rationale?: string
  implications?: string
  createdVia: CreatedVia
}

export interface UpdatePrincipleInput {
  title?: string
  description?: string
  rationale?: string
  implications?: string
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

export interface ProposedPattern {
  type: 'pattern'
  data: CreatePatternInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedTechChoice {
  type: 'tech-choice'
  data: CreateTechChoiceInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedNFR {
  type: 'nfr'
  data: CreateNFRInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export interface ProposedPrinciple {
  type: 'principle'
  data: CreatePrincipleInput
  status: 'pending' | 'accepted' | 'rejected' | 'editing'
}

export type ProposedElement =
  | ProposedRisk
  | ProposedInScopeItem
  | ProposedOutOfScopeItem
  | ProposedStakeholder
  | ProposedIntegrationPoint
  | ProposedConstraint
  | ProposedPattern
  | ProposedTechChoice
  | ProposedNFR
  | ProposedPrinciple
