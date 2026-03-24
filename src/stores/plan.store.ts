import { create } from 'zustand'
import type { Plan, Scope, Risk, CreateRiskInput, UpdateScopeInput } from '@/domain/types'
import { planRepository, scopeRepository, riskRepository } from '@/services/persistence'
import { calculateCompletenessScore } from '@/domain/completeness/score'

interface PlanState {
  plan: Plan | null
  scope: Scope | null
  risks: Risk[]
  completenessScore: number
  loading: boolean

  loadPlan: (projectId: string) => Promise<void>
  updateScope: (input: UpdateScopeInput) => Promise<void>
  addRisk: (input: CreateRiskInput) => Promise<Risk>
  deleteRisk: (id: string) => Promise<void>
  reset: () => void
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plan: null,
  scope: null,
  risks: [],
  completenessScore: 0,
  loading: false,

  async loadPlan(projectId) {
    set({ loading: true })
    const plan = await planRepository.getByProjectId(projectId)
    const scope = await scopeRepository.getByPlanId(plan.id)
    const risks = await riskRepository.listByPlanId(plan.id)
    const completenessScore = calculateCompletenessScore(scope, risks)
    set({ plan, scope, risks, completenessScore, loading: false })
  },

  async updateScope(input) {
    const { plan } = get()
    if (!plan) return
    const scope = await scopeRepository.update(plan.id, input)
    const completenessScore = calculateCompletenessScore(scope, get().risks)
    set({ scope, completenessScore })
  },

  async addRisk(input) {
    const { plan } = get()
    if (!plan) throw new Error('No plan loaded')
    const risk = await riskRepository.create(plan.id, input)
    const risks = [...get().risks, risk]
    const completenessScore = calculateCompletenessScore(get().scope, risks)
    set({ risks, completenessScore })
    return risk
  },

  async deleteRisk(id) {
    await riskRepository.delete(id)
    const risks = get().risks.filter((r) => r.id !== id)
    const completenessScore = calculateCompletenessScore(get().scope, risks)
    set({ risks, completenessScore })
  },

  reset() {
    set({ plan: null, scope: null, risks: [], completenessScore: 0, loading: false })
  },
}))
