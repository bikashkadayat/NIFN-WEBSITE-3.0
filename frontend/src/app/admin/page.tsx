'use client'

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Content Pages</h3>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">News Articles</h3>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
      </div>
    </div>
  )
}