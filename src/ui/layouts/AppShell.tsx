import { Sidebar } from '@/ui/components/Sidebar'
import { WelcomeView } from '@/ui/components/WelcomeView'
import { ProjectView } from '@/ui/panels/ProjectView'
import { NewProjectModal } from '@/ui/modals/NewProjectModal'
import { SettingsModal } from '@/ui/modals/SettingsModal'
import { useProjectStore, useUIStore } from '@/stores'

export function AppShell() {
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId)
  const { modalState, closeModal } = useUIStore()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {selectedProjectId ? <ProjectView /> : <WelcomeView />}
      </main>

      <NewProjectModal
        open={modalState === 'new-project'}
        onClose={closeModal}
      />
      <SettingsModal
        open={modalState === 'settings'}
        onClose={closeModal}
      />
    </div>
  )
}
