import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from './AddItemForm'
import { IN_SCOPE_CATEGORY_LABELS } from '@/domain/types'
import type { InScopeCategory } from '@/domain/types'

export function InScopeSection() {
  const { inScopeItems, addInScopeItem, deleteInScopeItem } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addInScopeItem({
      description: values.description as string,
      rationale: (values.rationale as string) || undefined,
      category: (values.category as InScopeCategory) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">In Scope ({inScopeItems.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What is included in scope?' },
              { key: 'rationale', label: 'Rationale', type: 'text', placeholder: 'Why (optional)' },
              { key: 'category', label: 'Category', type: 'select', options: Object.entries(IN_SCOPE_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {inScopeItems.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No in-scope items yet. Add at least 3 for completeness.</p>
      )}

      <div className="space-y-1">
        {inScopeItems.map((item) => (
          <div key={item.id} className="flex items-start justify-between rounded border border-zinc-800 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200">{item.description}</p>
              {item.rationale && <p className="text-xs italic text-zinc-500">{item.rationale}</p>}
              {item.category && <Badge label={IN_SCOPE_CATEGORY_LABELS[item.category as InScopeCategory] ?? item.category} color="blue" />}
            </div>
            <button onClick={() => deleteInScopeItem(item.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
