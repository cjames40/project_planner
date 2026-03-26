import { useUIStore } from '@/stores'
import { OverviewTab } from './tabs/OverviewTab'
import { ScopeTab } from './tabs/ScopeTab'
import { RisksTab } from './tabs/RisksTab'
import { ApproachTab } from './tabs/ApproachTab'
import { PlaceholderTab } from './tabs/PlaceholderTab'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'scope', label: 'Scope' },
  { id: 'risks', label: 'Risks' },
  { id: 'approach', label: 'Approach' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'adrs', label: 'ADRs' },
  { id: 'todos', label: 'TODOs' },
] as const

export function PlanPanel() {
  const { activeTab, setActiveTab } = useUIStore()

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex border-b border-zinc-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'scope' && <ScopeTab />}
        {activeTab === 'risks' && <RisksTab />}
        {activeTab === 'approach' && <ApproachTab />}
        {activeTab === 'opportunities' && <PlaceholderTab name="Opportunities" />}
        {activeTab === 'adrs' && <PlaceholderTab name="ADRs" />}
        {activeTab === 'todos' && <PlaceholderTab name="TODOs" />}
      </div>
    </div>
  )
}
