'use client'

import { useReports } from '@/hooks/use-reports'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Newspaper, Images, Download, Mail, Users, FileText } from 'lucide-react'

export default function ReportsPage() {
  const { data: stats, isLoading } = useReports()

  const cards = [
    { label: 'Total News Articles', value: stats?.total_news, icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Galleries', value: stats?.total_galleries, icon: Images, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Downloads', value: stats?.total_downloads, icon: Download, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Contact Submissions', value: stats?.total_contacts, icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Newsletter Subscribers', value: stats?.total_subscribers, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Contents', value: stats?.total_contents, icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Reports' }]} />
      <h1 className="text-2xl font-bold text-zinc-900">Reports</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}>
                    <Icon size={24} className={card.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{card.label}</p>
                    <p className="text-2xl font-bold text-zinc-900">{card.value ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
