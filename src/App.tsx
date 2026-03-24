import { useEffect, useState } from 'react'
import { initializeDatabase } from '@/services/persistence'
import { useProjectStore, useUIStore } from '@/stores'
import { getApiKey } from '@/services/chat'
import { AppShell } from '@/ui/layouts/AppShell'

export default function App() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadProjects = useProjectStore((s) => s.loadProjects)
  const openModal = useUIStore((s) => s.openModal)

  useEffect(() => {
    async function init() {
      try {
        await initializeDatabase()
        await loadProjects()

        if (!getApiKey()) {
          openModal('settings')
        }

        setReady(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize')
      }
    }
    init()
  }, [loadProjects, openModal])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-bold text-red-400">Initialization Error</h1>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-500" />
          <p className="text-sm text-zinc-400">Initializing database...</p>
        </div>
      </div>
    )
  }

  return <AppShell />
}
