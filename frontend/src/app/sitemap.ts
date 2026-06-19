import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nifn.org.np'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function fetchNewsSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/v1/sitemap/news`, { next: { revalidate: 3600 } })
    const json = await res.json()
    return json?.data || []
  } catch {
    return []
  }
}

async function fetchGallerySlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/v1/sitemap/galleries`, { next: { revalidate: 3600 } })
    const json = await res.json()
    return json?.data || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsSlugs, gallerySlugs] = await Promise.all([
    fetchNewsSlugs(),
    fetchGallerySlugs(),
  ])

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/impact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/technology`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/ecosystem`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/join-network`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${BASE_URL}/downloads`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const newsPages = newsSlugs.map((slug: string) => ({
    url: `${BASE_URL}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const galleryPages = gallerySlugs.map((slug: string) => ({
    url: `${BASE_URL}/gallery/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...newsPages, ...galleryPages]
}
