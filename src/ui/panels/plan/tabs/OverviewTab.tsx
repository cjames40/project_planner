import { usePlanStore, useUIStore } from '@/stores'
import { getCompletenessLabel } from '@/domain/completeness/score'
import { CompletenessIndicator } from '@/ui/components/CompletenessIndicator'

export function OverviewTab() {
  const { scope, risks, completenessScore } = usePlanStore()
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const label = getCompletenessLabel(completenessScore)

  const hasProblemStatement = scope && scope.problemStatement.trim().length > 0
  const hasEnoughRisks = risks.length >= 2

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

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-zinc-300">Checklist</h4>

        <button
          onClick={() => setActiveTab('scope')}
          className="flex w-full items-center gap-3 rounded border border-zinc-700 px-4 py-3 text-left hover:border-zinc-600"
        >
          <span className={`text-lg ${hasProblemStatement ? 'text-green-400' : 'text-zinc-600'}`}>
            {hasProblemStatement ? '\u2713' : '\u25CB'}
          </span>
          <div>
            <div className="text-sm font-medium text-zinc-200">Problem Statement</div>
            <div className="text-xs text-zinc-500">
              {hasProblemStatement ? 'Defined' : 'Not yet defined — click to add'}
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('risks')}
          className="flex w-full items-center gap-3 rounded border border-zinc-700 px-4 py-3 text-left hover:border-zinc-600"
        >
          <span className={`text-lg ${hasEnoughRisks ? 'text-green-400' : 'text-zinc-600'}`}>
            {hasEnoughRisks ? '\u2713' : '\u25CB'}
          </span>
          <div>
            <div className="text-sm font-medium text-zinc-200">Risk Assessment</div>
            <div className="text-xs text-zinc-500">
              {risks.length} risk{risks.length !== 1 ? 's' : ''} identified
              {!hasEnoughRisks ? ' — identify at least 2' : ''}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
