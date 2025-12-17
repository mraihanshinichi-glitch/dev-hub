'use client'

import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/lib/store/settings-store'

export function useSettings() {
  const [isHydrated, setIsHydrated] = useState(false)
  const settings = useSettingsStore()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Return default values during SSR/hydration
  if (!isHydrated) {
    return {
      ...settings,
      autoSaveEnabled: true,
      autoSaveInterval: 5,
      compactMode: false,
      showKeyboardShortcuts: true,
      theme: 'dark' as const,
      twoFactorEnabled: false,
      sessionTimeout: 60,
      autoBackupEnabled: false,
      backupFrequency: 'weekly' as const,
      noteCategories: ['general', 'documentation', 'ideas', 'meeting'],
      featureCategories: ['feature', 'bugfix', 'enhancement', 'refactor'],
      releaseCategories: ['major', 'minor', 'patch', 'hotfix'],
    }
  }

  return settings
}