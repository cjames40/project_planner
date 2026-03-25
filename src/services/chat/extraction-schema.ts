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
