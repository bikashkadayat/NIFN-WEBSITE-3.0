'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateBanner, useUploadMedia } from '@/hooks/use-queries'
import { ImageUploader } from '@/components/image-uploader'

export default function CreateBannerPage() {
  const router = useRouter()
  const createMutation = useCreateBanner()

  const [imageId, setImageId] = useState('')
  const [textAlignment, setTextAlignment] = useState('center')
  const [overlayOpacity, setOverlayOpacity] = useState(50)
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const [en, setEn] = useState({ title: '', subtitle: '', primary_button_text: '', secondary_button_text: '' })
  const [ne, setNe] = useState({ title: '', subtitle: '', primary_button_text: '', secondary_button_text: '' })
  const [primaryLink, setPrimaryLink] = useState('')
  const [secondaryLink, setSecondaryLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      image_id: imageId || null,
      text_alignment: textAlignment,
      overlay_opacity: overlayOpacity,
      primary_button_link: primaryLink || null,
      secondary_button_link: secondaryLink || null,
      sort_order: sortOrder,
      is_active: isActive,
      translations: [
        { locale: 'en', title: en.title || null, subtitle: en.subtitle || null, primary_button_text: en.primary_button_text || null, secondary_button_text: en.secondary_button_text || null },
        { locale: 'ne', title: ne.title || null, subtitle: ne.subtitle || null, primary_button_text: ne.primary_button_text || null, secondary_button_text: ne.secondary_button_text || null },
      ],
    }
    try {
      await createMutation.mutateAsync(payload)
      router.push('/banners')
    } catch { /* handled */ }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Banner</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Background Image */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Background Image</h2>
          <p className="text-xs text-gray-400 mb-2">Recommended: 1920×800px</p>
          <ImageUploader value="" onChange={(id) => setImageId(id)} />
        </div>

        {/* English */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">English Content</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={en.title} onChange={(e) => setEn(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" value={en.subtitle} onChange={(e) => setEn(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
                <input type="text" value={en.primary_button_text} onChange={(e) => setEn(prev => ({ ...prev, primary_button_text: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Link</label>
                <input type="text" value={primaryLink} onChange={(e) => setPrimaryLink(e.target.value)} placeholder="/impact" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
                <input type="text" value={en.secondary_button_text} onChange={(e) => setEn(prev => ({ ...prev, secondary_button_text: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Link</label>
                <input type="text" value={secondaryLink} onChange={(e) => setSecondaryLink(e.target.value)} placeholder="/contact" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Nepali */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">नेपाली Content</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (नेपाली)</label>
              <input type="text" value={ne.title} onChange={(e) => setNe(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (नेपाली)</label>
              <input type="text" value={ne.subtitle} onChange={(e) => setNe(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text (नेपाली)</label>
                <input type="text" value={ne.primary_button_text} onChange={(e) => setNe(prev => ({ ...prev, primary_button_text: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text (नेपाली)</label>
                <input type="text" value={ne.secondary_button_text} onChange={(e) => setNe(prev => ({ ...prev, secondary_button_text: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
              <select value={textAlignment} onChange={(e) => setTextAlignment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity</label>
              <select value={overlayOpacity} onChange={(e) => setOverlayOpacity(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value={30}>Light (30%)</option>
                <option value={50}>Medium (50%)</option>
                <option value={70}>Dark (70%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
            {createMutation.isPending ? 'Saving...' : 'Save Banner'}
          </button>
          <button type="button" onClick={() => router.push('/banners')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
        </div>
      </form>
    </div>
  )
}