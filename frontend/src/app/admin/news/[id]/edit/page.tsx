'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useNewsItem, useUpdateNews, useNewsCategories, useTags } from '@/hooks/use-queries'
import { LocaleTabs } from '@/components/locale-tabs'
import { TiptapEditor } from '@/components/tiptap-editor'
import { ImageUploader } from '@/components/image-uploader'

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { data: news, isLoading } = useNewsItem(id)
  const updateMutation = useUpdateNews()
  const { data: categories } = useNewsCategories()
  const { data: tags } = useTags()

  const [activeLocale, setActiveLocale] = useState('en')
  const [translations, setTranslations] = useState({
    en: { title: '', slug: '', body: '', excerpt: '', seo_title: '', seo_description: '', seo_keywords: '' },
    ne: { title: '', slug: '', body: '', excerpt: '', seo_title: '', seo_description: '', seo_keywords: '' },
  })
  const [categoryId, setCategoryId] = useState('')
  const [tagIds, setTagIds] = useState<string[]>([])
  const [featuredImageId, setFeaturedImageId] = useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isBreaking, setIsBreaking] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [loaded, setLoaded] = useState(false)

  if (news && !loaded) {
    const enTrans = news.translations?.find(t => t.locale === 'en')
    const neTrans = news.translations?.find(t => t.locale === 'ne')
    setTranslations({
      en: {
        title: enTrans?.title || '',
        slug: enTrans?.slug || '',
        body: enTrans?.body || '',
        excerpt: enTrans?.excerpt || '',
        seo_title: enTrans?.seo_title || '',
        seo_description: enTrans?.seo_description || '',
        seo_keywords: enTrans?.seo_keywords || '',
      },
      ne: {
        title: neTrans?.title || '',
        slug: neTrans?.slug || '',
        body: neTrans?.body || '',
        excerpt: neTrans?.excerpt || '',
        seo_title: neTrans?.seo_title || '',
        seo_description: neTrans?.seo_description || '',
        seo_keywords: neTrans?.seo_keywords || '',
      },
    })
    setCategoryId(news.category_id || '')
    setTagIds(news.tags?.map(t => t.id) || [])
    setFeaturedImageId(news.featured_image_id || '')
    setFeaturedImageUrl(news.featured_image?.url || '')
    setIsPublished(news.is_published ?? false)
    setIsFeatured(news.is_featured ?? false)
    setIsBreaking(news.is_breaking ?? false)
    setPublishedAt(news.published_at ? news.published_at.split('T')[0] : '')
    setLoaded(true)
  }

  const updateTranslation = useCallback((locale: string, field: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale as 'en' | 'ne'], [field]: value },
    }))
  }, [])

  const toggleTag = (tagId: string) => {
    setTagIds(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      id,
      category_id: categoryId || null,
      featured_image_id: featuredImageId || null,
      is_published: isPublished,
      is_featured: isFeatured,
      is_breaking: isBreaking,
      published_at: publishedAt || null,
      tag_ids: tagIds.length > 0 ? tagIds : null,
      translations: [
        {
          locale: 'en',
          title: translations.en.title,
          slug: translations.en.slug,
          body: translations.en.body || null,
          excerpt: translations.en.excerpt || null,
          seo_title: translations.en.seo_title || null,
          seo_description: translations.en.seo_description || null,
          seo_keywords: translations.en.seo_keywords || null,
        },
        {
          locale: 'ne',
          title: translations.ne.title || translations.en.title,
          slug: translations.ne.slug || translations.en.slug,
          body: translations.ne.body || null,
          excerpt: translations.ne.excerpt || null,
          seo_title: translations.ne.seo_title || null,
          seo_description: translations.ne.seo_description || null,
          seo_keywords: translations.ne.seo_keywords || null,
        },
      ],
    }

    try {
      await updateMutation.mutateAsync(payload)
      router.push('/news')
    } catch {
      // handled in mutation
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  const t = translations[activeLocale as 'en' | 'ne']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit News Article</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <LocaleTabs active={activeLocale} onChange={setActiveLocale} locales={['en', 'ne']} />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title {activeLocale === 'en' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={t.title}
              onChange={(e) => updateTranslation(activeLocale, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required={activeLocale === 'en'}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug ({activeLocale === 'en' ? 'English' : 'Nepali'})</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">/news/</span>
              <input
                type="text"
                value={t.slug}
                onChange={(e) => updateTranslation(activeLocale, 'slug', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <TiptapEditor
              value={t.body}
              onChange={(val) => updateTranslation(activeLocale, 'body', val)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={t.excerpt}
              onChange={(e) => updateTranslation(activeLocale, 'excerpt', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.translations?.find(t => t.locale === 'en')?.name || cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    tagIds.includes(tag.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tag.translations?.find(t => t.locale === 'en')?.name || tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Published</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Featured</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Breaking News</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <ImageUploader
              value={featuredImageUrl}
              onChange={(id, url) => { setFeaturedImageId(id); setFeaturedImageUrl(url) }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
          >
            {updateMutation.isPending ? 'Updating...' : 'Update News Article'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/news')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}