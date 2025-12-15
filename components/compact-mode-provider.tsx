'use client'

import { useEffect } from 'react'
import { useSettings } from '@/lib/hooks/use-settings'

export function CompactModeProvider({ children }: { children: React.ReactNode }) {
  const { compactMode } = useSettings()

  useEffect(() => {
    if (compactMode) {
      document.body.classList.add('compact-mode')
    } else {
      document.body.classList.remove('compact-mode')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('compact-mode')
    }
  }, [compactMode])

  return <>{children}</>
}