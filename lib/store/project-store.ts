import { create } from 'zustand'
import { Project } from '@/lib/types/database'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  replaceProject: (oldId: string, newProject: Project) => void
  setLoading: (loading: boolean) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  setProjects: (projects) => {
    const currentProjects = get().projects
    // Only update if projects actually changed
    if (JSON.stringify(currentProjects) !== JSON.stringify(projects)) {
      set({ projects })
    }
  },
  setCurrentProject: (currentProject) => {
    const current = get().currentProject
    if (current?.id !== currentProject?.id) {
      set({ currentProject })
    }
  },
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates } 
      : state.currentProject
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  })),
  replaceProject: (oldId, newProject) => set((state) => ({
    projects: state.projects.map(p => p.id === oldId ? newProject : p),
    currentProject: state.currentProject?.id === oldId ? newProject : state.currentProject
  })),
  setLoading: (isLoading) => {
    const currentLoading = get().isLoading
    if (currentLoading !== isLoading) {
      set({ isLoading })
    }
  },
}))