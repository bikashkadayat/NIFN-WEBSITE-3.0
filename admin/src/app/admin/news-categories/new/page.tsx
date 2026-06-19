'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function NewsCategoryNewRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/news-categories') }, [router])
  return null
}
