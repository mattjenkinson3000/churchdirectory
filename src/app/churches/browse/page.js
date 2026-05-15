import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

const SITE_URL = 'https://findmychurch.co.nz'

export const metadata = {
  title: 'Browse Churches by City | FindMyChurch NZ',
  description:
    'Browse churches across New Zealand by city and denomination. Find Baptist, Anglican, Catholic, Presbyterian and more churches near you.',
  alternates: { canonical: '/churches/browse' },
  openGraph: {
    title: 'Browse Churches by City | FindMyChurch NZ',
    description:
      'Browse churches across New Zealand by city and denomination. Find Baptist, Anglican, Catholic, Presbyterian and more churches near you.',
    url: '/churches/browse',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Churches', item: `${SITE_URL}/churches` },
        { '@type': 'ListItem', position: 3, name: 'Browse by City', item: `${SITE_URL}/churches/browse` },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/churches/browse`,
      name: 'Browse Churches by City',
      description: 'Browse churches across New Zealand by city and denomination.',
      url: `${SITE_URL}/churches/browse`,
      isPartOf: { '@type': 'WebSite', name: 'FindMyChurch NZ', url: SITE_URL },
    },
  ],
}

export default async function BrowseByCity() {
  const { data } = await supabase
    .from('churches')
    .select('city, denominations(name, slug)')
    .eq('is_active', true)
    .not('city', 'is', null)

  // Build city → { count, denoms: Map<slug, name> }
  const cityMap = new Map()
  for (const row of (data ?? [])) {
    const city = row.city
    if (!cityMap.has(city)) cityMap.set(city, { count: 0, denoms: new Map() })
    const entry = cityMap.get(city)
    entry.count++
    if (row.denominations?.slug) {
      entry.denoms.set(row.denominations.slug, row.denominations.name)
    }
  }

  // Filter to cities with ≥ 2 churches, sort alphabetically
  const cities = [...cityMap.entries()]
    .filter(([, { count }]) => count >= 2)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([city, { count, denoms }]) => ({
      city,
      count,
      denominations: [...denoms.entries()]
        .sort(([, a], [, b]) => a.localeCompare(b))
        .map(([slug, name]) => ({ slug, name })),
    }))

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
              <Link href="/churches" className="hover:text-white transition-colors">Churches</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">Browse by City</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Browse Churches by City</h1>
            <p className="text-sage text-lg max-w-2xl">
              Find churches across Aotearoa New Zealand by city and denomination.
              Select a denomination in your city to see all matching listings.
            </p>
          </div>
        </section>

        {/* ── Jump links ── */}
        {cities.length > 1 && (
          <nav aria-label="Jump to city" className="bg-white border-b border-sage/20 px-4 sm:px-6 py-3">
            <div className="max-w-6xl mx-auto flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">
                Jump to:
              </span>
              {cities.map(({ city }) => (
                <a
                  key={city}
                  href={`#city-${encodeURIComponent(city)}`}
                  className="text-sm text-deep-green hover:underline px-2 py-0.5 rounded bg-sage/10 hover:bg-sage/20 transition-colors"
                >
                  {city}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* ── City sections ── */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {cities.length > 0 ? (
              cities.map(({ city, count, denominations }) => (
                <div key={city} id={`city-${encodeURIComponent(city)}`}>
                  <div className="flex items-baseline gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-deep-green">{city}</h2>
                    <span className="text-sm text-gray-400">
                      {count} {count === 1 ? 'church' : 'churches'}
                    </span>
                  </div>

                  {denominations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {denominations.map(({ slug, name }) => (
                        <Link
                          key={slug}
                          href={`/find/${encodeURIComponent(city.toLowerCase())}/${slug}`}
                          className="inline-block bg-white border border-sage/40 text-deep-green text-sm px-3 py-1.5 rounded-full hover:bg-sage/20 transition-colors"
                        >
                          {name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No denomination information available.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No cities found.</p>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
