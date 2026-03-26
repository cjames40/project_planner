import { create } from 'zustand'
import type {
  Project, Plan, Scope, Risk, CreateRiskInput, UpdateScopeInput,
  InScopeItem, OutOfScopeItem, Stakeholder, IntegrationPoint, Constraint,
  CreateInScopeItemInput, CreateOutOfScopeItemInput, CreateStakeholderInput,
  CreateIntegrationPointInput, CreateConstraintInput,
  Approach, UpdateApproachInput, ArchitecturalPattern, CreatePatternInput,
  TechnologyChoice, CreateTechChoiceInput, NFR, CreateNFRInput,
  Principle, CreatePrincipleInput,
  Opportunity, CreateOpportunityInput,
} from '@/domain/types'
import {
  projectRepository, planRepository, scopeRepository, riskRepository,
  inScopeItemRepository, outOfScopeItemRepository, stakeholderRepository,
  integrationPointRepository, constraintRepository,
  approachRepository, patternRepository, techChoiceRepository, nfrRepository, principleRepository,
  opportunityRepository,
} from '@/services/persistence'
import { calculateCompletenessScore } from '@/domain/completeness/score'

interface PlanState {
  project: Project | null
  plan: Plan | null
  scope: Scope | null
  risks: Risk[]
  inScopeItems: InScopeItem[]
  outOfScopeItems: OutOfScopeItem[]
  stakeholders: Stakeholder[]
  integrationPoints: IntegrationPoint[]
  constraints: Constraint[]
  approach: Approach | null
  patterns: ArchitecturalPattern[]
  techChoices: TechnologyChoice[]
  nfrs: NFR[]
  principles: Principle[]
  opportunities: Opportunity[]
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
  updateApproach: (input: UpdateApproachInput) => Promise<void>
  addPattern: (input: CreatePatternInput) => Promise<ArchitecturalPattern>
  deletePattern: (id: string) => Promise<void>
  addTechChoice: (input: CreateTechChoiceInput) => Promise<TechnologyChoice>
  deleteTechChoice: (id: string) => Promise<void>
  addNFR: (input: CreateNFRInput) => Promise<NFR>
  deleteNFR: (id: string) => Promise<void>
  addPrinciple: (input: CreatePrincipleInput) => Promise<Principle>
  deletePrinciple: (id: string) => Promise<void>
  addOpportunity: (input: CreateOpportunityInput) => Promise<Opportunity>
  deleteOpportunity: (id: string) => Promise<void>
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
    approach: state.approach,
    patternCount: state.patterns.length,
    techChoiceCount: state.techChoices.length,
    nfrCount: state.nfrs.length,
    principleCount: state.principles.length,
    opportunityCount: state.opportunities.length,
  })
}

export const usePlanStore = create<PlanState>((set, get) => ({
  project: null,
  plan: null,
  scope: null,
  risks: [],
  inScopeItems: [],
  outOfScopeItems: [],
  stakeholders: [],
  integrationPoints: [],
  constraints: [],
  approach: null,
  patterns: [],
  techChoices: [],
  nfrs: [],
  principles: [],
  opportunities: [],
  completenessScore: 0,
  loading: false,

  async loadPlan(projectId) {
    set({ loading: true })
    const project = await projectRepository.getById(projectId)
    const plan = await planRepository.getByProjectId(projectId)
    const scope = await scopeRepository.getByPlanId(plan.id)
    const risks = await riskRepository.listByPlanId(plan.id)
    const opportunities = await opportunityRepository.listByPlanId(plan.id)
    const approach = await approachRepository.getByPlanId(plan.id)

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

    let patterns: ArchitecturalPattern[] = []
    let techChoices: TechnologyChoice[] = []
    let nfrs: NFR[] = []
    let principles: Principle[] = []

    if (approach) {
      ;[patterns, techChoices, nfrs, principles] = await Promise.all([
        patternRepository.listByApproachId(approach.id),
        techChoiceRepository.listByApproachId(approach.id),
        nfrRepository.listByApproachId(approach.id),
        principleRepository.listByApproachId(approach.id),
      ])
    }

    const newState = {
      project, plan, scope, risks, opportunities, inScopeItems, outOfScopeItems, stakeholders,
      integrationPoints, constraints, approach, patterns, techChoices, nfrs, principles,
      loading: false, completenessScore: 0,
    }
    newState.completenessScore = calculateCompletenessScore({
      scope, risks,
      inScopeItemCount: inScopeItems.length,
      outOfScopeItemCount: outOfScopeItems.length,
      stakeholderCount: stakeholders.length,
      integrationPointCount: integrationPoints.length,
      constraintCount: constraints.length,
      approach,
      patternCount: patterns.length,
      techChoiceCount: techChoices.length,
      nfrCount: nfrs.length,
      principleCount: principles.length,
      opportunityCount: opportunities.length,
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

  async updateApproach(input) {
    const { plan } = get()
    if (!plan) return
    const approach = await approachRepository.update(plan.id, input)
    set({ approach })
    set({ completenessScore: recalc({ ...get(), approach }) })
  },

  async addPattern(input) {
    const { approach } = get()
    if (!approach) throw new Error('No approach loaded')
    const item = await patternRepository.create(approach.id, input)
    const patterns = [...get().patterns, item]
    set({ patterns })
    set({ completenessScore: recalc({ ...get(), patterns }) })
    return item
  },

  async deletePattern(id) {
    await patternRepository.delete(id)
    const patterns = get().patterns.filter((i) => i.id !== id)
    set({ patterns })
    set({ completenessScore: recalc({ ...get(), patterns }) })
  },

  async addTechChoice(input) {
    const { approach } = get()
    if (!approach) throw new Error('No approach loaded')
    const item = await techChoiceRepository.create(approach.id, input)
    const techChoices = [...get().techChoices, item]
    set({ techChoices })
    set({ completenessScore: recalc({ ...get(), techChoices }) })
    return item
  },

  async deleteTechChoice(id) {
    await techChoiceRepository.delete(id)
    const techChoices = get().techChoices.filter((i) => i.id !== id)
    set({ techChoices })
    set({ completenessScore: recalc({ ...get(), techChoices }) })
  },

  async addNFR(input) {
    const { approach } = get()
    if (!approach) throw new Error('No approach loaded')
    const item = await nfrRepository.create(approach.id, input)
    const nfrs = [...get().nfrs, item]
    set({ nfrs })
    set({ completenessScore: recalc({ ...get(), nfrs }) })
    return item
  },

  async deleteNFR(id) {
    await nfrRepository.delete(id)
    const nfrs = get().nfrs.filter((i) => i.id !== id)
    set({ nfrs })
    set({ completenessScore: recalc({ ...get(), nfrs }) })
  },

  async addPrinciple(input) {
    const { approach } = get()
    if (!approach) throw new Error('No approach loaded')
    const item = await principleRepository.create(approach.id, input)
    const principles = [...get().principles, item]
    set({ principles })
    set({ completenessScore: recalc({ ...get(), principles }) })
    return item
  },

  async deletePrinciple(id) {
    await principleRepository.delete(id)
    const principles = get().principles.filter((i) => i.id !== id)
    set({ principles })
    set({ completenessScore: recalc({ ...get(), principles }) })
  },

  async addOpportunity(input) {
    const { plan } = get()
    if (!plan) throw new Error('No plan loaded')
    const item = await opportunityRepository.create(plan.id, input)
    const opportunities = [...get().opportunities, item]
    set({ opportunities })
    set({ completenessScore: recalc({ ...get(), opportunities }) })
    return item
  },

  async deleteOpportunity(id) {
    await opportunityRepository.delete(id)
    const opportunities = get().opportunities.filter((i) => i.id !== id)
    set({ opportunities })
    set({ completenessScore: recalc({ ...get(), opportunities }) })
  },

  reset() {
    set({
      project: null, plan: null, scope: null, risks: [],
      inScopeItems: [], outOfScopeItems: [], stakeholders: [],
      integrationPoints: [], constraints: [],
      approach: null, patterns: [], techChoices: [], nfrs: [], principles: [],
      opportunities: [],
      completenessScore: 0, loading: false,
    })
  },
}))
