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

export const IN_SCOPE_CATEGORY_LABELS: Record<InScopeCategory, string> = {
  functional: 'Functional',
  data: 'Data',
  integration: 'Integration',
  infrastructure: 'Infrastructure',
  process: 'Process',
  security: 'Security',
  other: 'Other',
}

export const CONSTRAINT_TYPE_LABELS: Record<ConstraintType, string> = {
  technical: 'Technical',
  business: 'Business',
  regulatory: 'Regulatory',
  resource: 'Resource',
  time: 'Time',
}

export const STAKEHOLDER_TYPE_LABELS: Record<StakeholderType, string> = {
  sponsor: 'Sponsor',
  'decision-maker': 'Decision Maker',
  'subject-matter-expert': 'SME',
  'end-user': 'End User',
  'impacted-party': 'Impacted Party',
  regulator: 'Regulator',
}

export const CRITICALITY_LABELS: Record<Criticality, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const INTEGRATION_DIRECTION_LABELS: Record<IntegrationDirection, string> = {
  inbound: 'Inbound',
  outbound: 'Outbound',
  bidirectional: 'Bidirectional',
}

export const INTEGRATION_POINT_STATUS_LABELS: Record<IntegrationPointStatus, string> = {
  confirmed: 'Confirmed',
  assumed: 'Assumed',
  tbd: 'TBD',
}

export const DATA_CLASSIFICATION_LABELS: Record<DataClassification, string> = {
  public: 'Public',
  internal: 'Internal',
  confidential: 'Confidential',
  restricted: 'Restricted',
}

export const ARCHITECTURAL_STYLE_LABELS: Record<ArchitecturalStyle, string> = {
  monolith: 'Monolith',
  'modular-monolith': 'Modular Monolith',
  microservices: 'Microservices',
  'event-driven': 'Event-Driven',
  serverless: 'Serverless',
  layered: 'Layered',
  hexagonal: 'Hexagonal',
  'pipe-and-filter': 'Pipe and Filter',
  'space-based': 'Space-Based',
  mixed: 'Mixed',
  tbd: 'TBD',
}

export const NFR_CATEGORY_LABELS: Record<NFRCategory, string> = {
  performance: 'Performance',
  availability: 'Availability',
  scalability: 'Scalability',
  security: 'Security',
  maintainability: 'Maintainability',
  observability: 'Observability',
  portability: 'Portability',
  compliance: 'Compliance',
  cost: 'Cost',
  usability: 'Usability',
  'disaster-recovery': 'Disaster Recovery',
  other: 'Other',
}

export const MOSCOW_PRIORITY_LABELS: Record<MoSCoWPriority, string> = {
  must: 'Must',
  should: 'Should',
  could: 'Could',
}

export const TECHNOLOGY_CATEGORY_LABELS: Record<TechnologyCategory, string> = {
  language: 'Language',
  framework: 'Framework',
  database: 'Database',
  messaging: 'Messaging',
  infrastructure: 'Infrastructure',
  observability: 'Observability',
  security: 'Security',
  devops: 'DevOps',
  testing: 'Testing',
  other: 'Other',
}

export const OPPORTUNITY_CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  modernization: 'Modernization',
  'performance-improvement': 'Performance Improvement',
  'cost-reduction': 'Cost Reduction',
  'developer-experience': 'Developer Experience',
  'security-improvement': 'Security Improvement',
  scalability: 'Scalability',
  'technical-debt-reduction': 'Technical Debt Reduction',
  'strategic-capability': 'Strategic Capability',
  other: 'Other',
}

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  identified: 'Identified',
  'under-consideration': 'Under Consideration',
  accepted: 'Accepted',
  deferred: 'Deferred',
  rejected: 'Rejected',
}

export const EFFORT_ESTIMATE_LABELS: Record<EffortEstimate, string> = {
  days: 'Days',
  weeks: 'Weeks',
  months: 'Months',
  quarters: 'Quarters',
}
