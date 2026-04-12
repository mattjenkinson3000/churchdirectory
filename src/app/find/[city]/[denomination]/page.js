import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

const SITE_URL = 'https://findmychurch.co.nz'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** "new plymouth" → "New Plymouth" */
function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

function StarRating({ rating, count }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span
        className="text-amber-400 tracking-tight"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      </span>
      <span className="text-gray-600">{rating.toFixed(1)}</span>
      {count != null && (
        <span className="text-gray-400 text-xs">({count.toLocaleString()})</span>
      )}
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

async function getDenomination(slug) {
  const { data } = await supabase
    .from('denominations')
    .select('id, name, slug, short_description')
    .eq('slug', slug)
    .single()
  return data ?? null
}

async function getChurches(cityParam, denominationId) {
  const { data, error } = await supabase
    .from('churches')
    .select(`
      id, name, slug, address, suburb, city,
      sunday_service_time, website,
      google_rating, google_review_count, photo_url
    `)
    .eq('is_active', true)
    .ilike('city', cityParam)
    .eq('denomination_id', denominationId)
    .order('google_rating', { ascending: false, nullsFirst: false })
  if (error) console.error('getChurches error:', error)
  return data ?? []
}

async function getRelatedDenominations(cityParam, excludeId) {
  const { data } = await supabase
    .from('churches')
    .select('denomination_id, denominations(id, name, slug)')
    .eq('is_active', true)
    .ilike('city', cityParam)
    .not('denomination_id', 'is', null)
  if (!data) return []
  const seen = new Set()
  const out = []
  for (const row of data) {
    const d = row.denominations
    if (!d || d.id === excludeId || seen.has(d.id)) continue
    seen.add(d.id)
    out.push(d)
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

async function getRelatedCities(denominationId, excludeCity) {
  const { data } = await supabase
    .from('churches')
    .select('city')
    .eq('is_active', true)
    .eq('denomination_id', denominationId)
    .not('city', 'is', null)
  if (!data) return []
  const lower = excludeCity.toLowerCase()
  return [...new Set(data.map((r) => r.city).filter(Boolean))]
    .filter((c) => c.toLowerCase() !== lower)
    .sort()
}

// ─── generateStaticParams ────────────────────────────────────────────────────

export async function generateStaticParams() {
  const { data } = await supabase
    .from('churches')
    .select('city, denominations(slug)')
    .eq('is_active', true)
    .not('city', 'is', null)
    .not('denomination_id', 'is', null)
    .limit(5000)

  if (!data) return []

  const seen = new Set()
  const params = []
  for (const row of data) {
    const slug = row.denominations?.slug
    const city = row.city
    if (!slug || !city) continue
    const key = `${city.toLowerCase()}|${slug}`
    if (!seen.has(key)) {
      seen.add(key)
      params.push({ city: city.toLowerCase(), denomination: slug })
    }
  }
  return params
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { city, denomination } = await params
  const cityDisplay = titleCase(city)

  const denom = await getDenomination(denomination)
  if (!denom) return { title: 'Churches | FindMyChurch NZ' }

  const { count } = await supabase
    .from('churches')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)
    .ilike('city', city)
    .eq('denomination_id', denom.id)

  const title = `${denom.name} Churches in ${cityDisplay} | FindMyChurch NZ`
  const description = `Find ${denom.name.toLowerCase()} churches in ${cityDisplay}, New Zealand. Browse ${count ?? 0} churches with addresses, service times and contact details.`

  return {
    title,
    description,
    alternates: { canonical: `/find/${city}/${denomination}` },
    openGraph: {
      title,
      description,
      url: `/find/${city}/${denomination}`,
      type: 'website',
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CityDenominationPage({ params }) {
  const { city, denomination } = await params
  const cityDisplay = titleCase(city)

  const denom = await getDenomination(denomination)
  if (!denom) notFound()

  const [churches, relatedDenoms, relatedCities] = await Promise.all([
    getChurches(city, denom.id),
    getRelatedDenominations(city, denom.id),
    getRelatedCities(denom.id, city),
  ])

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Churches', item: `${SITE_URL}/churches` },
        {
          '@type': 'ListItem',
          position: 3,
          name: cityDisplay,
          item: `${SITE_URL}/search?q=${encodeURIComponent(cityDisplay)}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: `${denom.name} Churches`,
          item: `${SITE_URL}/find/${city}/${denomination}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${denom.name} Churches in ${cityDisplay}, New Zealand`,
      url: `${SITE_URL}/find/${city}/${denomination}`,
      numberOfItems: churches.length,
      itemListElement: churches.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        url: `${SITE_URL}/churches/${c.slug}`,
      })),
    },
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="bg-off-white min-h-screen">

        {/* ── Header ── */}
        <section className="bg-deep-green text-white py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-sage text-sm mb-5 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/churches" className="hover:text-white transition-colors">Churches</Link>
              <span aria-hidden="true">/</span>
              <Link
                href={`/search?q=${encodeURIComponent(cityDisplay)}`}
                className="hover:text-white transition-colors"
              >
                {cityDisplay}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">{denom.name}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {denom.name} Churches in {cityDisplay}
            </h1>
            <p className="text-sage text-sm mt-2">
              {churches.length} {churches.length === 1 ? 'church' : 'churches'} listed
            </p>

            {denom.short_description && (
              <p className="mt-4 text-white/80 text-base max-w-2xl leading-relaxed">
                {denom.short_description} Find a {denom.name} church in {cityDisplay} below.
              </p>
            )}
          </div>
        </section>

        {/* ── Church grid ── */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {churches.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-sage/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#A7C4A0"
                  className="w-12 h-12 mx-auto mb-4"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <p className="text-gray-600 text-lg font-medium">
                  No {denom.name} churches listed in {cityDisplay} yet — we&apos;re always adding more.
                </p>
                <Link
                  href="/churches"
                  className="mt-6 inline-flex items-center gap-1.5 text-deep-green text-sm font-medium hover:underline"
                >
                  Browse all churches
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {churches.map((c) => {
                  const location = [c.suburb, c.city].filter(Boolean).join(', ')
                  return (
                    <article
                      key={c.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      {/* Photo */}
                      <div className="relative h-44 bg-sage/20">
                        {c.photo_url ? (
                          <Image
                            src={c.photo_url}
                            alt={`Photo of ${c.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1"
                              stroke="#2F5D50"
                              className="w-14 h-14 opacity-20"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-5">
                        <Link
                          href={`/churches/${c.slug}`}
                          className="block text-deep-green font-semibold text-lg hover:underline leading-snug mb-2"
                        >
                          {c.name}
                        </Link>

                        {location && (
                          <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            {location}
                          </p>
                        )}

                        {c.address && (
                          <p className="text-gray-400 text-xs mb-2 pl-5">{c.address}</p>
                        )}

                        {c.sunday_service_time && (
                          <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Sunday {c.sunday_service_time}
                          </p>
                        )}

                        {c.google_rating != null && (
                          <div className="mb-3">
                            <StarRating rating={c.google_rating} count={c.google_review_count} />
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2 border-t border-sage/20">
                          <Link
                            href={`/churches/${c.slug}`}
                            className="inline-flex items-center gap-1 text-deep-green text-sm font-medium hover:underline"
                          >
                            View details
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </Link>

                          {c.website && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-sm text-deep-green bg-sage/30 hover:bg-sage/50 px-3 py-1 rounded-full transition-colors"
                            >
                              Visit website
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── More searches ── */}
        {(relatedDenoms.length > 0 || relatedCities.length > 0) && (
          <section className="pb-16 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto bg-sage/20 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-deep-green mb-6">More searches</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedDenoms.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-deep-green/60 uppercase tracking-widest mb-3">
                      Other denominations in {cityDisplay}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedDenoms.map((d) => (
                        <Link
                          key={d.id}
                          href={`/find/${city}/${d.slug}`}
                          className="inline-block bg-white border border-sage/40 text-deep-green text-sm px-3 py-1.5 rounded-full hover:bg-sage/20 transition-colors"
                        >
                          {d.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {relatedCities.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-deep-green/60 uppercase tracking-widest mb-3">
                      {denom.name} churches in other cities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedCities.slice(0, 12).map((relCity) => (
                        <Link
                          key={relCity}
                          href={`/find/${relCity.toLowerCase()}/${denomination}`}
                          className="inline-block bg-white border border-sage/40 text-deep-green text-sm px-3 py-1.5 rounded-full hover:bg-sage/20 transition-colors"
                        >
                          {relCity}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  )
}
