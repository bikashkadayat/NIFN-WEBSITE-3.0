const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface ContentData {
  id: string
  title?: string
  slug?: string
  body?: string
  excerpt?: string
  featured_image_url?: string
  seo_title?: string
  seo_description?: string
  portal_type?: string
}

export async function fetchContent(slug: string, locale?: string): Promise<ContentData | null> {
  try {
    const params = locale ? `?locale=${locale}` : ''
    const res = await fetch(`${API_URL}/v1/content/${slug}${params}`, {
      next: { revalidate: 60, tags: [`content`, `content-${slug}`] },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data || null
  } catch {
    return null
  }
}

export async function fetchSettings(): Promise<Record<string, string | number | boolean>> {
  try {
    const res = await fetch(`${API_URL}/v1/settings/public`, { next: { revalidate: 300 } })
    return res.json()
  } catch {
    return {}
  }
}
