import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from './AddItemForm'
import { CONSTRAINT_TYPE_LABELS } from '@/domain/types'
import type { ConstraintType } from '@/domain/types'

export function ConstraintSection() {
  const { constraints, addConstraint, deleteConstraint } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addConstraint({
      title: values.title as string,
      description: values.description as string,
      type: values.type as ConstraintType,
      source: values.source as string,
      isNegotiable: values.isNegotiable as boolean,
      impact: values.impact as string,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  // Group by type
  const grouped = constraints.reduce<Record<string, typeof constraints>>((acc, c) => {
    const key = c.type
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Constraints ({constraints.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g., Must deploy on-premise' },
              { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Full description of the constraint' },
              { key: 'type', label: 'Type', type: 'select', required: true, options: Object.entries(CONSTRAINT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'source', label: 'Source', type: 'text', required: true, placeholder: 'Who imposed this? (e.g., GDPR, CTO)' },
              { key: 'isNegotiable', label: 'Negotiable', type: 'checkbox' },
              { key: 'impact', label: 'Impact', type: 'textarea', required: true, placeholder: 'How does this affect the solution space?' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {constraints.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No constraints yet. Identify at least 1 for completeness.</p>
      )}

      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="mb-3">
          <h5 className="mb-1 text-xs font-medium text-zinc-500">{CONSTRAINT_TYPE_LABELS[type as ConstraintType]}</h5>
          <div className="space-y-1">
            {items.map((c) => (
              <div key={c.id} className="flex items-start justify-between rounded border border-zinc-800 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200">{c.title}</span>
                    <Badge label={c.isNegotiable ? 'Negotiable' : 'Non-negotiable'} color={c.isNegotiable ? 'green' : 'red'} />
                  </div>
                  <p className="text-xs text-zinc-400">{c.description}</p>
                  <p className="text-xs text-zinc-500">Source: {c.source}</p>
                </div>
                <button onClick={() => deleteConstraint(c.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
