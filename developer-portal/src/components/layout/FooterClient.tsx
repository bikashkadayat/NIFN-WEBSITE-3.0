'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Globe, MessageCircle, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || '/api'
    fetch(`${base}/v1/developer/settings`)
      .then((r) => r.json())
      .then((data) => setSettings(data?.data || data || {}))
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-[#0F172A] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="NIFN" className="h-8 w-auto opacity-90" />
              <span className="font-bold text-white">Developers</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {settings.portal_tagline || 'Build on Nepal\'s open payment network'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/docs/quick-start" className="text-sm text-gray-400 hover:text-white transition-colors">Quick Start</Link></li>
              <li><Link href="/docs/architecture" className="text-sm text-gray-400 hover:text-white transition-colors">Architecture</Link></li>
              <li><Link href="/docs/webhooks" className="text-sm text-gray-400 hover:text-white transition-colors">Webhooks</Link></li>
              <li><Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">All Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/sdks" className="text-sm text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/sdks" className="text-sm text-gray-400 hover:text-white transition-colors">SDKs</Link></li>
              <li><Link href="/register" className="text-sm text-gray-400 hover:text-white transition-colors">Sandbox Access</Link></li>
              <li><Link href="/changelog" className="text-sm text-gray-400 hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Community
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href={settings.github_org_url || 'https://github.com/nifn'} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a href={settings.forum_url || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" /> Forum
                </a>
              </li>
              <li>
                <a href={settings.support_url || 'mailto:support@nifn.org.np'} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Support
                </a>
              </li>
              <li>
                <a href={settings.twitter_url || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" /> Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} NIFN. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={settings.github_org_url || 'https://github.com/nifn'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href={settings.twitter_url || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
