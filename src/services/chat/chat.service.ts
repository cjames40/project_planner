import { streamText, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { ChatMessage, ProposedRisk } from '@/domain/types'
import { proposeRiskSchema } from './extraction-schema'
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
): Promise<{ text: string; proposals: ProposedRisk[] }> {
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

  const proposals: ProposedRisk[] = []

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
        description: 'Propose a risk that has been identified in the conversation. Use this when you identify a concrete, specific risk the project faces.',
        parameters: proposeRiskSchema,
        execute: async (args) => {
          proposals.push({
            type: 'risk',
            data: {
              ...args,
              createdVia: 'chat',
            },
            status: 'pending',
          })
          return { success: true, message: `Risk proposed: ${args.title}` }
        },
      }),
    },
    maxSteps: 3,
    abortSignal: AbortSignal.timeout(30000),
  })

  let fullText = ''
  for await (const chunk of result.textStream) {
    fullText += chunk
    onChunk(chunk)
  }

  return { text: fullText, proposals }
}
