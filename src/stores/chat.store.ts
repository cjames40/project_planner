import { create } from 'zustand'
import type { ChatMessage, ProposedRisk, CreateRiskInput } from '@/domain/types'
import { chatRepository } from '@/services/persistence'
import { streamChatMessage } from '@/services/chat'
import { usePlanStore } from './plan.store'

interface ChatState {
  messages: ChatMessage[]
  sessionId: string | null
  isStreaming: boolean
  streamingContent: string
  pendingProposals: ProposedRisk[]
  error: string | null

  initSession: (planId: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  acceptProposal: (index: number) => Promise<void>
  rejectProposal: (index: number) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessionId: null,
  isStreaming: false,
  streamingContent: '',
  pendingProposals: [],
  error: null,

  async initSession(planId) {
    const session = await chatRepository.getOrCreateSession(planId)
    const messages = await chatRepository.listMessages(session.id)
    set({ sessionId: session.id, messages, error: null })
  },

  async sendMessage(content) {
    const { sessionId } = get()
    if (!sessionId) return

    set({ error: null })

    // Persist user message
    const userMsg = await chatRepository.appendMessage(sessionId, {
      role: 'user',
      content,
    })
    set((s) => ({ messages: [...s.messages, userMsg] }))

    // Stream assistant response
    set({ isStreaming: true, streamingContent: '' })

    try {
      const { text, proposals } = await streamChatMessage(
        get().messages,
        (chunk) => set((s) => ({ streamingContent: s.streamingContent + chunk })),
      )

      // Persist assistant message
      const assistantMsg = await chatRepository.appendMessage(sessionId, {
        role: 'assistant',
        content: text,
      })

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isStreaming: false,
        streamingContent: '',
        pendingProposals: [...s.pendingProposals, ...proposals],
      }))
    } catch (err) {
      set({
        isStreaming: false,
        streamingContent: '',
        error: err instanceof Error ? err.message : 'Chat request failed',
      })
    }
  },

  async acceptProposal(index) {
    const { pendingProposals } = get()
    const proposal = pendingProposals[index]
    if (!proposal || proposal.status !== 'pending') return

    const updated = [...pendingProposals]
    updated[index] = { ...proposal, status: 'accepted' }
    set({ pendingProposals: updated })

    // Add to plan store
    const planStore = usePlanStore.getState()
    await planStore.addRisk(proposal.data)
  },

  rejectProposal(index) {
    const { pendingProposals } = get()
    const proposal = pendingProposals[index]
    if (!proposal || proposal.status !== 'pending') return

    const updated = [...pendingProposals]
    updated[index] = { ...proposal, status: 'rejected' }
    set({ pendingProposals: updated })
  },

  reset() {
    set({
      messages: [],
      sessionId: null,
      isStreaming: false,
      streamingContent: '',
      pendingProposals: [],
      error: null,
    })
  },
}))
