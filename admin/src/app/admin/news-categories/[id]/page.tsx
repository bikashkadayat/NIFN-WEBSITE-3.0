'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function NewsCategoryEditRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/news-categories') }, [router])
  return null
}
