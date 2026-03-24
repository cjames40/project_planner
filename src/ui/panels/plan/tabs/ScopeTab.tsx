import { useState, useEffect } from 'react'
import { usePlanStore } from '@/stores'

export function ScopeTab() {
  const { scope, updateScope } = usePlanStore()
  const [problemStatement, setProblemStatement] = useState('')

  useEffect(() => {
    setProblemStatement(scope?.problemStatement ?? '')
  }, [scope?.problemStatement])

  const handleBlur = () => {
    if (problemStatement !== (scope?.problemStatement ?? '')) {
      updateScope({ problemStatement })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-sm font-medium text-zinc-300">Problem Statement</h3>
        <p className="mb-3 text-xs text-zinc-500">
          What problem does this project solve? Who is affected?
        </p>
        <textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          onBlur={handleBlur}
          rows={6}
          placeholder="Describe the problem this project addresses..."
          className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  )
}
