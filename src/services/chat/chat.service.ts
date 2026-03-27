import { streamText, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { ChatMessage, ProposedElement } from '@/domain/types'
import {
  proposeRiskSchema, proposeInScopeItemSchema, proposeOutOfScopeItemSchema,
  proposeStakeholderSchema, proposeIntegrationPointSchema, proposeConstraintSchema,
  proposePatternSchema, proposeTechChoiceSchema, proposeNFRSchema, proposePrincipleSchema,
  proposeOpportunitySchema,
  proposeADRSchema,
} from './extraction-schema'
import { buildSystemPrompt } from './system-prompt'
import { useProjectStore } from '@/stores/project.store'
import { usePlanStore } from '@/stores/plan.store'
import { projectRepository } from '@/services/persistence'

const API_KEY_STORAGE = 'architect-planner-openai-key'
const MODEL_STORAGE = 'architect-planner-openai-model'

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) ?? ''
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key)
}

export function getModel(): string {
  return localStorage.getItem(MODEL_STORAGE) ?? 'gpt-4o'
}

export function setModel(model: string): void {
  localStorage.setItem(MODEL_STORAGE, model)
}

export async function streamChatMessage(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
): Promise<{ text: string; proposals: ProposedElement[] }> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Open Settings to add your key.')
  }

  const openai = createOpenAI({ apiKey, compatibility: 'strict' })
  const model = getModel()

  // Build context
  const projectId = useProjectStore.getState().selectedProjectId
  let systemPrompt = 'You are an expert software architect assistant.'
  if (projectId) {
    try {
      const project = await projectRepository.getById(projectId)
      const scope = usePlanStore.getState().scope
      systemPrompt = buildSystemPrompt(project.projectType, scope?.problemStatement ?? '')
    } catch {
      // Fall back to generic prompt
    }
  }

  const proposals: ProposedElement[] = []

  const aiMessages = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const result = streamText({
    model: openai(model),
    system: systemPrompt,
    messages: aiMessages,
    tools: {
      proposeRisk: tool({
        description: 'Propose a risk that has been identified in the conversation.',
        parameters: proposeRiskSchema,
        execute: async (args) => {
          proposals.push({ type: 'risk', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Risk proposed: ${args.title}` }
        },
      }),
      proposeInScopeItem: tool({
        description: 'Propose something that should be in scope for this project.',
        parameters: proposeInScopeItemSchema,
        execute: async (args) => {
          proposals.push({ type: 'in-scope-item', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `In-scope item proposed: ${args.description.slice(0, 50)}` }
        },
      }),
      proposeOutOfScopeItem: tool({
        description: 'Propose something that should be explicitly out of scope. Always provide a rationale.',
        parameters: proposeOutOfScopeItemSchema,
        execute: async (args) => {
          proposals.push({ type: 'out-of-scope-item', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Out-of-scope item proposed: ${args.description.slice(0, 50)}` }
        },
      }),
      proposeStakeholder: tool({
        description: 'Propose a stakeholder who should be tracked for this project.',
        parameters: proposeStakeholderSchema,
        execute: async (args) => {
          proposals.push({ type: 'stakeholder', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Stakeholder proposed: ${args.name}` }
        },
      }),
      proposeIntegrationPoint: tool({
        description: 'Propose an external system integration that the project depends on.',
        parameters: proposeIntegrationPointSchema,
        execute: async (args) => {
          proposals.push({ type: 'integration-point', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Integration point proposed: ${args.systemName}` }
        },
      }),
      proposeConstraint: tool({
        description: 'Propose a constraint that limits the solution space for this project.',
        parameters: proposeConstraintSchema,
        execute: async (args) => {
          proposals.push({ type: 'constraint', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Constraint proposed: ${args.title}` }
        },
      }),
      proposePattern: tool({
        description: 'Propose an architectural pattern to use in this project (e.g., CQRS, Saga, BFF).',
        parameters: proposePatternSchema,
        execute: async (args) => {
          proposals.push({ type: 'pattern', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Pattern proposed: ${args.name}` }
        },
      }),
      proposeTechChoice: tool({
        description: 'Propose a technology choice for the project (language, framework, database, etc.).',
        parameters: proposeTechChoiceSchema,
        execute: async (args) => {
          proposals.push({ type: 'tech-choice', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Technology choice proposed: ${args.name}` }
        },
      }),
      proposeNFR: tool({
        description: 'Propose a non-functional requirement with a measurable target.',
        parameters: proposeNFRSchema,
        execute: async (args) => {
          proposals.push({ type: 'nfr', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `NFR proposed: ${args.title}` }
        },
      }),
      proposePrinciple: tool({
        description: 'Propose a design principle that should guide architectural decisions.',
        parameters: proposePrincipleSchema,
        execute: async (args) => {
          proposals.push({ type: 'principle', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Principle proposed: ${args.title}` }
        },
      }),
      proposeOpportunity: tool({
        description: 'Propose a technical improvement opportunity beyond the core scope (e.g., modernization, performance, cost reduction).',
        parameters: proposeOpportunitySchema,
        execute: async (args) => {
          proposals.push({ type: 'opportunity', data: { ...args, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `Opportunity proposed: ${args.title}` }
        },
      }),
      proposeADR: tool({
        description: 'Propose an Architecture Decision Record when a significant technical decision is being made or discussed. Include options with pros/cons when possible.',
        parameters: proposeADRSchema,
        execute: async (args) => {
          const options = (args.options ?? []).map((o, i) => ({ ...o, id: `opt-${i}`, isChosen: false }))
          proposals.push({ type: 'adr', data: { ...args, options, createdVia: 'chat' as const }, status: 'pending' })
          return { success: true, message: `ADR proposed: ${args.title}` }
        },
      }),
    },
    maxSteps: 5,
    abortSignal: AbortSignal.timeout(30000),
  })

  let fullText = ''
  for await (const chunk of result.textStream) {
    fullText += chunk
    onChunk(chunk)
  }

  return { text: fullText, proposals }
}
