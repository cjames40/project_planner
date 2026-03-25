import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { AddItemForm } from './AddItemForm'

export function OutOfScopeSection() {
  const { outOfScopeItems, addOutOfScopeItem, deleteOutOfScopeItem } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addOutOfScopeItem({
      description: values.description as string,
      rationale: values.rationale as string,
      deferredTo: (values.deferredTo as string) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Out of Scope ({outOfScopeItems.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What is excluded?' },
              { key: 'rationale', label: 'Rationale', type: 'textarea', required: true, placeholder: 'Why is this out of scope?' },
              { key: 'deferredTo', label: 'Deferred To', type: 'text', placeholder: 'Future phase (optional)' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {outOfScopeItems.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No out-of-scope items yet. Define at least 1 for completeness.</p>
      )}

      <div className="space-y-1">
        {outOfScopeItems.map((item) => (
          <div key={item.id} className="flex items-start justify-between rounded border border-zinc-800 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200">{item.description}</p>
              <p className="text-xs italic text-zinc-500">{item.rationale}</p>
              {item.deferredTo && <p className="text-xs text-zinc-600">Deferred to: {item.deferredTo}</p>}
            </div>
            <button onClick={() => deleteOutOfScopeItem(item.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
