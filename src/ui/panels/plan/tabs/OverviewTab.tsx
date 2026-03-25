import { usePlanStore, useUIStore } from '@/stores'
import { getCompletenessLabel } from '@/domain/completeness/score'
import { CompletenessIndicator } from '@/ui/components/CompletenessIndicator'

export function OverviewTab() {
  const { scope, risks, inScopeItems, outOfScopeItems, stakeholders, integrationPoints, constraints, completenessScore } = usePlanStore()
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const label = getCompletenessLabel(completenessScore)

  const hasProblemStatement = scope && scope.problemStatement.trim().length > 0
  const hasEnoughRisks = risks.length >= 2
  const hasEnoughInScope = inScopeItems.length >= 3
  const hasOutOfScope = outOfScopeItems.length >= 1
  const hasEnoughStakeholders = stakeholders.length >= 2
  const hasIntegrationPoint = integrationPoints.length >= 1
  const hasConstraint = constraints.length >= 1

  const items = [
    { done: hasProblemStatement, label: 'Problem Statement', sub: hasProblemStatement ? 'Defined' : 'Not yet defined', tab: 'scope' as const },
    { done: hasEnoughRisks, label: 'Risk Assessment', sub: `${risks.length} risk${risks.length !== 1 ? 's' : ''} identified${!hasEnoughRisks ? ' — need at least 2' : ''}`, tab: 'risks' as const },
    { done: hasEnoughInScope, label: 'In-Scope Items', sub: `${inScopeItems.length} item${inScopeItems.length !== 1 ? 's' : ''}${!hasEnoughInScope ? ' — need at least 3' : ''}`, tab: 'scope' as const },
    { done: hasOutOfScope, label: 'Out-of-Scope Items', sub: `${outOfScopeItems.length} item${outOfScopeItems.length !== 1 ? 's' : ''}${!hasOutOfScope ? ' — need at least 1' : ''}`, tab: 'scope' as const },
    { done: hasEnoughStakeholders, label: 'Stakeholders', sub: `${stakeholders.length} stakeholder${stakeholders.length !== 1 ? 's' : ''}${!hasEnoughStakeholders ? ' — need at least 2' : ''}`, tab: 'scope' as const },
    { done: hasIntegrationPoint, label: 'Integration Points', sub: `${integrationPoints.length} point${integrationPoints.length !== 1 ? 's' : ''}${!hasIntegrationPoint ? ' — need at least 1' : ''}`, tab: 'scope' as const },
    { done: hasConstraint, label: 'Constraints', sub: `${constraints.length} constraint${constraints.length !== 1 ? 's' : ''}${!hasConstraint ? ' — need at least 1' : ''}`, tab: 'scope' as const },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <CompletenessIndicator score={completenessScore} />
          <h3 className="text-lg font-semibold text-zinc-100">Plan Completeness</h3>
        </div>
        <p className="text-sm text-zinc-400">
          {completenessScore}% &mdash; {label}
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-300">Checklist</h4>

        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(item.tab)}
            className="flex w-full items-center gap-3 rounded border border-zinc-700 px-4 py-2.5 text-left hover:border-zinc-600"
          >
            <span className={`text-lg ${item.done ? 'text-green-400' : 'text-zinc-600'}`}>
              {item.done ? '\u2713' : '\u25CB'}
            </span>
            <div>
              <div className="text-sm font-medium text-zinc-200">{item.label}</div>
              <div className="text-xs text-zinc-500">{item.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
