import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PopupNotice } from '@/components/layout/PopupNotice'
import { Providers } from '@/components/providers'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'Nepal Interledger Financial Network',
  description: 'Connecting Nepal to the global interledger network for inclusive financial services.',
}

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function fetchHeaderMenu() {
  try {
    const res = await fetch(`${API_URL}/v1/menus/header`, {
      next: { revalidate: 300, tags: ['menus'] },
    })
    if (!res.ok) return undefined
    const json = await res.json()
    return json?.items ?? undefined
  } catch {
    return undefined
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cmsItems = await fetchHeaderMenu()

  return (
    <html lang="en">
      <body className={`${rubik.variable} font-sans min-h-screen flex flex-col`}>
        <Providers>
          <Navbar cmsItems={cmsItems} />
          <main className="flex-1 pt-20 lg:pt-24">
            {children}
          </main>
          <Footer />
          <PopupNotice />
        </Providers>
      </body>
    </html>
  )
}
