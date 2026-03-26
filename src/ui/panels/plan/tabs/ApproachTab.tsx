import { useState, useEffect } from 'react'
import { usePlanStore } from '@/stores'
import { ARCHITECTURAL_STYLE_LABELS } from '@/domain/types'
import type { ArchitecturalStyle } from '@/domain/types'
import { PatternSection } from './approach/PatternSection'
import { TechChoiceSection } from './approach/TechChoiceSection'
import { NFRSection } from './approach/NFRSection'
import { PrincipleSection } from './approach/PrincipleSection'

const styleOptions = Object.entries(ARCHITECTURAL_STYLE_LABELS) as [ArchitecturalStyle, string][]

export function ApproachTab() {
  const { approach, updateApproach } = usePlanStore()
  const [strategySummary, setStrategySummary] = useState('')
  const [archStyle, setArchStyle] = useState<ArchitecturalStyle>('tbd')
  const [archRationale, setArchRationale] = useState('')

  useEffect(() => {
    setStrategySummary(approach?.strategySummary ?? '')
    setArchStyle(approach?.architecturalStyle ?? 'tbd')
    setArchRationale(approach?.architecturalStyleRationale ?? '')
  }, [approach?.strategySummary, approach?.architecturalStyle, approach?.architecturalStyleRationale])

  const handleSummaryBlur = () => {
    if (strategySummary !== (approach?.strategySummary ?? '')) {
      updateApproach({ strategySummary })
    }
  }

  const handleStyleChange = (style: ArchitecturalStyle) => {
    setArchStyle(style)
    updateApproach({ architecturalStyle: style })
  }

  const handleRationaleBlur = () => {
    if (archRationale !== (approach?.architecturalStyleRationale ?? '')) {
      updateApproach({ architecturalStyleRationale: archRationale })
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Strategy Summary */}
      <div>
        <h3 className="mb-1 text-sm font-medium text-zinc-300">Strategy Summary</h3>
        <p className="mb-2 text-xs text-zinc-500">High-level summary of the technical approach and key decisions.</p>
        <textarea
          value={strategySummary}
          onChange={(e) => setStrategySummary(e.target.value)}
          onBlur={handleSummaryBlur}
          rows={3}
          placeholder="Describe the overall technical strategy..."
          className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 2. Architectural Style */}
      <div>
        <h3 className="mb-1 text-sm font-medium text-zinc-300">Architectural Style</h3>
        <p className="mb-2 text-xs text-zinc-500">The primary architectural style for this project.</p>
        <select
          value={archStyle}
          onChange={(e) => handleStyleChange(e.target.value as ArchitecturalStyle)}
          className="mb-2 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
        >
          {styleOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <textarea
          value={archRationale}
          onChange={(e) => setArchRationale(e.target.value)}
          onBlur={handleRationaleBlur}
          rows={2}
          placeholder="Why this architectural style was chosen..."
          className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 3-6. Sub-entity sections */}
      <hr className="border-zinc-800" />
      <PatternSection />
      <hr className="border-zinc-800" />
      <TechChoiceSection />
      <hr className="border-zinc-800" />
      <NFRSection />
      <hr className="border-zinc-800" />
      <PrincipleSection />
    </div>
  )
}
