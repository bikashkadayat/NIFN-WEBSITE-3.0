const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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

export async function fetchContent(slug: string): Promise<ContentData | null> {
  try {
    const res = await fetch(`${API_URL}/v1/content/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data || null
  } catch {
    return null
  }
}
