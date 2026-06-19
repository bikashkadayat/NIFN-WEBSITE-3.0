export interface Translation {
  locale: string
  title?: string
  slug?: string
  body?: string
  excerpt?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  name?: string
  description?: string
}

export interface Media {
  id: string
  url: string
  original_name: string
  file_path: string
  mime_type: string
  alt_text?: string
}

export interface ContentTranslation {
  id: string
  content_id: string
  locale: string
  title: string
  body?: string
  excerpt?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
}

export interface Content {
  id: string
  slug: string
  portal_type: string
  featured_image_id?: string
  is_published: boolean
  sort_order: number
  translations: ContentTranslation[]
  featured_image?: Media
  title?: string
  body?: string
  excerpt?: string
  created_at?: string
  updated_at?: string
}

export interface NewsTranslation {
  id: string
  news_id: string
  locale: string
  title: string
  slug: string
  body?: string
  excerpt?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
}

export interface NewsCategory {
  id: string
  sort_order?: number
  is_active: boolean
  translations: NewsCategoryTranslation[]
  name?: string
  slug?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface NewsCategoryTranslation {
  id: string
  category_id: string
  locale: string
  name: string
  slug: string
  description?: string
}

export interface Tag {
  id: string
  translations: TagTranslation[]
  name?: string
  slug?: string
  created_at?: string
  updated_at?: string
}

export interface TagTranslation {
  id: string
  tag_id: string
  locale: string
  name: string
  slug: string
}

export interface NewsTag {
  id: string
  name: string
}

export interface News {
  id: string
  category_id?: string
  featured_image_id?: string
  is_published: boolean
  is_featured: boolean
  is_breaking: boolean
  published_at?: string
  translations: NewsTranslation[]
  category?: NewsCategory
  tags?: Tag[]
  featured_image?: Media
  featured_image_url?: string
  title?: string
  slug?: string
  body?: string
  excerpt?: string
  seo_title?: string
  seo_description?: string
  author?: { id: string; name: string }
  created_at?: string
  updated_at?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

// ─── Gallery ──────────────────────────────────────────────────────────────

export interface GalleryTranslation {
  id: string
  gallery_id: string
  locale: string
  title: string
  slug: string
  description?: string
}

export interface Gallery {
  id: string
  cover_image_id?: string
  is_published: boolean
  sort_order: number
  event_date?: string
  translations: GalleryTranslation[]
  cover_image?: Media
  cover_image_url?: string
  gallery_images?: GalleryImage[]
  image_count?: number
  title?: string
  slug?: string
  description?: string
  images?: GalleryDetailImage[]
  created_at?: string
  updated_at?: string
}

export interface GalleryDetailImage {
  id: string
  url: string
  thumbnail_url: string
  caption?: string
  sort_order: number
}

export interface GalleryImage {
  id: string
  gallery_id: string
  media_id: string
  caption_en?: string
  caption_ne?: string
  sort_order: number
  media?: Media
  url?: string
  created_at?: string
  updated_at?: string
}

// ─── Banner ───────────────────────────────────────────────────────────────

export interface BannerTranslation {
  id: string
  banner_id: string
  locale: string
  title?: string
  subtitle?: string
  primary_button_text?: string
  secondary_button_text?: string
}

export interface Banner {
  id: string
  image_id?: string
  text_alignment: string
  overlay_opacity: number
  primary_button_link?: string
  secondary_button_link?: string
  sort_order: number
  is_active: boolean
  translations: BannerTranslation[]
  image?: Media
  title?: string
  subtitle?: string
  primary_button_text?: string
  secondary_button_text?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

// ─── Download ─────────────────────────────────────────────────────────────

export interface DownloadTranslation {
  id: string
  download_id: string
  locale: string
  title: string
  description?: string
}

export interface Download {
  id: string
  category_id?: string
  file_path: string
  file_name: string
  file_size: number
  file_type: string
  thumbnail_id?: string
  sort_order: number
  is_active: boolean
  download_count: number
  translations: DownloadTranslation[]
  category?: DownloadCategory
  thumbnail?: Media
  title?: string
  description?: string
  file_url?: string
  created_at?: string
  updated_at?: string
}

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

// ─── Download Category ────────────────────────────────────────────────────

export interface ContactSubmission {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface DownloadCategoryTranslation {
  id: string
  category_id: string
  locale: string
  name: string
  slug: string
}

export interface DownloadCategory {
  id: string
  sort_order: number
  is_active: boolean
  translations: DownloadCategoryTranslation[]
  name?: string
  slug?: string
  created_at?: string
  updated_at?: string
}