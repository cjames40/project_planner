import { create } from 'zustand'

type ModalState = 'none' | 'new-project' | 'settings'
type PlanTab = 'overview' | 'scope' | 'risks' | 'approach' | 'opportunities' | 'adrs' | 'todos'

interface UIState {
  sidebarCollapsed: boolean
  activeTab: PlanTab
  modalState: ModalState
  splitRatio: number

  toggleSidebar: () => void
  setActiveTab: (tab: PlanTab) => void
  openModal: (modal: ModalState) => void
  closeModal: () => void
  setSplitRatio: (ratio: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeTab: 'overview',
  modalState: 'none',
  splitRatio: 0.4,

  toggleSidebar() {
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }))
  },

  setActiveTab(tab) {
    set({ activeTab: tab })
  },

  openModal(modal) {
    set({ modalState: modal })
  },

  closeModal() {
    set({ modalState: 'none' })
  },

  setSplitRatio(ratio) {
    set({ splitRatio: Math.max(0.2, Math.min(0.8, ratio)) })
  },
}))
