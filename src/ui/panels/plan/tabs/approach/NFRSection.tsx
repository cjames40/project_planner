import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from '../scope/AddItemForm'
import { NFR_CATEGORY_LABELS, MOSCOW_PRIORITY_LABELS } from '@/domain/types'
import type { NFRCategory, MoSCoWPriority } from '@/domain/types'

export function NFRSection() {
  const { nfrs, addNFR, deleteNFR } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addNFR({
      title: values.title as string,
      category: values.category as NFRCategory,
      description: values.description as string,
      target: values.target as string,
      rationale: values.rationale as string,
      priority: values.priority as MoSCoWPriority,
      verificationApproach: (values.verificationApproach as string) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  const priorityColor = (p: MoSCoWPriority) => p === 'must' ? 'red' : p === 'should' ? 'amber' : 'gray'

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Non-Functional Requirements ({nfrs.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g., API Response Time' },
              { key: 'category', label: 'Category', type: 'select', required: true, options: Object.entries(NFR_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What this requirement means' },
              { key: 'target', label: 'Target', type: 'text', required: true, placeholder: 'e.g., P99 latency < 200ms' },
              { key: 'rationale', label: 'Rationale', type: 'text', required: true, placeholder: 'Why this NFR matters' },
              { key: 'priority', label: 'Priority', type: 'select', required: true, options: Object.entries(MOSCOW_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'verificationApproach', label: 'Verification', type: 'text', placeholder: 'How to verify (optional)' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {nfrs.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No NFRs yet. Add at least 2 for completeness.</p>
      )}

      <div className="space-y-1">
        {nfrs.map((item) => (
          <div key={item.id} className="flex items-start justify-between rounded border border-zinc-800 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                <Badge label={NFR_CATEGORY_LABELS[item.category] ?? item.category} color="blue" />
                <Badge label={MOSCOW_PRIORITY_LABELS[item.priority] ?? item.priority} color={priorityColor(item.priority)} />
              </div>
              <p className="text-xs text-zinc-400">{item.description}</p>
              <p className="mt-1 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Target:</span> {item.target}
              </p>
              {item.verificationApproach && (
                <p className="text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">Verification:</span> {item.verificationApproach}
                </p>
              )}
            </div>
            <button onClick={() => deleteNFR(item.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
