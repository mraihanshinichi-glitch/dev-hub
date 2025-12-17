import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // Auto-save settings
  autoSaveEnabled: boolean
  autoSaveInterval: number // in seconds
  
  // UI preferences
  compactMode: boolean
  showKeyboardShortcuts: boolean
  theme: 'dark' | 'light' | 'system'
  
  // Security settings
  twoFactorEnabled: boolean
  sessionTimeout: number // in minutes
  
  // Backup settings
  autoBackupEnabled: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  
  // Categories
  noteCategories: string[]
  featureCategories: string[]
  releaseCategories: string[]
  
  // AI Assistant settings
  aiAssistantEnabled: boolean
  showFloatingAIButton: boolean
  
  // Actions
  setAutoSaveEnabled: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  setCompactMode: (enabled: boolean) => void
  setShowKeyboardShortcuts: (enabled: boolean) => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  setTwoFactorEnabled: (enabled: boolean) => void
  setSessionTimeout: (timeout: number) => void
  setAutoBackupEnabled: (enabled: boolean) => void
  setBackupFrequency: (frequency: 'daily' | 'weekly' | 'monthly') => void
  setNoteCategories: (categories: string[]) => void
  setFeatureCategories: (categories: string[]) => void
  setReleaseCategories: (categories: string[]) => void
  addNoteCategory: (category: string) => void
  addFeatureCategory: (category: string) => void
  addReleaseCategory: (category: string) => void
  removeNoteCategory: (category: string) => void
  removeFeatureCategory: (category: string) => void
  removeReleaseCategory: (category: string) => void
  setAIAssistantEnabled: (enabled: boolean) => void
  setShowFloatingAIButton: (enabled: boolean) => void
  resetToDefaults: () => void
}

const defaultSettings = {
  autoSaveEnabled: true,
  autoSaveInterval: 5,
  compactMode: false,
  showKeyboardShortcuts: true,
  theme: 'dark' as const,
  twoFactorEnabled: false,
  sessionTimeout: 60, // 1 hour
  autoBackupEnabled: false,
  backupFrequency: 'weekly' as const,
  noteCategories: ['general', 'documentation', 'ideas', 'meeting'],
  featureCategories: ['feature', 'bugfix', 'enhancement', 'refactor'],
  releaseCategories: ['major', 'minor', 'patch', 'hotfix'],
  aiAssistantEnabled: true,
  showFloatingAIButton: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setAutoSaveEnabled: (autoSaveEnabled) => set({ autoSaveEnabled }),
      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setShowKeyboardShortcuts: (showKeyboardShortcuts) => set({ showKeyboardShortcuts }),
      setTheme: (theme) => set({ theme }),
      setTwoFactorEnabled: (twoFactorEnabled) => set({ twoFactorEnabled }),
      setSessionTimeout: (sessionTimeout) => set({ sessionTimeout }),
      setAutoBackupEnabled: (autoBackupEnabled) => set({ autoBackupEnabled }),
      setBackupFrequency: (backupFrequency) => set({ backupFrequency }),
      
      // Category actions
      setNoteCategories: (noteCategories) => set({ noteCategories }),
      setFeatureCategories: (featureCategories) => set({ featureCategories }),
      setReleaseCategories: (releaseCategories) => set({ releaseCategories }),
      
      addNoteCategory: (category) => set((state) => ({
        noteCategories: [...state.noteCategories, category]
      })),
      addFeatureCategory: (category) => set((state) => ({
        featureCategories: [...state.featureCategories, category]
      })),
      addReleaseCategory: (category) => set((state) => ({
        releaseCategories: [...state.releaseCategories, category]
      })),
      
      removeNoteCategory: (category) => set((state) => ({
        noteCategories: state.noteCategories.filter(c => c !== category)
      })),
      removeFeatureCategory: (category) => set((state) => ({
        featureCategories: state.featureCategories.filter(c => c !== category)
      })),
      removeReleaseCategory: (category) => set((state) => ({
        releaseCategories: state.releaseCategories.filter(c => c !== category)
      })),
      
      // AI Assistant actions
      setAIAssistantEnabled: (aiAssistantEnabled) => set({ aiAssistantEnabled }),
      setShowFloatingAIButton: (showFloatingAIButton) => set({ showFloatingAIButton }),
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'devhub-settings',
    }
  )
)