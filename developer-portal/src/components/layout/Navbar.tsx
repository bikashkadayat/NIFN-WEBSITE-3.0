'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Search, X, Globe, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface NavbarProps {
  onSearchOpen?: () => void
  onMenuToggle?: () => void
}

const NAV_LINKS = [
  { href: '/docs', label: 'Docs' },
  { href: '/sdks', label: 'SDKs' },
  { href: '/changelog', label: 'Changelog' },
]

export function Navbar({ onSearchOpen, onMenuToggle }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = () => {
    if (onSearchOpen) {
      onSearchOpen()
    } else {
      router.push('/search')
    }
  }

  return (
    <>
      <header
        className={clsx(
          'sticky top-0 z-30 bg-white transition-shadow',
          scrolled ? 'shadow-sm' : 'border-b border-gray-200'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <img src="/logo.png" alt="NIFN" className="h-8 w-auto" />
                <span className="font-bold text-gray-900 hidden sm:block">Developers</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'px-3 py-2 text-sm rounded-lg transition-colors',
                      pathname.startsWith(link.href)
                        ? 'text-cyan-700 bg-cyan-50 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:text-gray-600 transition-colors hidden sm:flex"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Search docs...</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-400 bg-white rounded border border-gray-200">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={handleSearch}
                className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href="https://github.com/nifn"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>

              <Link
                href="/register"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-full hover:bg-cyan-700 transition-colors"
              >
                Register
              </Link>

              <button
                onClick={() => {
                  setMobileOpen(!mobileOpen)
                  onMenuToggle?.()
                }}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="pt-20 px-6">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors',
                      pathname.startsWith(link.href)
                        ? 'text-cyan-700 bg-cyan-50 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
                <hr className="my-3 border-gray-200" />
                <Link
                  href="/register"
                  className="flex items-center justify-center px-4 py-3 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
