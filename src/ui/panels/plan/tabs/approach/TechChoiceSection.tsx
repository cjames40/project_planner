import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from '../scope/AddItemForm'
import { TECHNOLOGY_CATEGORY_LABELS } from '@/domain/types'
import type { TechnologyCategory } from '@/domain/types'

export function TechChoiceSection() {
  const { techChoices, addTechChoice, deleteTechChoice } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addTechChoice({
      category: values.category as TechnologyCategory,
      name: values.name as string,
      rationale: values.rationale as string,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Technology Choices ({techChoices.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'category', label: 'Category', type: 'select', required: true, options: Object.entries(TECHNOLOGY_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'name', label: 'Technology Name', type: 'text', required: true, placeholder: 'e.g., PostgreSQL, TypeScript' },
              { key: 'rationale', label: 'Rationale', type: 'textarea', required: true, placeholder: 'Why this technology over alternatives' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {techChoices.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No technology choices yet. Add at least 2 for completeness.</p>
      )}

      <div className="space-y-1">
        {techChoices.map((item) => (
          <div key={item.id} className="flex items-start justify-between rounded border border-zinc-800 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-zinc-200">{item.name}</p>
                <Badge label={TECHNOLOGY_CATEGORY_LABELS[item.category] ?? item.category} color="green" />
              </div>
              <p className="text-xs text-zinc-400">{item.rationale}</p>
              {item.alternativesConsidered.length > 0 && (
                <div className="mt-1">
                  <span className="text-xs font-medium text-zinc-500">Alternatives: </span>
                  {item.alternativesConsidered.map((alt, i) => (
                    <span key={i} className="text-xs text-zinc-500">
                      {alt.name} ({alt.rejectionReason}){i < item.alternativesConsidered.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => deleteTechChoice(item.id)} className="ml-2 text-xs text-zinc-600 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
