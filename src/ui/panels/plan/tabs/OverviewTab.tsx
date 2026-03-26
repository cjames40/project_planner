import { usePlanStore, useUIStore } from '@/stores'
import { getCompletenessLabel } from '@/domain/completeness/score'
import { CompletenessIndicator } from '@/ui/components/CompletenessIndicator'
import { Badge } from '@/ui/components/Badge'
import { PROJECT_TYPE_LABELS } from '@/domain/types'

export function OverviewTab() {
  const { project, scope, risks, inScopeItems, outOfScopeItems, stakeholders, integrationPoints, constraints, approach, patterns, techChoices, nfrs, principles, opportunities, completenessScore } = usePlanStore()
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const label = getCompletenessLabel(completenessScore)

  const hasProblemStatement = scope && scope.problemStatement.trim().length > 0
  const hasEnoughRisks = risks.length >= 2
  const hasEnoughInScope = inScopeItems.length >= 3
  const hasOutOfScope = outOfScopeItems.length >= 1
  const hasEnoughStakeholders = stakeholders.length >= 2
  const hasIntegrationPoint = integrationPoints.length >= 1
  const hasConstraint = constraints.length >= 1
  const hasArchStyle = approach && approach.architecturalStyle !== 'tbd'
  const hasPattern = patterns.length >= 1
  const hasEnoughTechChoices = techChoices.length >= 2
  const hasEnoughNFRs = nfrs.length >= 2
  const hasPrinciple = principles.length >= 1
  const hasOpportunity = opportunities.length >= 1

  const items = [
    { done: hasProblemStatement, label: 'Problem Statement', sub: hasProblemStatement ? 'Defined' : 'Not yet defined', tab: 'scope' as const },
    { done: hasEnoughRisks, label: 'Risk Assessment', sub: `${risks.length} risk${risks.length !== 1 ? 's' : ''} identified${!hasEnoughRisks ? ' — need at least 2' : ''}`, tab: 'risks' as const },
    { done: hasEnoughInScope, label: 'In-Scope Items', sub: `${inScopeItems.length} item${inScopeItems.length !== 1 ? 's' : ''}${!hasEnoughInScope ? ' — need at least 3' : ''}`, tab: 'scope' as const },
    { done: hasOutOfScope, label: 'Out-of-Scope Items', sub: `${outOfScopeItems.length} item${outOfScopeItems.length !== 1 ? 's' : ''}${!hasOutOfScope ? ' — need at least 1' : ''}`, tab: 'scope' as const },
    { done: hasEnoughStakeholders, label: 'Stakeholders', sub: `${stakeholders.length} stakeholder${stakeholders.length !== 1 ? 's' : ''}${!hasEnoughStakeholders ? ' — need at least 2' : ''}`, tab: 'scope' as const },
    { done: hasIntegrationPoint, label: 'Integration Points', sub: `${integrationPoints.length} point${integrationPoints.length !== 1 ? 's' : ''}${!hasIntegrationPoint ? ' — need at least 1' : ''}`, tab: 'scope' as const },
    { done: hasConstraint, label: 'Constraints', sub: `${constraints.length} constraint${constraints.length !== 1 ? 's' : ''}${!hasConstraint ? ' — need at least 1' : ''}`, tab: 'scope' as const },
    { done: hasArchStyle, label: 'Architectural Style', sub: hasArchStyle ? 'Selected' : 'Not yet selected', tab: 'approach' as const },
    { done: hasPattern, label: 'Architectural Patterns', sub: `${patterns.length} pattern${patterns.length !== 1 ? 's' : ''}${!hasPattern ? ' — need at least 1' : ''}`, tab: 'approach' as const },
    { done: hasEnoughTechChoices, label: 'Technology Choices', sub: `${techChoices.length} choice${techChoices.length !== 1 ? 's' : ''}${!hasEnoughTechChoices ? ' — need at least 2' : ''}`, tab: 'approach' as const },
    { done: hasEnoughNFRs, label: 'Non-Functional Requirements', sub: `${nfrs.length} NFR${nfrs.length !== 1 ? 's' : ''}${!hasEnoughNFRs ? ' — need at least 2' : ''}`, tab: 'approach' as const },
    { done: hasPrinciple, label: 'Design Principles', sub: `${principles.length} principle${principles.length !== 1 ? 's' : ''}${!hasPrinciple ? ' — need at least 1' : ''}`, tab: 'approach' as const },
    { done: hasOpportunity, label: 'Opportunities', sub: `${opportunities.length} opportunit${opportunities.length !== 1 ? 'ies' : 'y'}${!hasOpportunity ? ' — need at least 1' : ''}`, tab: 'opportunities' as const },
  ]

  return (
    <div className="space-y-6">
      {project && (
        <div className="rounded border border-zinc-700 bg-zinc-900 p-4">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-100">{project.name}</h3>
            <Badge label={PROJECT_TYPE_LABELS[project.projectType]} color="blue" />
          </div>
          <p className="text-sm text-zinc-400">{project.description}</p>
          {project.clientOrOrg && (
            <p className="mt-1 text-xs text-zinc-500">Client/Org: {project.clientOrOrg}</p>
          )}
        </div>
      )}

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
