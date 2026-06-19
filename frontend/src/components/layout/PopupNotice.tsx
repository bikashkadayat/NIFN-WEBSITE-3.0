'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '@/lib/api'

interface PopupData {
  id: string
  title?: string
  body?: string
  image_url?: string
  button_text?: string
  button_link?: string
}

export function PopupNotice() {
  const [notice, setNotice] = useState<PopupData | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    async function fetchNotice() {
      try {
        const res = await api.get('/v1/popup-notices/active')
        const data: PopupData | null = res.data?.data
        if (!data) return
        const dismissed = localStorage.getItem(`popup-dismissed-${data.id}`)
        if (dismissed === 'true') return
        setNotice(data)
        setVisible(true)
      } catch {
        // silently fail
      }
    }
    fetchNotice()
  }, [])

  const handleClose = () => {
    if (notice) {
      localStorage.setItem(`popup-dismissed-${notice.id}`, 'true')
    }
    setVisible(false)
  }

  if (!visible || !notice) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        {notice.image_url && (
          <div className="relative w-full h-48 sm:h-56 rounded-t-2xl overflow-hidden">
            <img
              src={notice.image_url}
              alt={notice.title || ''}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {notice.title && (
            <h2 className="text-xl font-bold text-gray-900 mb-3">{notice.title}</h2>
          )}
          {notice.body && (
            <div
              className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: notice.body }}
            />
          )}
          {notice.button_text && notice.button_link && (
            <a
              href={notice.button_link}
              target={notice.button_link.startsWith('http') ? '_blank' : undefined}
              rel={notice.button_link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="mt-5 inline-block px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {notice.button_text}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
