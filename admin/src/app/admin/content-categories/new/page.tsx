'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function ContentCategoryNewPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/contents') }, [router])
  return null
}
