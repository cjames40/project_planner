import { useProjectStore, usePlanStore, useUIStore } from '@/stores'
import { CompletenessIndicator } from './CompletenessIndicator'
import { PROJECT_TYPE_LABELS } from '@/domain/types'

export function Sidebar() {
  const { projects, selectedProjectId, selectProject } = useProjectStore()
  const loadPlan = usePlanStore((s) => s.loadPlan)
  const { sidebarCollapsed, toggleSidebar, openModal } = useUIStore()

  const handleSelect = async (id: string) => {
    selectProject(id)
    await loadPlan(id)
  }

  if (sidebarCollapsed) {
    return (
      <div className="flex h-full w-10 flex-col items-center border-r border-zinc-700 bg-zinc-900 py-3">
        <button
          onClick={toggleSidebar}
          className="text-zinc-400 hover:text-zinc-200"
          title="Expand sidebar"
        >
          &raquo;
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-700 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-300">Projects</h2>
        <div className="flex gap-1">
          <button
            onClick={() => openModal('new-project')}
            className="rounded px-2 py-1 text-xs text-blue-400 hover:bg-zinc-800 hover:text-blue-300"
          >
            + New
          </button>
          <button
            onClick={toggleSidebar}
            className="text-zinc-500 hover:text-zinc-300"
            title="Collapse sidebar"
          >
            &laquo;
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-zinc-500">No projects yet</p>
        ) : (
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => handleSelect(p.id)}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    p.id === selectedProjectId
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`}
                >
                  <CompletenessIndicator score={p.completenessScore} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="text-xs text-zinc-500">
                      {PROJECT_TYPE_LABELS[p.projectType]}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-zinc-700 px-4 py-2">
        <button
          onClick={() => openModal('settings')}
          className="w-full rounded px-2 py-1.5 text-left text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        >
          Settings
        </button>
      </div>
    </div>
  )
}
