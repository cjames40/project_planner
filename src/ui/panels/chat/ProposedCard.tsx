import { useChatStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { calculateRiskScore, getRiskScoreColor } from '@/domain/risk-score'
import type { ProposedElement } from '@/domain/types'

interface Props {
  proposal: ProposedElement
  index: number
}

const TYPE_LABELS: Record<ProposedElement['type'], string> = {
  'risk': 'Risk',
  'in-scope-item': 'In Scope',
  'out-of-scope-item': 'Out of Scope',
  'stakeholder': 'Stakeholder',
  'integration-point': 'Integration Point',
  'constraint': 'Constraint',
  'pattern': 'Architectural Pattern',
  'tech-choice': 'Technology Choice',
  'nfr': 'NFR',
  'principle': 'Design Principle',
  'opportunity': 'Opportunity',
}

const TYPE_COLORS: Record<ProposedElement['type'], string> = {
  'risk': 'border-amber-700/50 bg-amber-950/20',
  'in-scope-item': 'border-blue-700/50 bg-blue-950/20',
  'out-of-scope-item': 'border-zinc-600/50 bg-zinc-900/50',
  'stakeholder': 'border-purple-700/50 bg-purple-950/20',
  'integration-point': 'border-cyan-700/50 bg-cyan-950/20',
  'constraint': 'border-orange-700/50 bg-orange-950/20',
  'pattern': 'border-indigo-700/50 bg-indigo-950/20',
  'tech-choice': 'border-emerald-700/50 bg-emerald-950/20',
  'nfr': 'border-rose-700/50 bg-rose-950/20',
  'principle': 'border-teal-700/50 bg-teal-950/20',
  'opportunity': 'border-lime-700/50 bg-lime-950/20',
}

const LABEL_COLORS: Record<ProposedElement['type'], string> = {
  'risk': 'text-amber-400',
  'in-scope-item': 'text-blue-400',
  'out-of-scope-item': 'text-zinc-400',
  'stakeholder': 'text-purple-400',
  'integration-point': 'text-cyan-400',
  'constraint': 'text-orange-400',
  'pattern': 'text-indigo-400',
  'tech-choice': 'text-emerald-400',
  'nfr': 'text-rose-400',
  'principle': 'text-teal-400',
  'opportunity': 'text-lime-400',
}

export function ProposedCard({ proposal, index }: Props) {
  const { acceptProposal, rejectProposal } = useChatStore()

  return (
    <div className={`rounded border p-3 ${TYPE_COLORS[proposal.type]}`}>
      <div className="mb-1 flex items-center gap-2">
        <span className={`text-xs font-medium ${LABEL_COLORS[proposal.type]}`}>
          Proposed {TYPE_LABELS[proposal.type]}
        </span>
        {proposal.type === 'risk' && <RiskScoreBadge likelihood={proposal.data.likelihood} impact={proposal.data.impact} />}
      </div>

      <ProposalContent proposal={proposal} />

      <div className="mt-2 flex gap-2">
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

function RiskScoreBadge({ likelihood, impact }: { likelihood: string; impact: string }) {
  const score = calculateRiskScore(likelihood as never, impact as never)
  const color = getRiskScoreColor(score)
  return <Badge label={String(score)} color={color === 'red' ? 'red' : color === 'amber' ? 'amber' : 'green'} />
}

function ProposalContent({ proposal }: { proposal: ProposedElement }) {
  switch (proposal.type) {
    case 'risk':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.title}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.description}</p>
          {proposal.data.mitigationStrategy && (
            <p className="mt-1 text-xs text-zinc-500">
              <span className="font-medium text-zinc-400">Mitigation:</span> {proposal.data.mitigationStrategy}
            </p>
          )}
        </>
      )
    case 'in-scope-item':
      return (
        <>
          <p className="mb-1 text-sm text-zinc-100">{proposal.data.description}</p>
          {proposal.data.rationale && <p className="text-xs italic text-zinc-400">{proposal.data.rationale}</p>}
          {proposal.data.category && <Badge label={proposal.data.category} color="blue" />}
        </>
      )
    case 'out-of-scope-item':
      return (
        <>
          <p className="mb-1 text-sm text-zinc-100">{proposal.data.description}</p>
          <p className="text-xs italic text-zinc-400">Rationale: {proposal.data.rationale}</p>
          {proposal.data.deferredTo && <p className="text-xs text-zinc-500">Deferred to: {proposal.data.deferredTo}</p>}
        </>
      )
    case 'stakeholder':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.name}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.role} &middot; {proposal.data.type}</p>
          <p className="text-xs text-zinc-500">Concern: {proposal.data.primaryConcern}</p>
        </>
      )
    case 'integration-point':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.systemName}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.description}</p>
          <div className="mt-1 flex gap-1">
            <Badge label={proposal.data.direction} color="blue" />
            <Badge label={proposal.data.criticality} color={proposal.data.criticality === 'critical' ? 'red' : 'gray'} />
          </div>
        </>
      )
    case 'constraint':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.title}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.description}</p>
          <div className="mt-1 flex gap-1">
            <Badge label={proposal.data.type} color="amber" />
            <Badge label={proposal.data.isNegotiable ? 'Negotiable' : 'Non-negotiable'} color={proposal.data.isNegotiable ? 'green' : 'red'} />
          </div>
        </>
      )
    case 'pattern':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.name}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.description}</p>
          <p className="mt-1 text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">Tradeoffs:</span> {proposal.data.tradeoffs}
          </p>
        </>
      )
    case 'tech-choice':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.name}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.rationale}</p>
          <div className="mt-1">
            <Badge label={proposal.data.category} color="green" />
          </div>
        </>
      )
    case 'nfr':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.title}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.description}</p>
          <p className="mt-1 text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">Target:</span> {proposal.data.target}
          </p>
          <div className="mt-1 flex gap-1">
            <Badge label={proposal.data.category} color="blue" />
            <Badge label={proposal.data.priority.toUpperCase()} color={proposal.data.priority === 'must' ? 'red' : proposal.data.priority === 'should' ? 'amber' : 'gray'} />
          </div>
        </>
      )
    case 'principle':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.title}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.description}</p>
          {proposal.data.rationale && (
            <p className="mt-1 text-xs text-zinc-500">
              <span className="font-medium text-zinc-400">Rationale:</span> {proposal.data.rationale}
            </p>
          )}
        </>
      )
    case 'opportunity':
      return (
        <>
          <h4 className="mb-1 text-sm font-medium text-zinc-100">{proposal.data.title}</h4>
          <p className="text-xs text-zinc-400">{proposal.data.description}</p>
          <p className="mt-1 text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">Value:</span> {proposal.data.valueStatement}
          </p>
          <div className="mt-1 flex gap-1">
            <Badge label={proposal.data.category} color="green" />
            {proposal.data.effortEstimate && <Badge label={proposal.data.effortEstimate} color="gray" />}
          </div>
        </>
      )
  }
}
