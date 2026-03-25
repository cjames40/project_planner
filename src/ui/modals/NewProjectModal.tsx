import { useState } from 'react'
import { Modal } from '@/ui/components/Modal'
import { useProjectStore, usePlanStore, useChatStore, useUIStore } from '@/stores'
import { validateCreateProject } from '@/domain/validators'
import type { ProjectType, CreateProjectInput } from '@/domain/types'
import { PROJECT_TYPE_LABELS } from '@/domain/types'
import { getOnboardingMessage } from '@/services/chat'
import { chatRepository } from '@/services/persistence'

interface Props {
  open: boolean
  onClose: () => void
}

const projectTypes = Object.entries(PROJECT_TYPE_LABELS) as [ProjectType, string][]

export function NewProjectModal({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [projectType, setProjectType] = useState<ProjectType>('greenfield')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const createProject = useProjectStore((s) => s.createProject)
  const loadPlan = usePlanStore((s) => s.loadPlan)
  const initSession = useChatStore((s) => s.initSession)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const input: CreateProjectInput = { name, projectType, description }
    const fieldErrors = validateCreateProject(input)

    if (fieldErrors.length > 0) {
      const map: Record<string, string> = {}
      fieldErrors.forEach((err) => { map[err.field] = err.message })
      setErrors(map)
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      const projectId = await createProject(input)
      await loadPlan(projectId)

      // Init chat session and send onboarding message
      const plan = usePlanStore.getState().plan
      if (plan) {
        await initSession(plan.id)
        const sessionId = useChatStore.getState().sessionId
        if (sessionId) {
          const onboardingMsg = getOnboardingMessage(name, projectType, description)
          const msg = await chatRepository.appendMessage(sessionId, {
            role: 'assistant',
            content: onboardingMsg,
          })
          useChatStore.setState((s) => ({ messages: [...s.messages, msg] }))
        }
      }

      setActiveTab('overview')
      reset()
      onClose()
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Failed to create project' })
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setName('')
    setProjectType('greenfield')
    setDescription('')
    setErrors({})
  }

  return (
    <Modal open={open} onClose={onClose} title="New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-300">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Payment Platform Migration"
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-300">Project Type</label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as ProjectType)}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          >
            {projectTypes.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.projectType && <p className="mt-1 text-xs text-red-400">{errors.projectType}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the project..."
            rows={3}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
          />
          {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
        </div>

        {errors.form && (
          <p className="text-sm text-red-400">{errors.form}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => { reset(); onClose() }}
            className="rounded px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
