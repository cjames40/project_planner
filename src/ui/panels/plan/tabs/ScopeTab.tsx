import { useState, useEffect } from 'react'
import { usePlanStore } from '@/stores'
import { InScopeSection } from './scope/InScopeSection'
import { OutOfScopeSection } from './scope/OutOfScopeSection'
import { StakeholderSection } from './scope/StakeholderSection'
import { IntegrationPointSection } from './scope/IntegrationPointSection'
import { ConstraintSection } from './scope/ConstraintSection'

export function ScopeTab() {
  const { scope, updateScope } = usePlanStore()
  const [problemStatement, setProblemStatement] = useState('')
  const [solutionSummary, setSolutionSummary] = useState('')

  useEffect(() => {
    setProblemStatement(scope?.problemStatement ?? '')
    setSolutionSummary(scope?.solutionSummary ?? '')
  }, [scope?.problemStatement, scope?.solutionSummary])

  const handleProblemBlur = () => {
    if (problemStatement !== (scope?.problemStatement ?? '')) {
      updateScope({ problemStatement })
    }
  }

  const handleSolutionBlur = () => {
    if (solutionSummary !== (scope?.solutionSummary ?? '')) {
      updateScope({ solutionSummary })
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Problem Statement */}
      <div>
        <h3 className="mb-1 text-sm font-medium text-zinc-300">Problem Statement</h3>
        <p className="mb-2 text-xs text-zinc-500">What problem does this project solve?</p>
        <textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          onBlur={handleProblemBlur}
          rows={4}
          placeholder="Describe the problem this project addresses..."
          className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 2. Solution Summary */}
      <div>
        <h3 className="mb-1 text-sm font-medium text-zinc-300">Solution Summary</h3>
        <p className="mb-2 text-xs text-zinc-500">High-level description of the proposed solution.</p>
        <textarea
          value={solutionSummary}
          onChange={(e) => setSolutionSummary(e.target.value)}
          onBlur={handleSolutionBlur}
          rows={3}
          placeholder="Describe the proposed solution approach..."
          className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 3-8. Sub-entity sections */}
      <hr className="border-zinc-800" />
      <InScopeSection />
      <hr className="border-zinc-800" />
      <OutOfScopeSection />
      <hr className="border-zinc-800" />
      <StakeholderSection />
      <hr className="border-zinc-800" />
      <IntegrationPointSection />
      <hr className="border-zinc-800" />
      <ConstraintSection />
    </div>
  )
}
