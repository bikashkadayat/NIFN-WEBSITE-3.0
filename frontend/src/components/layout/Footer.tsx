import Link from 'next/link'
import { Copyright, ExternalLink, Facebook, Twitter, Linkedin } from 'lucide-react'
import { NewsletterForm } from './NewsletterForm'

interface Setting {
  key: string
  value: string
}

interface MenuItem {
  id: string
  title: string
  url: string
  target: string
  children?: MenuItem[]
}

async function getSettings(): Promise<Record<string, string>> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const res = await fetch(`${base}/v1/settings/public`, { next: { revalidate: 300 } })
    return res.json()
  } catch {
    return {}
  }
}

async function getFooterMenu(): Promise<MenuItem[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const res = await fetch(`${base}/v1/menus/footer`, { next: { revalidate: 300 } })
    const data = await res.json()
    return data?.items || []
  } catch {
    return []
  }
}

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const Icon = platform === 'facebook' ? Facebook : platform === 'twitter' ? Twitter : Linkedin
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center text-white/70 hover:text-white transition-all"
      aria-label={platform}
    >
      <Icon className="w-4 h-4" />
    </a>
  )
}

export async function Footer() {
  const [settings, footerMenu] = await Promise.all([getSettings(), getFooterMenu()])

  const logo = settings?.site_name || 'NIFN'
  const description = settings?.site_description || ''
  const footerEmail = settings?.footer_email || ''
  const footerPhone = settings?.footer_phone || ''

  const socialLinks: { platform: string; url: string }[] = []
  if (settings?.facebook_url) socialLinks.push({ platform: 'facebook', url: settings.facebook_url })
  if (settings?.twitter_url) socialLinks.push({ platform: 'twitter', url: settings.twitter_url })
  if (settings?.linkedin_url) socialLinks.push({ platform: 'linkedin', url: settings.linkedin_url })

  const quickLinks = footerMenu.filter((item) => item.url && item.title)
  const resourceLinks = [
    { title: 'Blog', href: '/news' },
    { title: 'Documentation', href: process.env.NEXT_PUBLIC_DEVELOPER_PORTAL_URL || 'https://developers.nifn.org.np', external: true },
    { title: 'Media', href: '/gallery' },
    { title: 'Events', href: '/events' },
  ]

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Row 1: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Logo + description */}
          <div>
            <Link href="/">
              <img src="/logo.png" alt={logo} className="h-9 w-auto opacity-90" />
            </Link>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              {description || 'Connecting Nepal to the global interledger network for inclusive financial services.'}
            </p>
            {(footerEmail || footerPhone) && (
              <div className="mt-4 space-y-1 text-sm text-gray-300">
                {footerEmail && <p>Email: {footerEmail}</p>}
                {footerPhone && <p>Phone: {footerPhone}</p>}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.length > 0 ? quickLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    target={item.target === '_blank' ? '_blank' : undefined}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              )) : (
                <>
                  <li><Link href="/" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">Home</Link></li>
                  <li><Link href="/about" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">About</Link></li>
                  <li><Link href="/technology" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">Technology</Link></li>
                  <li><Link href="/impact" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">Impact</Link></li>
                  <li><Link href="/contact" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-gray-300 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.title}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-300">Stay updated with the latest news and insights from NIFN.</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-6 border-t border-white/10" />

        {/* Row 2: Copyright + social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 flex items-center gap-1">
            <Copyright className="w-3.5 h-3.5" /> 2026 {logo}. All rights reserved.
          </p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <SocialIcon key={link.platform} platform={link.platform} url={link.url} />
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
