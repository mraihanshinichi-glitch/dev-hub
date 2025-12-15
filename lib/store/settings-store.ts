import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // Notification settings
  emailNotifications: boolean
  pushNotifications: boolean
  releaseReminders: boolean
  featureDeadlineReminders: boolean
  
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
  
  // Actions
  setEmailNotifications: (enabled: boolean) => void
  setPushNotifications: (enabled: boolean) => void
  setReleaseReminders: (enabled: boolean) => void
  setFeatureDeadlineReminders: (enabled: boolean) => void
  setAutoSaveEnabled: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  setCompactMode: (enabled: boolean) => void
  setShowKeyboardShortcuts: (enabled: boolean) => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  setTwoFactorEnabled: (enabled: boolean) => void
  setSessionTimeout: (timeout: number) => void
  setAutoBackupEnabled: (enabled: boolean) => void
  setBackupFrequency: (frequency: 'daily' | 'weekly' | 'monthly') => void
  resetToDefaults: () => void
}

const defaultSettings = {
  emailNotifications: true,
  pushNotifications: false,
  releaseReminders: true,
  featureDeadlineReminders: true,
  autoSaveEnabled: true,
  autoSaveInterval: 5,
  compactMode: false,
  showKeyboardShortcuts: true,
  theme: 'dark' as const,
  twoFactorEnabled: false,
  sessionTimeout: 60, // 1 hour
  autoBackupEnabled: false,
  backupFrequency: 'weekly' as const,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
      setReleaseReminders: (releaseReminders) => set({ releaseReminders }),
      setFeatureDeadlineReminders: (featureDeadlineReminders) => set({ featureDeadlineReminders }),
      setAutoSaveEnabled: (autoSaveEnabled) => set({ autoSaveEnabled }),
      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setShowKeyboardShortcuts: (showKeyboardShortcuts) => set({ showKeyboardShortcuts }),
      setTheme: (theme) => set({ theme }),
      setTwoFactorEnabled: (twoFactorEnabled) => set({ twoFactorEnabled }),
      setSessionTimeout: (sessionTimeout) => set({ sessionTimeout }),
      setAutoBackupEnabled: (autoBackupEnabled) => set({ autoBackupEnabled }),
      setBackupFrequency: (backupFrequency) => set({ backupFrequency }),
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'devhub-settings',
    }
  )
)