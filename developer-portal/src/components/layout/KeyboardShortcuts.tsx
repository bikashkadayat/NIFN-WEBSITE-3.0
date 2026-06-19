'use client'

import { useEffect } from 'react'

interface KeyboardShortcutsProps {
  onSearchOpen: () => void
  searchOpen: boolean
  onSearchClose: () => void
}

export function KeyboardShortcuts({ onSearchOpen, searchOpen, onSearchClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (searchOpen) {
          onSearchClose()
        } else {
          onSearchOpen()
        }
        return
      }

      if (e.key === 'Escape' && searchOpen) {
        onSearchClose()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearchOpen, onSearchClose, searchOpen])

  return null
}
