'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  FileText,
  Newspaper,
  Tag,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Image,
  Download,
  ImageIcon,
  FileDown,
  Code,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api'
import clsx from 'clsx'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contents', label: 'Content', icon: FileText },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/news-categories', label: 'News Categories', icon: FolderTree },
  { href: '/admin/tags', label: 'Tags', icon: Tag },
  { href: '/admin/galleries', label: 'Galleries', icon: ImageIcon },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/downloads', label: 'Downloads', icon: FileDown },
  { href: '/admin/download-categories', label: 'Download Categories', icon: FolderTree },
  { href: '/admin/developer-registrations', label: 'Developer Registrations', icon: Code },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['developer-registration-unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/developer-registrations/unread-count')
      return (data as { data: { unread_count: number } }).data.unread_count
    },
    retry: false,
  })

  return (
    <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-bold">NIFN Admin</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.href === '/admin/developer-registrations' && unreadCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}