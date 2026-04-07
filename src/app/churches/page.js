import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export const metadata = {
  title: 'Churches in New Zealand | FindMyChurch NZ',
  description: 'Browse all churches listed on FindMyChurch NZ across Aotearoa. Find churches by city, suburb and denomination.',
  alternates: {
    canonical: '/churches',
  },
  openGraph: {
    title: 'Churches in New Zealand | FindMyChurch NZ',
    description: 'Browse all churches listed on FindMyChurch NZ across Aotearoa. Find churches by city, suburb and denomination.',
    url: '/churches',
    type: 'website',
  },
  twitter: {
    title: 'Churches in New Zealand | FindMyChurch NZ',
    description: 'Browse all churches listed on FindMyChurch NZ across Aotearoa.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://findmychurch.co.nz',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Churches in New Zealand',
          item: 'https://findmychurch.co.nz/churches',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://findmychurch.co.nz/churches',
      name: 'Churches in New Zealand',
      description: 'Browse all churches listed on FindMyChurch NZ across Aotearoa.',
      url: 'https://findmychurch.co.nz/churches',
      isPartOf: {
        '@type': 'WebSite',
        name: 'FindMyChurch NZ',
        url: 'https://findmychurch.co.nz',
      },
    },
  ],
}

export default async function ChurchesPage() {
  const { data: churches, error } = await supabase
    .from('churches')
    .select(`
      id,
      name,
      slug,
      city,
      suburb,
      denominations ( name )
    `)
    .order('city')
    .order('name')

  if (error) console.error('Database error:', error)

  // Group churches by city, preserving alphabetical order
  const citiesMap = new Map()
  for (const church of (churches ?? [])) {
    const key = church.city ?? 'Other'
    if (!citiesMap.has(key)) citiesMap.set(key, [])
    citiesMap.get(key).push(church)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Header ── */}
        <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="text-sage text-sm mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">Churches in New Zealand</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Churches in New Zealand
            </h1>
            <p className="text-sage text-lg max-w-2xl">
              Browse churches across Aotearoa, grouped by city. Find your local congregation by location and denomination.
            </p>
          </div>
        </section>

        {/* ── City jump links ── */}
        {citiesMap.size > 1 && (
          <nav aria-label="Jump to city" className="bg-white border-b border-sage/20 px-4 sm:px-6 py-3">
            <div className="max-w-6xl mx-auto flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Jump to:</span>
              {[...citiesMap.keys()].map((city) => (
                <a
                  key={city}
                  href={`#${encodeURIComponent(city)}`}
                  className="text-sm text-deep-green hover:underline px-2 py-0.5 rounded bg-sage/10 hover:bg-sage/20 transition-colors"
                >
                  {city}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* ── Churches grouped by city ── */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-14">
            {citiesMap.size > 0 ? (
              [...citiesMap.entries()].map(([cityName, cityChurches]) => (
                <div key={cityName} id={encodeURIComponent(cityName)}>
                  <h2 className="text-2xl font-bold text-deep-green mb-1">
                    Churches in {cityName}
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {cityChurches.length} {cityChurches.length === 1 ? 'church' : 'churches'} listed
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cityChurches.map((c) => {
                      const location = [c.suburb, c.city].filter(Boolean).join(', ')
                      const denominationName = c.denominations?.name

                      return (
                        <Link
                          key={c.id}
                          href={`/churches/${c.slug}`}
                          className="group block bg-white border border-sage/40 rounded-xl p-5 hover:border-deep-green/50 hover:shadow-md transition-all"
                        >
                          <h3 className="font-semibold text-deep-green text-base mb-1 group-hover:underline leading-snug">
                            {c.name}
                          </h3>

                          {denominationName && (
                            <span className="inline-block text-xs font-medium text-deep-green/70 bg-sage/20 border border-sage/30 px-2 py-0.5 rounded-full mb-2">
                              {denominationName}
                            </span>
                          )}

                          {location && (
                            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                              </svg>
                              {location}
                            </p>
                          )}

                          <span className="mt-3 inline-flex items-center gap-1 text-deep-green text-xs font-medium">
                            View {c.name} profile
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No churches found.</p>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
