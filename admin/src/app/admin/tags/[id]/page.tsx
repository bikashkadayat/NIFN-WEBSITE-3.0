'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function TagEditRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/tags') }, [router])
  return null
}
