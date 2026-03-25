import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from './AddItemForm'
import { STAKEHOLDER_TYPE_LABELS } from '@/domain/types'
import type { StakeholderType, InfluenceLevel, InterestLevel } from '@/domain/types'

export function StakeholderSection() {
  const { stakeholders, addStakeholder, deleteStakeholder } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addStakeholder({
      name: values.name as string,
      role: values.role as string,
      type: values.type as StakeholderType,
      primaryConcern: values.primaryConcern as string,
      influenceLevel: values.influenceLevel as InfluenceLevel,
      interestLevel: values.interestLevel as InterestLevel,
      communicationNeeds: (values.communicationNeeds as string) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  const levelColor = (level: string) => level === 'high' ? 'red' : level === 'medium' ? 'amber' : 'green'

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Stakeholders ({stakeholders.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Person or role' },
              { key: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g., VP Engineering' },
              { key: 'type', label: 'Type', type: 'select', required: true, options: Object.entries(STAKEHOLDER_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'primaryConcern', label: 'Primary Concern', type: 'text', required: true, placeholder: 'What they care about most' },
              { key: 'influenceLevel', label: 'Influence', type: 'select', required: true, options: [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] },
              { key: 'interestLevel', label: 'Interest', type: 'select', required: true, options: [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] },
              { key: 'communicationNeeds', label: 'Communication Needs', type: 'text', placeholder: 'How/how often to update (optional)' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {stakeholders.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No stakeholders yet. Identify at least 2 for completeness.</p>
      )}

      {stakeholders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="py-1.5 pr-3 font-medium">Name</th>
                <th className="py-1.5 pr-3 font-medium">Role</th>
                <th className="py-1.5 pr-3 font-medium">Type</th>
                <th className="py-1.5 pr-3 font-medium">Influence</th>
                <th className="py-1.5 pr-3 font-medium">Interest</th>
                <th className="py-1.5 pr-3 font-medium">Concern</th>
                <th className="py-1.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {stakeholders.map((s) => (
                <tr key={s.id} className="border-b border-zinc-800/50">
                  <td className="py-1.5 pr-3 text-zinc-200">{s.name}</td>
                  <td className="py-1.5 pr-3 text-zinc-400">{s.role}</td>
                  <td className="py-1.5 pr-3"><Badge label={STAKEHOLDER_TYPE_LABELS[s.type]} color="purple" /></td>
                  <td className="py-1.5 pr-3"><Badge label={s.influenceLevel} color={levelColor(s.influenceLevel)} /></td>
                  <td className="py-1.5 pr-3"><Badge label={s.interestLevel} color={levelColor(s.interestLevel)} /></td>
                  <td className="py-1.5 pr-3 text-zinc-400">{s.primaryConcern}</td>
                  <td className="py-1.5"><button onClick={() => deleteStakeholder(s.id)} className="text-zinc-600 hover:text-red-400">&times;</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
