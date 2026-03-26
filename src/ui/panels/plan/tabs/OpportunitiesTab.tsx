import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from './scope/AddItemForm'
import {
  OPPORTUNITY_CATEGORY_LABELS, OPPORTUNITY_STATUS_LABELS, EFFORT_ESTIMATE_LABELS,
} from '@/domain/types'
import type { OpportunityCategory, EffortEstimate, Opportunity } from '@/domain/types'

const STATUS_COLORS: Record<Opportunity['status'], string> = {
  identified: 'blue',
  'under-consideration': 'amber',
  accepted: 'green',
  deferred: 'gray',
  rejected: 'red',
}

export function OpportunitiesTab() {
  const { opportunities, addOpportunity, deleteOpportunity } = usePlanStore()
  const [adding, setAdding] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addOpportunity({
      title: values.title as string,
      description: values.description as string,
      category: values.category as OpportunityCategory,
      valueStatement: values.valueStatement as string,
      effortEstimate: (values.effortEstimate as EffortEstimate) || undefined,
      prerequisites: (values.prerequisites as string) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Opportunities ({opportunities.length})</h3>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add Opportunity</button>
        )}
      </div>

      {adding && (
        <AddItemForm
          fields={[
            { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Short label for the opportunity' },
            { key: 'category', label: 'Category', type: 'select', required: true, options: Object.entries(OPPORTUNITY_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) },
            { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What the opportunity is and how it could be realized' },
            { key: 'valueStatement', label: 'Value Statement', type: 'textarea', required: true, placeholder: 'Concrete description of the value if realized' },
            { key: 'effortEstimate', label: 'Effort Estimate', type: 'select', options: [{ value: '', label: '— Select —' }, ...Object.entries(EFFORT_ESTIMATE_LABELS).map(([v, l]) => ({ value: v, label: l }))] },
            { key: 'prerequisites', label: 'Prerequisites', type: 'text', placeholder: 'What must be true first (optional)' },
          ]}
          onSubmit={handleAdd}
          onCancel={() => setAdding(false)}
        />
      )}

      {opportunities.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No opportunities captured. What could be improved beyond the core scope?</p>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="rounded border border-zinc-800 bg-zinc-900/50 p-3 transition-colors hover:border-zinc-700"
          >
            <div className="mb-1 flex items-start justify-between">
              <button
                onClick={() => setExpandedId(expandedId === opp.id ? null : opp.id)}
                className="text-left"
              >
                <h4 className="text-sm font-medium text-zinc-200">{opp.title}</h4>
              </button>
              <button onClick={() => deleteOpportunity(opp.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
            </div>

            <p className="mb-2 line-clamp-2 text-xs text-zinc-400">{opp.valueStatement}</p>

            <div className="flex flex-wrap gap-1">
              <Badge label={OPPORTUNITY_CATEGORY_LABELS[opp.category] ?? opp.category} color="green" />
              <Badge label={OPPORTUNITY_STATUS_LABELS[opp.status] ?? opp.status} color={STATUS_COLORS[opp.status] as 'blue' | 'amber' | 'green' | 'gray' | 'red'} />
              {opp.effortEstimate && <Badge label={EFFORT_ESTIMATE_LABELS[opp.effortEstimate as EffortEstimate] ?? opp.effortEstimate} color="gray" />}
            </div>

            {expandedId === opp.id && (
              <div className="mt-3 space-y-2 border-t border-zinc-800 pt-3">
                <div>
                  <span className="text-xs font-medium text-zinc-400">Description</span>
                  <p className="text-xs text-zinc-300">{opp.description}</p>
                </div>
                {opp.prerequisites && (
                  <div>
                    <span className="text-xs font-medium text-zinc-400">Prerequisites</span>
                    <p className="text-xs text-zinc-300">{opp.prerequisites}</p>
                  </div>
                )}
                {opp.statusRationale && (
                  <div>
                    <span className="text-xs font-medium text-zinc-400">Status Rationale</span>
                    <p className="text-xs text-zinc-300">{opp.statusRationale}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
