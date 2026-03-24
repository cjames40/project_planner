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

export type ProposeRiskInput = z.infer<typeof proposeRiskSchema>
