import { z } from 'zod'

export const proposeRiskSchema = z.object({
  title: z.string().describe('Short, descriptive title for the risk'),
  description: z.string().describe('Detailed description of the risk and its potential impact'),
  category: z.enum([
    'technical', 'integration', 'data', 'security', 'compliance',
    'resource', 'schedule', 'organizational', 'vendor', 'architectural',
  ]).describe('Risk category'),
  likelihood: z.enum(['very-high', 'high', 'medium', 'low', 'very-low']).describe('How likely is this risk to occur'),
  impact: z.enum(['catastrophic', 'major', 'moderate', 'minor', 'negligible']).describe('Impact severity if the risk materializes'),
  mitigationStrategy: z.string().optional().describe('Suggested mitigation approach'),
})

export const proposeInScopeItemSchema = z.object({
  description: z.string().describe('What is included in scope'),
  rationale: z.string().optional().describe('Why this is in scope, especially when non-obvious'),
  category: z.enum(['functional', 'data', 'integration', 'infrastructure', 'process', 'security', 'other']).optional().describe('Scope category'),
})

export const proposeOutOfScopeItemSchema = z.object({
  description: z.string().describe('What is explicitly excluded from scope'),
  rationale: z.string().describe('Why this is out of scope — required to prevent scope creep debates'),
  deferredTo: z.string().optional().describe('Future phase or project this is deferred to'),
})

export const proposeStakeholderSchema = z.object({
  name: z.string().describe('Person or role name'),
  role: z.string().describe('Organizational role (e.g., VP Engineering, Data Privacy Officer)'),
  type: z.enum(['sponsor', 'decision-maker', 'subject-matter-expert', 'end-user', 'impacted-party', 'regulator']).describe('Stakeholder type'),
  primaryConcern: z.string().describe('What they care most about in this project'),
  influenceLevel: z.enum(['high', 'medium', 'low']).describe('Ability to influence project direction'),
  interestLevel: z.enum(['high', 'medium', 'low']).describe('How much they care about the outcome'),
})

export const proposeIntegrationPointSchema = z.object({
  systemName: z.string().describe('Name of the external system or service'),
  direction: z.enum(['inbound', 'outbound', 'bidirectional']).describe('Data/call flow direction'),
  criticality: z.enum(['critical', 'high', 'medium', 'low']).describe('How dependent the project is on this integration'),
  description: z.string().describe('What data or calls flow across this integration'),
  status: z.enum(['confirmed', 'assumed', 'tbd']).describe('How certain we are this integration exists as described'),
  protocol: z.string().optional().describe('e.g., REST, gRPC, SFTP, message queue'),
  owner: z.string().optional().describe('Team or party responsible for the external system'),
})

export const proposeConstraintSchema = z.object({
  title: z.string().describe('Short label, e.g., "Must deploy on-premise"'),
  description: z.string().describe('Full description of the constraint and its implications'),
  type: z.enum(['technical', 'business', 'regulatory', 'resource', 'time']).describe('Constraint type'),
  source: z.string().describe('Who or what imposed this constraint (e.g., GDPR Article 17, CTO mandate)'),
  isNegotiable: z.boolean().describe('Whether this can be challenged with sufficient justification'),
  impact: z.string().describe('How this constraint affects the solution space'),
})

export const proposePatternSchema = z.object({
  name: z.string().describe('Pattern name, e.g., "CQRS", "Saga", "BFF"'),
  description: z.string().describe('What this pattern does and how it applies to this project'),
  tradeoffs: z.string().describe('Key tradeoffs of using this pattern (pros and cons)'),
  applicableComponents: z.array(z.string()).optional().describe('Which components or services this pattern applies to'),
  alternatives: z.string().optional().describe('Alternative patterns that were considered'),
})

export const proposeTechChoiceSchema = z.object({
  category: z.enum(['language', 'framework', 'database', 'messaging', 'infrastructure', 'observability', 'security', 'devops', 'testing', 'other']).describe('Technology category'),
  name: z.string().describe('Technology name, e.g., "PostgreSQL", "Kubernetes", "TypeScript"'),
  rationale: z.string().describe('Why this technology was chosen over alternatives'),
  alternativesConsidered: z.array(z.object({
    name: z.string().describe('Alternative technology name'),
    rejectionReason: z.string().describe('Why this alternative was not chosen'),
  })).optional().describe('Alternatives that were evaluated'),
})

export const proposeNFRSchema = z.object({
  title: z.string().describe('Short name, e.g., "API Response Time"'),
  category: z.enum(['performance', 'availability', 'scalability', 'security', 'maintainability', 'observability', 'portability', 'compliance', 'cost', 'usability', 'disaster-recovery', 'other']).describe('NFR category'),
  description: z.string().describe('What this requirement means in the context of this project'),
  target: z.string().describe('Measurable target, e.g., "P99 latency < 200ms"'),
  rationale: z.string().describe('Why this NFR matters for the project'),
  priority: z.enum(['must', 'should', 'could']).describe('MoSCoW priority'),
  verificationApproach: z.string().optional().describe('How this NFR will be tested or verified'),
})

export const proposePrincipleSchema = z.object({
  title: z.string().describe('Short name, e.g., "API-First Design"'),
  description: z.string().describe('What this principle means and how it guides decisions'),
  rationale: z.string().optional().describe('Why this principle was adopted'),
  implications: z.string().optional().describe('What this principle means in practice — what teams must/must not do'),
})

export const proposeOpportunitySchema = z.object({
  title: z.string().describe('Short label for the opportunity'),
  description: z.string().describe('What the opportunity is and how it could be realized'),
  category: z.enum(['modernization', 'performance-improvement', 'cost-reduction', 'developer-experience', 'security-improvement', 'scalability', 'technical-debt-reduction', 'strategic-capability', 'other']).describe('Opportunity category'),
  valueStatement: z.string().describe('Concrete description of the value if realized'),
  effortEstimate: z.enum(['days', 'weeks', 'months', 'quarters']).optional().describe('Rough effort sizing'),
  prerequisites: z.string().optional().describe('What must be true before this opportunity can be pursued'),
})
