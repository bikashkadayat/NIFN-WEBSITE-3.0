'use client'

import { useState, useCallback } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/FooterClient'
import { SearchModal } from '@/components/layout/SearchModal'
import { KeyboardShortcuts } from '@/components/layout/KeyboardShortcuts'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  return (
    <>
      <KeyboardShortcuts
        onSearchOpen={openSearch}
        searchOpen={searchOpen}
        onSearchClose={closeSearch}
      />
      <Navbar onSearchOpen={openSearch} />
      {children}
      <Footer />
      <SearchModal open={searchOpen} onClose={closeSearch} />
    </>
  )
}
