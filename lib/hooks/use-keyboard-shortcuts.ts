import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.shiftKey === event.shiftKey &&
        !!s.altKey === event.altKey
      )

      if (shortcut) {
        event.preventDefault()
        shortcut.callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}

export function useReleaseShortcuts(
  onStatusChange: (status: string) => void,
  currentStatus: string,
  enabled = true
) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      callback: () => onStatusChange('planned'),
      description: 'Ubah ke Direncanakan'
    },
    {
      key: '2', 
      callback: () => onStatusChange('upcoming'),
      description: 'Ubah ke Akan Datang'
    },
    {
      key: '3',
      callback: () => onStatusChange('released'),
      description: 'Ubah ke Dirilis'
    },
    {
      key: 'ArrowLeft',
      callback: () => {
        const statuses = ['planned', 'upcoming', 'released']
        const currentIndex = statuses.indexOf(currentStatus)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : statuses.length - 1
        onStatusChange(statuses[prevIndex])
      },
      description: 'Status sebelumnya'
    },
    {
      key: 'ArrowRight',
      callback: () => {
        const statuses = ['planned', 'upcoming', 'released']
        const currentIndex = statuses.indexOf(currentStatus)
        const nextIndex = currentIndex < statuses.length - 1 ? currentIndex + 1 : 0
        onStatusChange(statuses[nextIndex])
      },
      description: 'Status selanjutnya'
    }
  ]

  useKeyboardShortcuts(shortcuts, enabled)
}

export function useFeatureShortcuts(
  onStatusChange: (status: string) => void,
  currentStatus: string,
  enabled = true
) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      callback: () => onStatusChange('planned'),
      description: 'Ubah ke Direncanakan'
    },
    {
      key: '2', 
      callback: () => onStatusChange('in-progress'),
      description: 'Ubah ke Sedang Dikerjakan'
    },
    {
      key: '3',
      callback: () => onStatusChange('done'),
      description: 'Ubah ke Selesai'
    },
    {
      key: 'ArrowLeft',
      callback: () => {
        const statuses = ['planned', 'in-progress', 'done']
        const currentIndex = statuses.indexOf(currentStatus)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : statuses.length - 1
        onStatusChange(statuses[prevIndex])
      },
      description: 'Status sebelumnya'
    },
    {
      key: 'ArrowRight',
      callback: () => {
        const statuses = ['planned', 'in-progress', 'done']
        const currentIndex = statuses.indexOf(currentStatus)
        const nextIndex = currentIndex < statuses.length - 1 ? currentIndex + 1 : 0
        onStatusChange(statuses[nextIndex])
      },
      description: 'Status selanjutnya'
    }
  ]

  useKeyboardShortcuts(shortcuts, enabled)
}