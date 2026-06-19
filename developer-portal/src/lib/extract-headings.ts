export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractHeadings(html: string): TocItem[] {
  if (typeof window === 'undefined') return []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headings = doc.querySelectorAll('h2, h3')
  return Array.from(headings).map((h) => ({
    id: h.id || slugify(h.textContent || ''),
    text: h.textContent || '',
    level: parseInt(h.tagName.charAt(1)),
  }))
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
