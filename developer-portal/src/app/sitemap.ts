import { getDeveloperPages } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://developers.nifn.org.np'

export default async function sitemap() {
  const pages = await getDeveloperPages()

  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/docs`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/sdks`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/changelog`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), priority: 0.5 },
  ]

  const docRoutes = pages.map((page) => ({
    url: `${BASE_URL}/docs/${page.slug}`,
    lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
    priority: 0.7 as const,
  }))

  return [...staticRoutes, ...docRoutes]
}
