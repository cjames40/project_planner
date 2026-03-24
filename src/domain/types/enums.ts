// Project
export type ProjectType = 'greenfield' | 'migration' | 'modernization' | 'integration' | 'platform' | 'other'
export type ProjectStatus = 'active' | 'archived' | 'on-hold'

// Provenance
export type CreatedVia = 'chat' | 'manual'

// Scope
export type ConstraintType = 'technical' | 'business' | 'regulatory' | 'resource' | 'time'
export type StakeholderType = 'sponsor' | 'decision-maker' | 'subject-matter-expert' | 'end-user' | 'impacted-party' | 'regulator'
export type InfluenceLevel = 'high' | 'medium' | 'low'
export type InterestLevel = 'high' | 'medium' | 'low'
export type IntegrationDirection = 'inbound' | 'outbound' | 'bidirectional'
export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted'
export type Criticality = 'critical' | 'high' | 'medium' | 'low'
export type IntegrationPointStatus = 'confirmed' | 'assumed' | 'tbd'
export type InScopeCategory = 'functional' | 'data' | 'integration' | 'infrastructure' | 'process' | 'security' | 'other'

// Approach
export type ArchitecturalStyle = 'monolith' | 'modular-monolith' | 'microservices' | 'event-driven' | 'serverless' | 'layered' | 'hexagonal' | 'pipe-and-filter' | 'space-based' | 'mixed' | 'tbd'
export type NFRCategory = 'performance' | 'availability' | 'scalability' | 'security' | 'maintainability' | 'observability' | 'portability' | 'compliance' | 'cost' | 'usability' | 'disaster-recovery' | 'other'
export type MoSCoWPriority = 'must' | 'should' | 'could'
export type TechnologyCategory = 'language' | 'framework' | 'database' | 'messaging' | 'infrastructure' | 'observability' | 'security' | 'devops' | 'testing' | 'other'

// Risks
export type RiskCategory = 'technical' | 'integration' | 'data' | 'security' | 'compliance' | 'resource' | 'schedule' | 'organizational' | 'vendor' | 'architectural'
export type RiskLikelihood = 'very-high' | 'high' | 'medium' | 'low' | 'very-low'
export type RiskImpact = 'catastrophic' | 'major' | 'moderate' | 'minor' | 'negligible'
export type RiskStatus = 'open' | 'mitigated' | 'accepted' | 'closed' | 'realized'
export type MitigationStatus = 'not-started' | 'in-progress' | 'complete'

// Opportunities
export type OpportunityCategory = 'modernization' | 'performance-improvement' | 'cost-reduction' | 'developer-experience' | 'security-improvement' | 'scalability' | 'technical-debt-reduction' | 'strategic-capability' | 'other'
export type OpportunityStatus = 'identified' | 'under-consideration' | 'accepted' | 'deferred' | 'rejected'
export type EffortEstimate = 'days' | 'weeks' | 'months' | 'quarters'

// ADRs
export type ADRStatus = 'draft' | 'proposed' | 'accepted' | 'deprecated' | 'superseded'
export type ADRDriverType = 'constraint-driven' | 'nfr-driven' | 'risk-driven' | 'opportunity-driven' | 'principle-driven' | 'external-mandate'

// Chat
export type MessageRole = 'user' | 'assistant' | 'system'
export type ExtractionStatus = 'pending' | 'confirmed' | 'rejected' | 'modified'
export type ElementType = 'scope' | 'in-scope-item' | 'out-of-scope-item' | 'stakeholder' | 'integration-point' | 'constraint' | 'approach' | 'pattern' | 'tech-choice' | 'nfr' | 'principle' | 'risk' | 'opportunity' | 'adr' | 'todo'

// TODO
export type TodoStatus = 'open' | 'in-progress' | 'done' | 'cancelled'

// Display labels
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  greenfield: 'Greenfield',
  migration: 'Migration',
  modernization: 'Modernization',
  integration: 'Integration',
  platform: 'Platform',
  other: 'Other',
}

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  technical: 'Technical',
  integration: 'Integration',
  data: 'Data',
  security: 'Security',
  compliance: 'Compliance',
  resource: 'Resource',
  schedule: 'Schedule',
  organizational: 'Organizational',
  vendor: 'Vendor',
  architectural: 'Architectural',
}
