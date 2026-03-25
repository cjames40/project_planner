import { useState } from 'react'
import { usePlanStore } from '@/stores'
import { Badge } from '@/ui/components/Badge'
import { AddItemForm } from './AddItemForm'
import { INTEGRATION_DIRECTION_LABELS, CRITICALITY_LABELS, INTEGRATION_POINT_STATUS_LABELS } from '@/domain/types'
import type { IntegrationDirection, Criticality, IntegrationPointStatus } from '@/domain/types'

export function IntegrationPointSection() {
  const { integrationPoints, addIntegrationPoint, deleteIntegrationPoint } = usePlanStore()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (values: Record<string, string | boolean>) => {
    await addIntegrationPoint({
      systemName: values.systemName as string,
      direction: values.direction as IntegrationDirection,
      criticality: values.criticality as Criticality,
      description: values.description as string,
      status: values.status as IntegrationPointStatus,
      protocol: (values.protocol as string) || undefined,
      owner: (values.owner as string) || undefined,
      createdVia: 'manual',
    })
    setAdding(false)
  }

  const critColor = (c: string) => c === 'critical' ? 'red' : c === 'high' ? 'amber' : 'gray'

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Integration Points ({integrationPoints.length})</h4>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
        )}
      </div>

      {adding && (
        <div className="mb-2">
          <AddItemForm
            fields={[
              { key: 'systemName', label: 'System Name', type: 'text', required: true, placeholder: 'e.g., Stripe API' },
              { key: 'direction', label: 'Direction', type: 'select', required: true, options: Object.entries(INTEGRATION_DIRECTION_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'criticality', label: 'Criticality', type: 'select', required: true, options: Object.entries(CRITICALITY_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What data or calls flow across this integration?' },
              { key: 'status', label: 'Status', type: 'select', required: true, options: Object.entries(INTEGRATION_POINT_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { key: 'protocol', label: 'Protocol', type: 'text', placeholder: 'e.g., REST, gRPC (optional)' },
              { key: 'owner', label: 'Owner', type: 'text', placeholder: 'Responsible team (optional)' },
            ]}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {integrationPoints.length === 0 && !adding && (
        <p className="text-xs text-zinc-500">No integration points yet. Identify at least 1 for completeness.</p>
      )}

      {integrationPoints.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="py-1.5 pr-3 font-medium">System</th>
                <th className="py-1.5 pr-3 font-medium">Direction</th>
                <th className="py-1.5 pr-3 font-medium">Criticality</th>
                <th className="py-1.5 pr-3 font-medium">Status</th>
                <th className="py-1.5 pr-3 font-medium">Protocol</th>
                <th className="py-1.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {integrationPoints.map((ip) => (
                <tr key={ip.id} className="border-b border-zinc-800/50">
                  <td className="py-1.5 pr-3 text-zinc-200">{ip.systemName}</td>
                  <td className="py-1.5 pr-3"><Badge label={INTEGRATION_DIRECTION_LABELS[ip.direction]} color="blue" /></td>
                  <td className="py-1.5 pr-3"><Badge label={CRITICALITY_LABELS[ip.criticality]} color={critColor(ip.criticality)} /></td>
                  <td className="py-1.5 pr-3"><Badge label={INTEGRATION_POINT_STATUS_LABELS[ip.status]} color="gray" /></td>
                  <td className="py-1.5 pr-3 text-zinc-400">{ip.protocol || '—'}</td>
                  <td className="py-1.5"><button onClick={() => deleteIntegrationPoint(ip.id)} className="text-zinc-600 hover:text-red-400">&times;</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
