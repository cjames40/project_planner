import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { AddItemForm } from '../scope/AddItemForm'

export function PatternSection() {
  const { patterns, addPattern, deletePattern } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addPattern({
      name: values.name as string,
      description: values.description as string,
      tradeoffs: values.tradeoffs as string,
      applicableComponents: (values.applicableComponents as string) ? (values.applicableComponents as string).split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      alternatives: (values.alternatives as string) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Architectural Patterns ({patterns.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'name', label: 'Pattern Name', type: 'text', required: true, placeholder: 'e.g., CQRS, Saga, BFF' },
              { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'How this pattern applies to the project' },
              { key: 'tradeoffs', label: 'Tradeoffs', type: 'textarea', required: true, placeholder: 'Key tradeoffs (pros and cons)' },
              { key: 'applicableComponents', label: 'Applicable Components', type: 'text', placeholder: 'Comma-separated (optional)' },
              { key: 'alternatives', label: 'Alternatives Considered', type: 'text', placeholder: 'Other patterns considered (optional)' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {patterns.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No patterns yet. Add at least 1 for completeness.</p>
      )}

      <div className="space-y-1">
        {patterns.map((item) => (
          <div key={item.id} className="flex items-start justify-between rounded border border-zinc-800 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-200">{item.name}</p>
              <p className="text-xs text-zinc-400">{item.description}</p>
              <p className="mt-1 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Tradeoffs:</span> {item.tradeoffs}
              </p>
              {item.applicableComponents.length > 0 && (
                <p className="text-xs text-zinc-500">Components: {item.applicableComponents.join(', ')}</p>
              )}
            </div>
            <button onClick={() => deletePattern(item.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
