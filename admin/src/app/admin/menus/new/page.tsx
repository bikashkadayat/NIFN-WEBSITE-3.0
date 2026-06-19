'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function MenuNewRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/menus') }, [router])
  return null
}
