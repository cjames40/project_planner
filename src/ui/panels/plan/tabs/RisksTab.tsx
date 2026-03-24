import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { calculateRiskScore, getRiskScoreColor } from '@/domain/risk-score'
import { RISK_CATEGORY_LABELS } from '@/domain/types'
import type { RiskScoreColor } from '@/domain/risk-score'

const scoreColorMap: Record<RiskScoreColor, 'red' | 'amber' | 'green'> = {
  red: 'red',
  amber: 'amber',
  green: 'green',
}

export function RisksTab() {
  const { risks } = usePlanStore()

  if (risks.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-zinc-500">
          No risks identified yet. Use the chat to discuss potential risks.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="mb-3 text-sm font-medium text-zinc-300">
        Risk Register ({risks.length})
      </h3>

      <div className="space-y-2">
        {risks.map((risk) => {
          const score = calculateRiskScore(risk.likelihood, risk.impact)
          const color = getRiskScoreColor(score)

          return (
            <div
              key={risk.id}
              className="rounded border border-zinc-700 bg-zinc-900 p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-zinc-100">{risk.title}</h4>
                <Badge label={String(score)} color={scoreColorMap[color]} />
              </div>
              <p className="mb-2 text-xs text-zinc-400">{risk.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge label={RISK_CATEGORY_LABELS[risk.category]} color="purple" />
                <Badge label={risk.likelihood} color="gray" />
                <Badge label={risk.impact} color="gray" />
              </div>
              {risk.mitigationStrategy && (
                <div className="mt-2 border-t border-zinc-800 pt-2">
                  <p className="text-xs text-zinc-500">
                    <span className="font-medium text-zinc-400">Mitigation:</span>{' '}
                    {risk.mitigationStrategy}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
