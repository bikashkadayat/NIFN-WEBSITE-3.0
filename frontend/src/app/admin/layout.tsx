import { Sidebar } from '@/components/sidebar'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster position="top-right" />
    </>
  )
}
