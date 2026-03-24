import { create } from 'zustand'
import type { ProjectSummary, CreateProjectInput } from '@/domain/types'
import { projectRepository } from '@/services/persistence'

interface ProjectState {
  projects: ProjectSummary[]
  selectedProjectId: string | null
  loading: boolean

  loadProjects: () => Promise<void>
  createProject: (input: CreateProjectInput) => Promise<string>
  selectProject: (id: string | null) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProjectId: null,
  loading: false,

  async loadProjects() {
    set({ loading: true })
    const projects = await projectRepository.list()
    set({ projects, loading: false })
  },

  async createProject(input) {
    const project = await projectRepository.create(input)
    await get().loadProjects()
    set({ selectedProjectId: project.id })
    return project.id
  },

  selectProject(id) {
    set({ selectedProjectId: id })
  },
}))
