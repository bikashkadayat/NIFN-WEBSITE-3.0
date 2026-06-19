'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function ContentNewRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/contents/create') }, [router])
  return null
}
