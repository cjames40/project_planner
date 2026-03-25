import { create } from 'zustand'
import type {
  Plan, Scope, Risk, CreateRiskInput, UpdateScopeInput,
  InScopeItem, OutOfScopeItem, Stakeholder, IntegrationPoint, Constraint,
  CreateInScopeItemInput, CreateOutOfScopeItemInput, CreateStakeholderInput,
  CreateIntegrationPointInput, CreateConstraintInput,
} from '@/domain/types'
import {
  planRepository, scopeRepository, riskRepository,
  inScopeItemRepository, outOfScopeItemRepository, stakeholderRepository,
  integrationPointRepository, constraintRepository,
} from '@/services/persistence'
import { calculateCompletenessScore } from '@/domain/completeness/score'

interface PlanState {
  plan: Plan | null
  scope: Scope | null
  risks: Risk[]
  inScopeItems: InScopeItem[]
  outOfScopeItems: OutOfScopeItem[]
  stakeholders: Stakeholder[]
  integrationPoints: IntegrationPoint[]
  constraints: Constraint[]
  completenessScore: number
  loading: boolean

  loadPlan: (projectId: string) => Promise<void>
  updateScope: (input: UpdateScopeInput) => Promise<void>
  addRisk: (input: CreateRiskInput) => Promise<Risk>
  deleteRisk: (id: string) => Promise<void>
  addInScopeItem: (input: CreateInScopeItemInput) => Promise<InScopeItem>
  deleteInScopeItem: (id: string) => Promise<void>
  addOutOfScopeItem: (input: CreateOutOfScopeItemInput) => Promise<OutOfScopeItem>
  deleteOutOfScopeItem: (id: string) => Promise<void>
  addStakeholder: (input: CreateStakeholderInput) => Promise<Stakeholder>
  deleteStakeholder: (id: string) => Promise<void>
  addIntegrationPoint: (input: CreateIntegrationPointInput) => Promise<IntegrationPoint>
  deleteIntegrationPoint: (id: string) => Promise<void>
  addConstraint: (input: CreateConstraintInput) => Promise<Constraint>
  deleteConstraint: (id: string) => Promise<void>
  reset: () => void
}

function recalc(state: PlanState): number {
  return calculateCompletenessScore({
    scope: state.scope,
    risks: state.risks,
    inScopeItemCount: state.inScopeItems.length,
    outOfScopeItemCount: state.outOfScopeItems.length,
    stakeholderCount: state.stakeholders.length,
    integrationPointCount: state.integrationPoints.length,
    constraintCount: state.constraints.length,
  })
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plan: null,
  scope: null,
  risks: [],
  inScopeItems: [],
  outOfScopeItems: [],
  stakeholders: [],
  integrationPoints: [],
  constraints: [],
  completenessScore: 0,
  loading: false,

  async loadPlan(projectId) {
    set({ loading: true })
    const plan = await planRepository.getByProjectId(projectId)
    const scope = await scopeRepository.getByPlanId(plan.id)
    const risks = await riskRepository.listByPlanId(plan.id)

    let inScopeItems: InScopeItem[] = []
    let outOfScopeItems: OutOfScopeItem[] = []
    let stakeholders: Stakeholder[] = []
    let integrationPoints: IntegrationPoint[] = []
    let constraints: Constraint[] = []

    if (scope) {
      ;[inScopeItems, outOfScopeItems, stakeholders, integrationPoints, constraints] = await Promise.all([
        inScopeItemRepository.listByScopeId(scope.id),
        outOfScopeItemRepository.listByScopeId(scope.id),
        stakeholderRepository.listByScopeId(scope.id),
        integrationPointRepository.listByScopeId(scope.id),
        constraintRepository.listByScopeId(scope.id),
      ])
    }

    const newState = { plan, scope, risks, inScopeItems, outOfScopeItems, stakeholders, integrationPoints, constraints, loading: false, completenessScore: 0 }
    newState.completenessScore = calculateCompletenessScore({
      scope, risks,
      inScopeItemCount: inScopeItems.length,
      outOfScopeItemCount: outOfScopeItems.length,
      stakeholderCount: stakeholders.length,
      integrationPointCount: integrationPoints.length,
      constraintCount: constraints.length,
    })
    set(newState)
  },

  async updateScope(input) {
    const { plan } = get()
    if (!plan) return
    const scope = await scopeRepository.update(plan.id, input)
    set({ scope })
    set({ completenessScore: recalc({ ...get(), scope }) })
  },

  async addRisk(input) {
    const { plan } = get()
    if (!plan) throw new Error('No plan loaded')
    const risk = await riskRepository.create(plan.id, input)
    const risks = [...get().risks, risk]
    set({ risks })
    set({ completenessScore: recalc({ ...get(), risks }) })
    return risk
  },

  async deleteRisk(id) {
    await riskRepository.delete(id)
    const risks = get().risks.filter((r) => r.id !== id)
    set({ risks })
    set({ completenessScore: recalc({ ...get(), risks }) })
  },

  async addInScopeItem(input) {
    const { scope } = get()
    if (!scope) throw new Error('No scope loaded')
    const item = await inScopeItemRepository.create(scope.id, input)
    const inScopeItems = [...get().inScopeItems, item]
    set({ inScopeItems })
    set({ completenessScore: recalc({ ...get(), inScopeItems }) })
    return item
  },

  async deleteInScopeItem(id) {
    await inScopeItemRepository.delete(id)
    const inScopeItems = get().inScopeItems.filter((i) => i.id !== id)
    set({ inScopeItems })
    set({ completenessScore: recalc({ ...get(), inScopeItems }) })
  },

  async addOutOfScopeItem(input) {
    const { scope } = get()
    if (!scope) throw new Error('No scope loaded')
    const item = await outOfScopeItemRepository.create(scope.id, input)
    const outOfScopeItems = [...get().outOfScopeItems, item]
    set({ outOfScopeItems })
    set({ completenessScore: recalc({ ...get(), outOfScopeItems }) })
    return item
  },

  async deleteOutOfScopeItem(id) {
    await outOfScopeItemRepository.delete(id)
    const outOfScopeItems = get().outOfScopeItems.filter((i) => i.id !== id)
    set({ outOfScopeItems })
    set({ completenessScore: recalc({ ...get(), outOfScopeItems }) })
  },

  async addStakeholder(input) {
    const { scope } = get()
    if (!scope) throw new Error('No scope loaded')
    const item = await stakeholderRepository.create(scope.id, input)
    const stakeholders = [...get().stakeholders, item]
    set({ stakeholders })
    set({ completenessScore: recalc({ ...get(), stakeholders }) })
    return item
  },

  async deleteStakeholder(id) {
    await stakeholderRepository.delete(id)
    const stakeholders = get().stakeholders.filter((i) => i.id !== id)
    set({ stakeholders })
    set({ completenessScore: recalc({ ...get(), stakeholders }) })
  },

  async addIntegrationPoint(input) {
    const { scope } = get()
    if (!scope) throw new Error('No scope loaded')
    const item = await integrationPointRepository.create(scope.id, input)
    const integrationPoints = [...get().integrationPoints, item]
    set({ integrationPoints })
    set({ completenessScore: recalc({ ...get(), integrationPoints }) })
    return item
  },

  async deleteIntegrationPoint(id) {
    await integrationPointRepository.delete(id)
    const integrationPoints = get().integrationPoints.filter((i) => i.id !== id)
    set({ integrationPoints })
    set({ completenessScore: recalc({ ...get(), integrationPoints }) })
  },

  async addConstraint(input) {
    const { scope } = get()
    if (!scope) throw new Error('No scope loaded')
    const item = await constraintRepository.create(scope.id, input)
    const constraints = [...get().constraints, item]
    set({ constraints })
    set({ completenessScore: recalc({ ...get(), constraints }) })
    return item
  },

  async deleteConstraint(id) {
    await constraintRepository.delete(id)
    const constraints = get().constraints.filter((i) => i.id !== id)
    set({ constraints })
    set({ completenessScore: recalc({ ...get(), constraints }) })
  },

  reset() {
    set({
      plan: null, scope: null, risks: [],
      inScopeItems: [], outOfScopeItems: [], stakeholders: [],
      integrationPoints: [], constraints: [],
      completenessScore: 0, loading: false,
    })
  },
}))
