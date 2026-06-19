'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateContent } from '@/hooks/use-queries'
import { LocaleTabs } from '@/components/locale-tabs'
import { TiptapEditor } from '@/components/tiptap-editor'
import { ImageUploader } from '@/components/image-uploader'

export default function CreateContentPage() {
  const router = useRouter()
  const createMutation = useCreateContent()

  const [activeLocale, setActiveLocale] = useState('en')
  const [translations, setTranslations] = useState({
    en: { title: '', body: '', excerpt: '', seo_title: '', seo_description: '', seo_keywords: '' },
    ne: { title: '', body: '', excerpt: '', seo_title: '', seo_description: '', seo_keywords: '' },
  })

  const [slug, setSlug] = useState('')
  const [portalType, setPortalType] = useState('website')
  const [featuredImageId, setFeaturedImageId] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const updateTranslation = useCallback((locale: string, field: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale as 'en' | 'ne'], [field]: value },
    }))
  }, [])

  const handleTitleChange = (locale: string, value: string) => {
    updateTranslation(locale, 'title', value)
    if (!slugManuallyEdited && locale === 'en') {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      slug: slug || translations.en.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      portal_type: portalType,
      featured_image_id: featuredImageId || null,
      is_published: isPublished,
      sort_order: sortOrder,
      translations: [
        {
          locale: 'en',
          title: translations.en.title,
          body: translations.en.body || null,
          excerpt: translations.en.excerpt || null,
          seo_title: translations.en.seo_title || null,
          seo_description: translations.en.seo_description || null,
          seo_keywords: translations.en.seo_keywords || null,
        },
        {
          locale: 'ne',
          title: translations.ne.title || translations.en.title,
          body: translations.ne.body || null,
          excerpt: translations.ne.excerpt || null,
          seo_title: translations.ne.seo_title || null,
          seo_description: translations.ne.seo_description || null,
          seo_keywords: translations.ne.seo_keywords || null,
        },
      ],
    }

    try {
      await createMutation.mutateAsync(payload)
      router.push('/contents')
    } catch {
      // error handled in mutation
    }
  }

  const t = translations[activeLocale as 'en' | 'ne']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Content</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Locale Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <LocaleTabs active={activeLocale} onChange={setActiveLocale} locales={['en', 'ne']} />

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title {activeLocale === 'en' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={t.title}
              onChange={(e) => handleTitleChange(activeLocale, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required={activeLocale === 'en'}
            />
          </div>

          {/* Body */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <TiptapEditor
              value={t.body}
              onChange={(val) => updateTranslation(activeLocale, 'body', val)}
            />
          </div>

          {/* Excerpt */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={t.excerpt}
              onChange={(e) => updateTranslation(activeLocale, 'excerpt', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* SEO Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={t.seo_title}
                onChange={(e) => updateTranslation(activeLocale, 'seo_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <input
                type="text"
                value={t.seo_description}
                onChange={(e) => updateTranslation(activeLocale, 'seo_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
              <input
                type="text"
                value={t.seo_keywords}
                onChange={(e) => updateTranslation(activeLocale, 'seo_keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Common Fields */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true) }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Portal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portal Type</label>
              <select
                value={portalType}
                onChange={(e) => setPortalType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="website">Website</option>
                <option value="developer">Developer Portal</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Published Toggle */}
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <ImageUploader
              value=""
              onChange={(id, url) => setFeaturedImageId(id)}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Content'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/contents')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}