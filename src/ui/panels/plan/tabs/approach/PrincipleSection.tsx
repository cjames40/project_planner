import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { AddItemForm } from '../scope/AddItemForm'

export function PrincipleSection() {
  const { principles, addPrinciple, deletePrinciple } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addPrinciple({
      title: values.title as string,
      description: values.description as string,
      rationale: (values.rationale as string) || undefined,
      implications: (values.implications as string) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Design Principles ({principles.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g., API-First Design' },
              { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What this principle means and how it guides decisions' },
              { key: 'rationale', label: 'Rationale', type: 'text', placeholder: 'Why this principle was adopted (optional)' },
              { key: 'implications', label: 'Implications', type: 'textarea', placeholder: 'What this means in practice (optional)' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {principles.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No principles yet. Add at least 1 for completeness.</p>
      )}

      <div className="space-y-1">
        {principles.map((item) => (
          <div key={item.id} className="flex items-start justify-between rounded border border-zinc-800 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-200">{item.title}</p>
              <p className="text-xs text-zinc-400">{item.description}</p>
              {item.rationale && (
                <p className="mt-1 text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">Rationale:</span> {item.rationale}
                </p>
              )}
              {item.implications && (
                <p className="text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">Implications:</span> {item.implications}
                </p>
              )}
            </div>
            <button onClick={() => deletePrinciple(item.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
