// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string | number
  name: string
  email: string
  role: string
  role_name: string
  permissions: string[]
  avatar?: string | null
  phone?: string | null
  bio?: string | null
  is_active: boolean
  email_verified_at?: string | null
  last_login_at?: string | null
  created_at: string
  updated_at: string

  // Computed helpers
  isSuperAdmin?: boolean
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: User
}

// ─── Translation ──────────────────────────────────────────────────────────────

export interface Translation {
  locale: string
  title?: string
  name?: string
  body?: string
  content?: string
  excerpt?: string
  description?: string
  button_text?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  subtitle?: string
  primary_button_text?: string
  secondary_button_text?: string
  address?: string
  tagline?: string
}

// ─── Media ───────────────────────────────────────────────────────────────────

export interface Media {
  id: string
  file_name: string
  original_name: string
  mime_type: string
  size: number
  url: string
  thumbnail_url?: string
  alt_text?: string
  created_at: string
  updated_at: string
}

// ─── Content ─────────────────────────────────────────────────────────────────

export interface Content {
  id: number
  slug: string
  portal_type: 'website' | 'developer'
  sort_order: number
  is_published: boolean
  featured_image_id?: string | null
  featured_image?: Media | null
  translations: Translation[]
  created_at: string
  updated_at: string
}

export interface ContentCategory {
  id: string
  slug: string
  sort_order: number
  is_active: boolean
  translations: Translation[]
  created_at: string
  updated_at: string
}

export interface ContentFormData {
  slug: string
  portal_type: 'website' | 'developer'
  sort_order: number
  is_published: boolean
  featured_image_id?: string | null
  translations: {
    en: {
      title: string
      body: string
      excerpt: string
      seo_title: string
      seo_description: string
      seo_keywords: string
    }
    ne: {
      title: string
      body: string
      excerpt: string
      seo_title: string
      seo_description: string
      seo_keywords: string
    }
  }
}

// ─── News Category ───────────────────────────────────────────────────────────

export interface NewsCategory {
  id: number
  slug: string
  sort_order: number
  is_active: boolean
  news_count?: number
  translations: Translation[]
  created_at: string
  updated_at: string
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

export interface Tag {
  id: number
  slug: string
  usage_count?: number
  translations: Translation[]
  created_at: string
  updated_at: string
}

// ─── News ─────────────────────────────────────────────────────────────────────

export interface News {
  id: number
  slug: string
  is_published: boolean
  is_featured: boolean
  is_breaking: boolean
  published_at?: string | null
  category_id?: number | null
  category?: NewsCategory | null
  featured_image_id?: string | null
  featured_image?: Media | null
  tags?: Tag[]
  translations: Translation[]
  created_at: string
  updated_at: string
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryImage {
  id: number
  gallery_id: number
  media_id: string
  media: Media
  caption_en?: string
  caption_ne?: string
  sort_order: number
  is_cover: boolean
  created_at: string
  updated_at: string
}

export interface Gallery {
  id: number
  slug: string
  is_published: boolean
  event_date?: string | null
  cover_image_id?: string | null
  cover_image?: Media | null
  images_count?: number
  translations: Translation[]
  created_at: string
  updated_at: string
}

// ─── Banner ──────────────────────────────────────────────────────────────────

export interface Banner {
  id: number
  background_image_id?: string | null
  background_image?: Media | null
  primary_button_link?: string | null
  secondary_button_link?: string | null
  text_alignment: 'left' | 'center' | 'right'
  overlay_opacity: 'light' | 'medium' | 'dark'
  sort_order: number
  is_active: boolean
  translations: Translation[]
  created_at: string
  updated_at: string
}

// ─── Download ─────────────────────────────────────────────────────────────────

export interface DownloadCategory {
  id: number
  slug: string
  sort_order: number
  is_active: boolean
  downloads_count?: number
  translations: Translation[]
  created_at: string
  updated_at: string
}

export interface Download {
  id: number
  slug: string
  file_path?: string | null
  file_name?: string | null
  file_size?: number | null
  file_type?: string | null
  download_count: number
  sort_order: number
  is_active: boolean
  category_id?: number | null
  category?: DownloadCategory | null
  thumbnail_id?: string | null
  thumbnail?: Media | null
  translations: Translation[]
  created_at: string
  updated_at: string
}

// ─── Popup Notice ─────────────────────────────────────────────────────────────

export interface PopupNotice {
  id: number
  type: 'info' | 'warning' | 'success' | 'announcement'
  button_link?: string | null
  image_id?: string | null
  image?: Media | null
  start_date?: string | null
  end_date?: string | null
  display_frequency: 'session' | 'daily' | 'always' | 'once'
  is_active: boolean
  translations: Translation[]
  created_at: string
  updated_at: string
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: number
  menu_id: number
  parent_id?: number | null
  url: string
  target: '_self' | '_blank'
  icon?: string | null
  sort_order: number
  is_active: boolean
  translations: Translation[]
  children?: MenuItem[]
  created_at: string
  updated_at: string
}

export interface Menu {
  id: number
  name: string
  location: 'header' | 'footer'
  items?: MenuItem[]
  created_at: string
  updated_at: string
}

// ─── Setting ─────────────────────────────────────────────────────────────────

export interface Setting {
  key: string
  value: string | null
  group: string
}

// ─── Contact Submission ───────────────────────────────────────────────────────

export interface ContactSubmission {
  id: number
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

// ─── Newsletter Subscriber ────────────────────────────────────────────────────

export interface NewsletterSubscriber {
  id: number
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Developer Registration ───────────────────────────────────────────────────

export interface DeveloperRegistration {
  id: string
  contact_name: string
  email: string
  organization_name?: string | null
  organization_type: string
  use_case?: string | null
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'contacted'
  admin_notes?: string | null
  sandbox_credentials?: string | null
  is_read: boolean
  read_at?: string | null
  credentials_sent_at?: string | null
  created_at: string
  updated_at: string
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityLog {
  id: number
  user_id?: number | null
  user?: User | null
  user_name?: string
  action: string
  subject_type?: string | null
  subject_id?: number | null
  description?: string
  ip_address?: string | null
  created_at: string
  updated_at: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type: string
  title?: string
  message?: string
  data?: Record<string, unknown>
  read_at?: string | null
  created_at: string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_news: number
  total_galleries: number
  unread_contacts: number
  total_subscribers: number
  total_contents?: number
  total_users?: number
  total_media?: number
  total_downloads?: number
  total_contacts?: number
  recent_activities?: ActivityLog[]
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta?: PaginationMeta
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
  from?: number
  to?: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

// ─── Helper types ─────────────────────────────────────────────────────────────

export type Locale = 'en' | 'ne'

export function getTranslation(translations: Translation[], locale: Locale): Translation {
  return translations.find((t) => t.locale === locale) ?? { locale }
}

export function getTitle(translations: Translation[], fallback = ''): string {
  const en = translations.find((t) => t.locale === 'en')
  const ne = translations.find((t) => t.locale === 'ne')
  return en?.title || en?.name || ne?.title || ne?.name || fallback
}

export function getName(translations: Translation[], fallback = ''): string {
  const en = translations.find((t) => t.locale === 'en')
  const ne = translations.find((t) => t.locale === 'ne')
  return en?.name || en?.title || ne?.name || ne?.title || fallback
}
