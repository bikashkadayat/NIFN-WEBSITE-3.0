import { fetchDeveloperSettings, getDeveloperPages, getDeveloperSdks, getDeveloperChangelog } from '@/lib/api'
import Link from 'next/link'
import { ArrowRight, Zap, Code2, Package, BookOpen } from 'lucide-react'

export default async function HomePage() {
  const settings = await fetchDeveloperSettings()
  const pages = await getDeveloperPages()
  const sdks = await getDeveloperSdks()
  const changelog = await getDeveloperChangelog()

  return (
    <>
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-cyan-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-6">
            DEVELOPER PORTAL
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {settings.portal_name || 'Build on NIFN'}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            {settings.portal_description || 'Build interoperable financial services with the National Interoperability Framework.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs/quick-start"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sdks"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
            >
              API Reference
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Start Building Today
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/docs/quick-start"
              className="group p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-cyan-200 transition-all"
            >
              <Zap className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
              <p className="text-gray-500 text-sm mb-4">
                Send your first payment in 10 minutes with our step-by-step guide.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 group-hover:gap-2 transition-all">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/sdks"
              className="group p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-cyan-200 transition-all"
            >
              <Code2 className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
              <p className="text-gray-500 text-sm mb-4">
                Explore all endpoints, parameters, and response formats.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 group-hover:gap-2 transition-all">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/sdks"
              className="group p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-cyan-200 transition-all"
            >
              <Package className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SDKs</h3>
              <p className="text-gray-500 text-sm mb-4">
                Official libraries for Node.js, Python, PHP, and more.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 group-hover:gap-2 transition-all">
                View SDKs <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {pages.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Documentation
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.slice(0, 6).map((page) => (
                <Link
                  key={page.id}
                  href={`/docs/${page.slug}`}
                  className="group p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-cyan-200 transition-all"
                >
                  <BookOpen className="w-6 h-6 text-cyan-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{page.title}</h3>
                  {page.excerpt && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{page.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {sdks.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Official SDKs & Libraries
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sdks.slice(0, 3).map((sdk) => (
                <div
                  key={sdk.id}
                  className="p-6 rounded-xl border border-gray-200 bg-white"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{sdk.title || sdk.language}</h3>
                  <p className="text-sm text-gray-500 mb-2">{sdk.package_name}</p>
                  {sdk.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{sdk.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {changelog.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Latest Updates</h2>
              <Link
                href="/changelog"
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {changelog.slice(0, 3).map((entry) => (
                <Link
                  key={entry.id}
                  href="/changelog"
                  className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-cyan-200 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono font-semibold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
                      {entry.version}
                    </span>
                    {entry.release_date && (
                      <span className="text-xs text-gray-400">
                        {new Date(entry.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{entry.title}</h3>
                  {entry.body && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {entry.body.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#0F172A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start building?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Register for sandbox access and get your credentials in 2 days.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors"
          >
            Register Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
