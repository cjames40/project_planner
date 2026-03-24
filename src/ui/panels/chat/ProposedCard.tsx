import { useChatStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { calculateRiskScore, getRiskScoreColor } from '@/domain/risk-score'
import type { ProposedRisk } from '@/domain/types'

interface Props {
  proposal: ProposedRisk
  index: number
}

export function ProposedCard({ proposal, index }: Props) {
  const { acceptProposal, rejectProposal } = useChatStore()
  const { data } = proposal

  const score = calculateRiskScore(data.likelihood, data.impact)
  const color = getRiskScoreColor(score)

  return (
    <div className="rounded border border-amber-700/50 bg-amber-950/20 p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-medium text-amber-400">Proposed Risk</span>
        <Badge label={String(score)} color={color === 'red' ? 'red' : color === 'amber' ? 'amber' : 'green'} />
      </div>
      <h4 className="mb-1 text-sm font-medium text-zinc-100">{data.title}</h4>
      <p className="mb-2 text-xs text-zinc-400">{data.description}</p>

      {data.mitigationStrategy && (
        <p className="mb-2 text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">Mitigation:</span> {data.mitigationStrategy}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => acceptProposal(index)}
          className="rounded bg-green-700 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => rejectProposal(index)}
          className="rounded bg-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
        >
          Reject
        </button>
      </div>
    </div>
  )
}
