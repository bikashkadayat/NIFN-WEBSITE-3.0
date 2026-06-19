const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface NavNode {
  id: string
  title?: string
  slug?: string
  icon?: string
  category?: string
  children: NavNode[]
}

export interface DevPage {
  id: string
  title?: string
  slug?: string
  body?: string
  excerpt?: string
  category?: string
  icon?: string
  parent_id?: string
  sort_order: number
  seo_title?: string
  seo_description?: string
  updated_at?: string
}

export interface DevSdk {
  id: string
  language: string
  package_name: string
  status: string
  maintainer?: string
  license?: string
  runtime?: string
  documentation_url?: string
  github_url?: string
  title?: string
  description?: string
  installation_code?: string
  usage_code?: string
}

export interface DevChangelogEntry {
  id: string
  version: string
  release_date?: string
  title?: string
  body?: string
}

export interface SearchResult {
  slug: string
  title: string
  excerpt?: string
  category?: string
}

export interface RegistrationData {
  contact_name: string
  email: string
  organization_name?: string
  organization_type: string
  use_case?: string
  agreed_terms: boolean
}

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return fallback
    const json = await res.json()
    return json?.data ?? json ?? fallback
  } catch {
    return fallback
  }
}

export async function fetchNavigation(): Promise<NavNode[]> {
  return fetchJson<NavNode[]>(`${API_URL}/v1/developer/navigation`, [])
}

export async function getDeveloperNavigation(): Promise<NavNode[]> {
  return fetchNavigation()
}

export async function getDeveloperPages(): Promise<DevPage[]> {
  return fetchJson<DevPage[]>(`${API_URL}/v1/developer/pages`, [])
}

export async function fetchDeveloperPage(slug: string): Promise<DevPage | null> {
  return fetchJson<DevPage | null>(`${API_URL}/v1/developer/pages/${slug}`, null)
}

export async function getDeveloperPageBySlug(slug: string): Promise<DevPage | null> {
  return fetchDeveloperPage(slug)
}

export async function fetchDeveloperSettings(): Promise<Record<string, string>> {
  return fetchJson<Record<string, string>>(`${API_URL}/v1/developer/settings`, {})
}

export async function getDeveloperSettings(): Promise<Record<string, string>> {
  return fetchDeveloperSettings()
}

export async function fetchDeveloperSdks(): Promise<DevSdk[]> {
  return fetchJson<DevSdk[]>(`${API_URL}/v1/developer/sdks`, [])
}

export async function getDeveloperSdks(): Promise<DevSdk[]> {
  return fetchDeveloperSdks()
}

export async function fetchDeveloperChangelog(): Promise<DevChangelogEntry[]> {
  return fetchJson<DevChangelogEntry[]>(`${API_URL}/v1/developer/changelog`, [])
}

export async function getDeveloperChangelog(): Promise<DevChangelogEntry[]> {
  return fetchDeveloperChangelog()
}

export async function searchDeveloperDocs(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []
  return fetchJson<SearchResult[]>(`${API_URL}/v1/search?q=${encodeURIComponent(query)}&type=developer`, [])
}

export async function submitDeveloperRegistration(data: RegistrationData): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/v1/developer-registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Registration failed' }))
      return { success: false, error: err.message || err.error || 'Registration failed' }
    }
    return { success: true }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }
}
