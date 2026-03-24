import { useUIStore } from '@/stores'

export function WelcomeView() {
  const openModal = useUIStore((s) => s.openModal)

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-2xl font-bold text-zinc-100">Architect Project Planner</h1>
      <p className="mb-6 max-w-md text-zinc-400">
        Plan software projects with an AI assistant. Create a project to get started.
      </p>
      <button
        onClick={() => openModal('new-project')}
        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-500"
      >
        + New Project
      </button>
    </div>
  )
}
