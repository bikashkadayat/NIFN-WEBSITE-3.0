import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import { LayoutClient } from './layout-client'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: {
    default: 'NIF Developer Portal',
    template: '%s | NIF Developer Portal',
  },
  description: 'Build on Nepal\'s open payment network with the National Interoperability Framework developer portal. Documentation, SDKs, API reference.',
  openGraph: {
    title: 'NIF Developer Portal',
    description: 'Build on Nepal\'s open payment network',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NIF Developer Portal',
    description: 'Build on Nepal\'s open payment network',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} font-sans antialiased`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
