import axios, { type AxiosRequestConfig } from 'axios'

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1'

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default client

// ─── Generic helpers ─────────────────────────────────────────────────────────

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.get<T>(url, config)
  return res.data
}

export async function apiPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.post<T>(url, data, config)
  return res.data
}

export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  const res = await client.put<T>(url, data)
  return res.data
}

export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
  const res = await client.patch<T>(url, data)
  return res.data
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await client.delete<T>(url)
  return res.data
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<{ data: { access_token: string; user: Record<string, unknown> } }>('/auth/login', { email, password }),
  logout: () => apiPost('/auth/logout'),
  me: () => apiGet<{ data: Record<string, unknown> }>('/auth/me'),
}

// ─── Media ───────────────────────────────────────────────────────────────────

export const mediaApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/media', { params }),
  upload: (formData: FormData) =>
    apiPost<{ data: unknown }>('/admin/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: { alt_text?: string }) =>
    apiPut<{ data: unknown }>(`/admin/media/${id}`, data),
  delete: (id: string) => apiDelete(`/admin/media/${id}`),
}

// ─── Contents ─────────────────────────────────────────────────────────────────

export const contentsApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/contents', { params }),
  get: (id: string | number) => apiGet<{ data: unknown }>(`/admin/contents/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/contents', data),
  update: (id: string | number, data: unknown) => apiPut<{ data: unknown }>(`/admin/contents/${id}`, data),
  delete: (id: string | number) => apiDelete(`/admin/contents/${id}`),
}

// ─── News ─────────────────────────────────────────────────────────────────────

export const newsApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/news', { params }),
  get: (id: string | number) => apiGet<{ data: unknown }>(`/admin/news/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/news', data),
  update: (id: string | number, data: unknown) => apiPut<{ data: unknown }>(`/admin/news/${id}`, data),
  delete: (id: string | number) => apiDelete(`/admin/news/${id}`),
}

// ─── News Categories ─────────────────────────────────────────────────────────

export const newsCategoriesApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/news-categories', { params }),
  get: (id: string | number) => apiGet<{ data: unknown }>(`/admin/news-categories/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/news-categories', data),
  update: (id: string | number, data: unknown) => apiPut<{ data: unknown }>(`/admin/news-categories/${id}`, data),
  delete: (id: string | number) => apiDelete(`/admin/news-categories/${id}`),
}

// ─── Content Categories ───────────────────────────────────────────────────────

export const contentCategoriesApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/content-categories', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/content-categories/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/content-categories', data),
  update: (id: number, data: unknown) =>
    apiPut<{ data: unknown }>(`/admin/content-categories/${id}`, data),
  delete: (id: number) => apiDelete(`/admin/content-categories/${id}`),
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const tagsApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/tags', { params }),
  get: (id: string | number) => apiGet<{ data: unknown }>(`/admin/tags/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/tags', data),
  update: (id: string | number, data: unknown) => apiPut<{ data: unknown }>(`/admin/tags/${id}`, data),
  delete: (id: string | number) => apiDelete(`/admin/tags/${id}`),
}

// ─── Galleries ───────────────────────────────────────────────────────────────

export const galleriesApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/galleries', { params }),
  get: (id: string | number) => apiGet<{ data: unknown }>(`/admin/galleries/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/galleries', data),
  update: (id: string | number, data: unknown) => apiPut<{ data: unknown }>(`/admin/galleries/${id}`, data),
  delete: (id: string | number) => apiDelete(`/admin/galleries/${id}`),
  getImages: (galleryId: string | number) =>
    apiGet<{ data: unknown[] }>(`/admin/galleries/${galleryId}/images`),
  uploadImages: (galleryId: string | number, formData: FormData) =>
    apiPost<{ data: unknown[] }>(`/admin/galleries/${galleryId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  reorderImages: (galleryId: string | number, order: { id: string | number; sort_order: number }[]) =>
    apiPost(`/admin/galleries/${galleryId}/images/reorder`, { order }),
  deleteImage: (galleryId: string | number, imageId: string | number) =>
    apiDelete(`/admin/galleries/${galleryId}/images/${imageId}`),
  updateImage: (galleryId: string | number, imageId: string | number, data: unknown) =>
    apiPut(`/admin/galleries/${galleryId}/images/${imageId}`, data),
}

// ─── Banners ─────────────────────────────────────────────────────────────────

export const bannersApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/banners', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/banners/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/banners', data),
  update: (id: number, data: unknown) => apiPut<{ data: unknown }>(`/admin/banners/${id}`, data),
  delete: (id: number) => apiDelete(`/admin/banners/${id}`),
}

// ─── Downloads ───────────────────────────────────────────────────────────────

export const downloadsApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/downloads', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/downloads/${id}`),
  create: (data: FormData | unknown) =>
    apiPost<{ data: unknown }>('/admin/downloads', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }),
  update: (id: number, data: FormData | unknown) =>
    apiPost<{ data: unknown }>(`/admin/downloads/${id}?_method=PUT`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }),
  delete: (id: number) => apiDelete(`/admin/downloads/${id}`),
}

// ─── Download Categories ──────────────────────────────────────────────────────

export const downloadCategoriesApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/download-categories', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/download-categories/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/download-categories', data),
  update: (id: number, data: unknown) =>
    apiPut<{ data: unknown }>(`/admin/download-categories/${id}`, data),
  delete: (id: number) => apiDelete(`/admin/download-categories/${id}`),
}

// ─── Popup Notices ───────────────────────────────────────────────────────────

export const popupNoticesApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/popup-notices', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/popup-notices/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/popup-notices', data),
  update: (id: number, data: unknown) =>
    apiPut<{ data: unknown }>(`/admin/popup-notices/${id}`, data),
  delete: (id: number) => apiDelete(`/admin/popup-notices/${id}`),
}

// ─── Menus ───────────────────────────────────────────────────────────────────

export const menusApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[] }>('/admin/menus', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/menus/${id}`),
  getItems: (menuId: number) =>
    apiGet<{ data: unknown[] }>(`/admin/menus/${menuId}/items`),
  createItem: (menuId: number, data: unknown) =>
    apiPost<{ data: unknown }>(`/admin/menus/${menuId}/items`, data),
  updateItem: (menuId: number, itemId: number, data: unknown) =>
    apiPut<{ data: unknown }>(`/admin/menus/${menuId}/items/${itemId}`, data),
  deleteItem: (menuId: number, itemId: number) =>
    apiDelete(`/admin/menus/${menuId}/items/${itemId}`),
  reorderItems: (menuId: number, order: { id: number; sort_order: number; parent_id?: number | null }[]) =>
    apiPost(`/admin/menus/${menuId}/items/reorder`, { order }),
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsApi = {
  list: () => apiGet<{ data: unknown[] }>('/admin/settings'),
  batchUpdate: (settings: { key: string; value: string }[]) =>
    apiPost<{ data: unknown[] }>('/admin/settings/batch', { settings }),
  update: (key: string, value: string) =>
    apiPut<{ data: unknown }>(`/admin/settings/${key}`, { value }),
}

// ─── Users ───────────────────────────────────────────────────────────────────

export const usersApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/users', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/users/${id}`),
  create: (data: unknown) => apiPost<{ data: unknown }>('/admin/users', data),
  update: (id: number, data: unknown) => apiPut<{ data: unknown }>(`/admin/users/${id}`, data),
  delete: (id: number) => apiDelete(`/admin/users/${id}`),
}

// ─── Contact Submissions ──────────────────────────────────────────────────────

export const contactSubmissionsApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/contact-submissions', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/contact-submissions/${id}`),
  markRead: (id: number) => apiPost(`/admin/contact-submissions/${id}/mark-read`),
  delete: (id: number) => apiDelete(`/admin/contact-submissions/${id}`),
}

// ─── Newsletter Subscribers ───────────────────────────────────────────────────

export const newsletterApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/newsletter-subscribers', { params }),
  export: () => apiGet<Blob>('/admin/newsletter-subscribers/export', { responseType: 'blob' }),
  unsubscribe: (id: number) => apiPost(`/admin/newsletter-subscribers/${id}/unsubscribe`),
  delete: (id: number) => apiDelete(`/admin/newsletter-subscribers/${id}`),
}

// ─── Developer Registrations ──────────────────────────────────────────────────

export const developerRegistrationsApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/developer-registrations', { params }),
  get: (id: string) => apiGet<{ data: unknown }>(`/admin/developer-registrations/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    apiPut<{ data: unknown }>(`/admin/developer-registrations/${id}`, data),
  markRead: (id: string) => apiPost(`/admin/developer-registrations/${id}/mark-read`),
  markReviewed: (id: string) => apiPost(`/admin/developer-registrations/${id}/mark-reviewed`),
  updateStatus: (id: string, status: string) =>
    apiPost(`/admin/developer-registrations/${id}/status`, { status }),
  delete: (id: string) => apiDelete(`/admin/developer-registrations/${id}`),
  unreadCount: () => apiGet<{ data: { unread_count: number } }>('/admin/developer-registrations/unread-count'),
}

// ─── Activity Logs ────────────────────────────────────────────────────────────

export const activityLogsApi = {
  list: (params?: Record<string, unknown>) =>
    apiGet<{ data: unknown[]; meta?: unknown }>('/admin/activity-logs', { params }),
  get: (id: number) => apiGet<{ data: unknown }>(`/admin/activity-logs/${id}`),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  stats: () => apiGet<{ data: unknown }>('/admin/dashboard/stats'),
}

// Legacy compat — used in older hook files
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => client.get<{ data: T }>(url, config).then((r) => r.data),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    client.post<{ data: T }>(url, data, config).then((r) => r.data),
  put: <T>(url: string, data?: unknown) => client.put<{ data: T }>(url, data).then((r) => r.data),
  patch: <T>(url: string, data?: unknown) => client.patch<{ data: T }>(url, data).then((r) => r.data),
  delete: <T>(url: string) => client.delete<{ data: T }>(url).then((r) => r.data),
  delete_: <T>(url: string) => client.delete<{ data: T }>(url).then((r) => r.data),
}
