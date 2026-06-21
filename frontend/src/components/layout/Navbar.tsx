'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

interface CmsMenuItem {
  id: string
  title: string
  url: string
  target: string
  children?: CmsMenuItem[]
}

interface NavItem {
  label: string
  href: string
  external?: boolean
  desc?: string
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about', children: [
    { label: 'About NIFN', href: '/about', desc: 'Learn about our mission' },
    { label: 'Our Impact', href: '/impact', desc: 'See our progress' },
    { label: 'Technology', href: '/technology', desc: 'How ILP works' },
  ]},
  { label: 'Ecosystem', href: '/ecosystem', children: [
    { label: 'Overview', href: '/ecosystem', desc: 'Explore the network' },
    { label: 'Developer Portal', href: process.env.NEXT_PUBLIC_DEVELOPER_PORTAL_URL || 'http://localhost:3006/', external: true, desc: 'Build on NIFN' },
    { label: 'Join Network', href: '/join-network', desc: 'Become a participant' },
  ]},
  { label: 'Impact', href: '/impact' },
  { label: 'News', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

function cmsToNavItem(item: CmsMenuItem): NavItem {
  return {
    label: item.title,
    href: item.url,
    external: item.target === '_blank',
    children: item.children?.length ? item.children.map(cmsToNavItem) : undefined,
  }
}

export function Navbar({ cmsItems }: { cmsItems?: CmsMenuItem[] }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileDropdowns, setMobileDropdowns] = useState<Set<string>>(new Set())
  const [locale, setLocale] = useState('en')

  const navItems: NavItem[] = cmsItems?.length ? cmsItems.map(cmsToNavItem) : NAV_ITEMS

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setOpenDropdown(null)
      }
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('locale')
    if (stored === 'ne' || stored === 'en') setLocale(stored)
  }, [])

  const toggleLocale = useCallback(() => {
    const next = locale === 'en' ? 'ne' : 'en'
    setLocale(next)
    localStorage.setItem('locale', next)
  }, [locale])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdowns(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo - always visible on white background */}
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="NIFN" className="h-14 w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children ? (
                    <button
                      className={clsx(
                        'flex items-center gap-1 px-4 py-2.5 rounded-lg text-base font-medium transition-colors',
                        'text-gray-700 hover:text-cyan-700 hover:bg-cyan-50',
                        isActive(item.href) && 'text-cyan-700'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        'px-4 py-2.5 rounded-lg text-base font-medium transition-colors',
                        'text-gray-700 hover:text-cyan-700 hover:bg-cyan-50',
                        isActive(item.href) && 'text-cyan-700'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <div
                      className={clsx(
                        'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200',
                        openDropdown === item.label
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-1'
                      )}
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px] overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            target={child.external ? '_blank' : undefined}
                            rel={child.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center justify-between px-4 py-3 hover:bg-cyan-50 transition-colors group"
                          >
                            <div>
                              <div className="text-sm font-medium text-gray-800 group-hover:text-cyan-700 flex items-center gap-1">
                                {child.label}
                                {child.external && <ExternalLink className="w-3 h-3" />}
                              </div>
                              {child.desc && (
                                <div className="text-xs text-gray-500 mt-0.5">{child.desc}</div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Language switcher */}
              <button
                onClick={toggleLocale}
                className="ml-2 px-3 py-2 rounded-lg text-base font-medium transition-colors border text-gray-600 hover:text-cyan-700 border-gray-200 hover:border-cyan-300"
              >
                {locale === 'en' ? 'ने' : 'EN'}
              </button>

              {/* Join Network CTA */}
              <Link
                href="/join-network"
                className="ml-3 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white text-base font-semibold rounded-full transition-colors"
              >
                Join Network
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleLocale}
                className="px-2 py-1 rounded text-sm font-medium transition-colors text-gray-600"
              >
                {locale === 'en' ? 'ने' : 'EN'}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={clsx(
          'fixed inset-0 z-50 lg:hidden transition-all duration-300',
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={clsx(
            'absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-lg font-bold text-cyan-700">NIFN</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleMobileDropdown(item.label)}
                      className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-800 font-medium hover:bg-cyan-50 transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={clsx(
                          'w-4 h-4 text-gray-400 transition-transform',
                          mobileDropdowns.has(item.label) && 'rotate-180'
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        'overflow-hidden transition-all duration-200',
                        mobileDropdowns.has(item.label) ? 'max-h-96' : 'max-h-0'
                      )}
                    >
                      <div className="ml-3 pl-3 border-l-2 border-cyan-100 space-y-1 py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            target={child.external ? '_blank' : undefined}
                            rel={child.external ? 'noopener noreferrer' : undefined}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
                          >
                            {child.label}
                            {child.external && <ExternalLink className="w-3 h-3" />}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'block px-3 py-3 rounded-lg font-medium transition-colors mb-1',
                      isActive(item.href)
                        ? 'text-cyan-700 bg-cyan-50'
                        : 'text-gray-800 hover:bg-cyan-50'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <Link
              href="/join-network"
              onClick={() => setMobileOpen(false)}
              className="block mt-4 px-5 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full text-center transition-colors"
            >
              Join Network
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
