import { fetchDeveloperSettings } from '@/lib/api'

export default async function DocsIndexPage() {
  const settings = await fetchDeveloperSettings()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {settings.portal_name || 'Documentation'}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Select a topic from the sidebar to get started.
      </p>
    </div>
  )
}
