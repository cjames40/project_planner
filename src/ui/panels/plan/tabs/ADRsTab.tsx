import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from './scope/AddItemForm'
import { ADR_STATUS_LABELS, ADR_DRIVER_TYPE_LABELS } from '@/domain/types'
import type { ADR, ADRDriverType } from '@/domain/types'

const STATUS_COLORS: Record<ADR['status'], string> = {
  draft: 'gray',
  proposed: 'blue',
  accepted: 'green',
  deprecated: 'amber',
  superseded: 'red',
}

export function ADRsTab() {
  const { adrs, addADR, deleteADR } = usePlanStore()
  const [adding, setAdding] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addADR({
      title: values.title as string,
      context: values.context as string,
      problemStatement: values.problemStatement as string,
      driverType: values.driverType as ADRDriverType,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Architecture Decision Records ({adrs.length})</h3>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ New ADR</button>
        )}
      </div>

      {adding && (
        <AddItemForm
          fields={[
            { key: 'title', label: 'Decision Title', type: 'text', required: true, placeholder: 'e.g., Use PostgreSQL for primary datastore' },
            { key: 'driverType', label: 'Driver', type: 'select', required: true, options: Object.entries(ADR_DRIVER_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })) },
            { key: 'context', label: 'Context', type: 'textarea', required: true, placeholder: 'Background context that frames this decision' },
            { key: 'problemStatement', label: 'Problem Statement', type: 'textarea', required: true, placeholder: 'The specific problem or question this decision addresses' },
          ]}
          onSubmit={handleAdd}
          onCancel={() => setAdding(false)}
          submitLabel="Create ADR"
        />
      )}

      {adrs.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No architecture decisions recorded yet. Capture key decisions as they are made.</p>
      )}

      <div className="space-y-3">
        {adrs.map((adr) => (
          <div
            key={adr.id}
            className="rounded border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700"
          >
            <button
              onClick={() => setExpandedId(expandedId === adr.id ? null : adr.id)}
              className="flex w-full items-center gap-3 p-3 text-left"
            >
              <span className="shrink-0 rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-400">
                ADR-{String(adr.sequenceNumber).padStart(3, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-zinc-200">{adr.title}</h4>
              </div>
              <div className="flex shrink-0 gap-1">
                <Badge label={ADR_STATUS_LABELS[adr.status] ?? adr.status} color={STATUS_COLORS[adr.status] as 'blue' | 'amber' | 'green' | 'gray' | 'red'} />
                <Badge label={ADR_DRIVER_TYPE_LABELS[adr.driverType] ?? adr.driverType} color="blue" />
              </div>
              <span className="ml-1 text-xs text-zinc-600">{expandedId === adr.id ? '▼' : '▶'}</span>
            </button>

            {expandedId === adr.id && (
              <ADRDetail adr={adr} onDelete={() => deleteADR(adr.id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ADRDetail({ adr, onDelete }: { adr: ADR; onDelete: () => void }) {
  return (
    <div className="space-y-4 border-t border-zinc-800 px-3 pb-3 pt-3">
      <Section title="Context">
        <p className="text-xs text-zinc-300 whitespace-pre-wrap">{adr.context}</p>
      </Section>

      <Section title="Problem Statement">
        <p className="text-xs text-zinc-300 whitespace-pre-wrap">{adr.problemStatement}</p>
      </Section>

      {adr.options.length > 0 && (
        <Section title="Options Considered">
          <div className="space-y-2">
            {adr.options.map((opt) => (
              <div key={opt.id} className={`rounded border p-2 ${opt.isChosen ? 'border-green-700/50 bg-green-950/10' : 'border-zinc-700 bg-zinc-800/50'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-200">{opt.title}</span>
                  {opt.isChosen && <Badge label="Chosen" color="green" />}
                </div>
                {opt.description && <p className="mt-1 text-xs text-zinc-400">{opt.description}</p>}
                {opt.pros.length > 0 && (
                  <div className="mt-1">
                    <span className="text-xs text-green-400">Pros: </span>
                    <span className="text-xs text-zinc-400">{opt.pros.join(', ')}</span>
                  </div>
                )}
                {opt.cons.length > 0 && (
                  <div>
                    <span className="text-xs text-red-400">Cons: </span>
                    <span className="text-xs text-zinc-400">{opt.cons.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {adr.decisionOutcome && (
        <Section title="Decision">
          <p className="text-xs text-zinc-300">{adr.decisionOutcome}</p>
          {adr.decisionRationale && (
            <p className="mt-1 text-xs text-zinc-400 italic">Rationale: {adr.decisionRationale}</p>
          )}
        </Section>
      )}

      {(adr.positiveConsequences.length > 0 || adr.negativeConsequences.length > 0) && (
        <Section title="Consequences">
          {adr.positiveConsequences.length > 0 && (
            <div className="mb-1">
              <span className="text-xs font-medium text-green-400">Positive:</span>
              <ul className="ml-3 list-disc">
                {adr.positiveConsequences.map((c, i) => <li key={i} className="text-xs text-zinc-400">{c}</li>)}
              </ul>
            </div>
          )}
          {adr.negativeConsequences.length > 0 && (
            <div>
              <span className="text-xs font-medium text-red-400">Negative:</span>
              <ul className="ml-3 list-disc">
                {adr.negativeConsequences.map((c, i) => <li key={i} className="text-xs text-zinc-400">{c}</li>)}
              </ul>
            </div>
          )}
        </Section>
      )}

      {adr.reviewTriggers.length > 0 && (
        <Section title="Review Triggers">
          <ul className="ml-3 list-disc">
            {adr.reviewTriggers.map((t, i) => <li key={i} className="text-xs text-zinc-400">{t}</li>)}
          </ul>
        </Section>
      )}

      <div className="flex justify-end border-t border-zinc-800 pt-2">
        <button onClick={onDelete} className="text-xs text-zinc-500 hover:text-red-400">Delete ADR</button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="mb-1 text-xs font-medium text-zinc-400">{title}</h5>
      {children}
    </div>
  )
}
