'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateGallery } from '@/hooks/use-queries'
import { LocaleTabs } from '@/components/locale-tabs'

export default function CreateGalleryPage() {
  const router = useRouter()
  const createMutation = useCreateGallery()

  const [activeLocale, setActiveLocale] = useState('en')
  const [translations, setTranslations] = useState({
    en: { title: '', slug: '', description: '' },
    ne: { title: '', slug: '', description: '' },
  })
  const [isPublished, setIsPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [eventDate, setEventDate] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const updateTranslation = useCallback((locale: string, field: string, value: string) => {
    setTranslations(prev => ({ ...prev, [locale]: { ...prev[locale as 'en' | 'ne'], [field]: value } }))
  }, [])

  const handleTitleChange = (locale: string, value: string) => {
    updateTranslation(locale, 'title', value)
    if (!slugManuallyEdited && locale === 'en') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setTranslations(prev => ({ ...prev, en: { ...prev.en, slug }, ne: { ...prev.ne, slug } }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      is_published: isPublished,
      sort_order: sortOrder,
      event_date: eventDate || null,
      translations: [
        { locale: 'en', title: translations.en.title, slug: translations.en.slug, description: translations.en.description || null },
        { locale: 'ne', title: translations.ne.title || translations.en.title, slug: translations.ne.slug || translations.en.slug, description: translations.ne.description || null },
      ],
    }
    try {
      await createMutation.mutateAsync(payload)
      router.push('/galleries')
    } catch { /* handled */ }
  }

  const t = translations[activeLocale as 'en' | 'ne']

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Gallery</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <LocaleTabs active={activeLocale} onChange={setActiveLocale} locales={['en', 'ne']} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title {activeLocale === 'en' && <span className="text-red-500">*</span>}</label>
            <input type="text" value={t.title} onChange={(e) => handleTitleChange(activeLocale, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required={activeLocale === 'en'} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug ({activeLocale}) <span className="text-red-500">*</span></label>
            <input type="text" value={t.slug} onChange={(e) => { updateTranslation(activeLocale, 'slug', e.target.value); if (activeLocale === 'en') setSlugManuallyEdited(true) }} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={t.description} onChange={(e) => updateTranslation(activeLocale, 'description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
            {createMutation.isPending ? 'Saving...' : 'Save Gallery'}
          </button>
          <button type="button" onClick={() => router.push('/galleries')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
        </div>
      </form>
    </div>
  )
}