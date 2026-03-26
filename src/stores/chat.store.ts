import { create } from 'zustand'
import type { ChatMessage, ProposedElement } from '@/domain/types'
import { chatRepository } from '@/services/persistence'
import { streamChatMessage } from '@/services/chat'
import { usePlanStore } from './plan.store'

interface ChatState {
  messages: ChatMessage[]
  sessionId: string | null
  isStreaming: boolean
  streamingContent: string
  pendingProposals: ProposedElement[]
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

    const userMsg = await chatRepository.appendMessage(sessionId, {
      role: 'user',
      content,
    })
    set((s) => ({ messages: [...s.messages, userMsg] }))

    set({ isStreaming: true, streamingContent: '' })

    try {
      const { text, proposals } = await streamChatMessage(
        get().messages,
        (chunk) => set((s) => ({ streamingContent: s.streamingContent + chunk })),
      )

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
    updated[index] = { ...proposal, status: 'accepted' } as ProposedElement
    set({ pendingProposals: updated })

    const planStore = usePlanStore.getState()
    switch (proposal.type) {
      case 'risk':
        await planStore.addRisk(proposal.data)
        break
      case 'in-scope-item':
        await planStore.addInScopeItem(proposal.data)
        break
      case 'out-of-scope-item':
        await planStore.addOutOfScopeItem(proposal.data)
        break
      case 'stakeholder':
        await planStore.addStakeholder(proposal.data)
        break
      case 'integration-point':
        await planStore.addIntegrationPoint(proposal.data)
        break
      case 'constraint':
        await planStore.addConstraint(proposal.data)
        break
      case 'pattern':
        await planStore.addPattern(proposal.data)
        break
      case 'tech-choice':
        await planStore.addTechChoice(proposal.data)
        break
      case 'nfr':
        await planStore.addNFR(proposal.data)
        break
      case 'principle':
        await planStore.addPrinciple(proposal.data)
        break
    }
  },

  rejectProposal(index) {
    const { pendingProposals } = get()
    const proposal = pendingProposals[index]
    if (!proposal || proposal.status !== 'pending') return

    const updated = [...pendingProposals]
    updated[index] = { ...proposal, status: 'rejected' } as ProposedElement
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
