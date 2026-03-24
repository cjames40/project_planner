import type {
  ProjectType, ProjectStatus, CreatedVia,
  RiskCategory, RiskLikelihood, RiskImpact, RiskStatus, MitigationStatus,
  MessageRole, ExtractionStatus, ElementType,
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
