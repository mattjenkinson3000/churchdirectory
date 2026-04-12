import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const SITE_URL = 'https://findmychurch.co.nz'
const RESULT_LIMIT = 24

// Popular NZ cities for internal linking
const POPULAR_CITIES = ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin']

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }) {
  const { q, denomination: denominationSlug } = await searchParams
  const query = q?.trim() ?? ''

  let denominationName = null
  if (denominationSlug) {
    const { data } = await supabase
      .from('denominations')
      .select('name')
      .eq('slug', denominationSlug)
      .single()
    denominationName = data?.name ?? null
  }

  if (!query && !denominationName) {
    return {
      title: 'Search Churches in New Zealand | FindMyChurch NZ',
      description:
        'Search for churches across Aotearoa New Zealand by location and denomination. Find Catholic, Anglican, Baptist, Presbyterian and more.',
      robots: { index: false, follow: true },
    }
  }

  let title, description
  if (denominationName && query) {
    title = `${denominationName} Churches in ${query}, New Zealand | FindMyChurch NZ`
    description = `Find ${denominationName} churches in ${query}, New Zealand. Browse local ${denominationName.toLowerCase()} church listings with service times, contact details and directions.`
  } else if (query) {
    title = `Churches in ${query}, New Zealand | FindMyChurch NZ`
    description = `Find churches in ${query}, New Zealand. Browse local church listings across all denominations — Catholic, Anglican, Baptist, Presbyterian and more.`
  } else {
    title = `${denominationName} Churches in New Zealand | FindMyChurch NZ`
    description = `Find ${denominationName} churches across New Zealand. Browse ${denominationName.toLowerCase()} church listings with service times, contact details and directions.`
  }

  const qsParams = new URLSearchParams()
  if (query) qsParams.set('q', query)
  if (denominationSlug) qsParams.set('denomination', denominationSlug)
  const canonicalUrl = `/search?${qsParams.toString()}`

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// Priority score for sorting: exact city > partial city > suburb > name
function matchScore(church, lowerQuery) {
  if (church.city?.toLowerCase() === lowerQuery) return 3
  if (church.city?.toLowerCase().includes(lowerQuery)) return 2
  if (church.suburb?.toLowerCase().includes(lowerQuery)) return 1
  return 0 // name match
}

async function searchChurches(query, denominationSlug) {
  let denominationId = null
  if (denominationSlug) {
    const { data: denom } = await supabase
      .from('denominations')
      .select('id')
      .eq('slug', denominationSlug)
      .single()
    denominationId = denom?.id ?? null
  }

  let dbQuery = supabase
    .from('churches')
    .select(`
      id,
      name,
      slug,
      address,
      suburb,
      city,
      sunday_service_time,
      photo_url,
      denominations ( name, slug )
    `)
    .eq('is_active', true)
    .limit(RESULT_LIMIT + 1) // fetch one extra to detect overflow

  if (query) {
    // No address field — avoids "Wellington Street" appearing in Wellington city searches
    dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%,suburb.ilike.%${query}%`)
  }

  if (denominationId) {
    dbQuery = dbQuery.eq('denomination_id', denominationId)
  }

  const { data, error } = await dbQuery
  if (error) console.error('Search error:', error)

  const results = data ?? []
  if (!query) return results

  // Sort: city matches first, then suburb, then name — within each tier sort alphabetically
  const lower = query.toLowerCase()
  return results.sort((a, b) => {
    const diff = matchScore(b, lower) - matchScore(a, lower)
    if (diff !== 0) return diff
    return (a.city ?? '').localeCompare(b.city ?? '') || a.name.localeCompare(b.name)
  })
}

async function getDenominations() {
  const { data } = await supabase
    .from('denominations')
    .select('id, name, slug')
    .order('name')
  return data ?? []
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildJsonLd({ query, denominationName, denominationSlug, churches, hasMore }) {
  const qsParams = new URLSearchParams()
  if (query) qsParams.set('q', query)
  if (denominationSlug) qsParams.set('denomination', denominationSlug)
  const searchUrl = `${SITE_URL}/search${qsParams.toString() ? `?${qsParams.toString()}` : ''}`

  const pageTitle =
    denominationName && query
      ? `${denominationName} Churches in ${query}, New Zealand`
      : query
      ? `Churches in ${query}, New Zealand`
      : denominationName
      ? `${denominationName} Churches in New Zealand`
      : 'Church Search — New Zealand'

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Search', item: `${SITE_URL}/search` },
    ...(query
      ? [{ '@type': 'ListItem', position: 3, name: query, item: searchUrl }]
      : []),
  ]

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: pageTitle,
      url: searchUrl,
      description: `${churches.length}${hasMore ? '+' : ''} church${churches.length === 1 ? '' : 'es'} found${query ? ` in ${query}` : ''}${denominationName ? ` (${denominationName})` : ''} on FindMyChurch NZ`,
    },
  ]

  if (churches.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: pageTitle,
      numberOfItems: churches.length,
      itemListElement: churches.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        url: `${SITE_URL}/churches/${c.slug}`,
      })),
    })
  }

  return schemas
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }) {
  const { q, denomination: denominationSlug } = await searchParams
  const query = q?.trim() ?? ''
  const hasQuery = query || denominationSlug

  const [allChurches, denominations] = await Promise.all([
    hasQuery ? searchChurches(query, denominationSlug) : Promise.resolve([]),
    getDenominations(),
  ])

  const hasMore = allChurches.length > RESULT_LIMIT
  const churches = hasMore ? allChurches.slice(0, RESULT_LIMIT) : allChurches
  const activeDenomination = denominations.find((d) => d.slug === denominationSlug)

  // Build h1
  const h1 =
    activeDenomination && query
      ? `${activeDenomination.name} Churches in ${query}, New Zealand`
      : query
      ? `Churches in ${query}, New Zealand`
      : activeDenomination
      ? `${activeDenomination.name} Churches in New Zealand`
      : 'Find a Church Near You'

  // Build contextual intro paragraph
  let introParagraph = null
  if (hasQuery && churches.length > 0) {
    const count = `${churches.length}${hasMore ? '+' : ''}`
    const plural = churches.length === 1 ? 'church' : 'churches'
    if (activeDenomination && query) {
      introParagraph = `Showing ${count} ${activeDenomination.name} ${plural} in and around ${query}. Each listing includes contact details, service times and directions.`
    } else if (query) {
      introParagraph = `Showing ${count} ${plural} in and around ${query} across all denominations. Click any listing to see full details, service times and a map.`
    } else {
      introParagraph = `Showing ${count} ${activeDenomination.name} ${plural} across Aotearoa New Zealand.`
    }
  }

  const jsonLd = buildJsonLd({
    query,
    denominationName: activeDenomination?.name,
    denominationSlug,
    churches,
    hasMore,
  })

  return (
    <main>
      {/* JSON-LD */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Search header ── */}
      <section className="bg-deep-green text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sage text-sm mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            {query ? (
              <>
                <Link href="/search" className="hover:text-white transition-colors">Search</Link>
                <span aria-hidden="true">/</span>
                <span className="text-white">{query}</span>
              </>
            ) : (
              <span className="text-white">Search</span>
            )}
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-6">{h1}</h1>

          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3">
            <label className="sr-only" htmlFor="search-q">Town or city</label>
            <input
              id="search-q"
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Enter your town or city"
              className="flex-1 border border-sage/40 rounded-md px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage bg-white"
            />
            <label className="sr-only" htmlFor="search-denomination">Denomination</label>
            <select
              id="search-denomination"
              name="denomination"
              defaultValue={denominationSlug ?? ''}
              className="sm:w-52 border border-sage/40 rounded-md px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sage bg-white"
            >
              <option value="">All Denominations</option>
              {denominations.map((d) => (
                <option key={d.id} value={d.slug}>{d.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-sage text-deep-green px-6 py-3 rounded-md text-sm font-semibold hover:bg-sage/80 transition-colors whitespace-nowrap"
            >
              Search Churches
            </button>
          </form>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {!hasQuery ? (
            /* ── No search entered yet ── */
            <>
              <p className="text-gray-600 text-base mb-8">
                Enter a town or city above to find churches near you, or browse popular locations and denominations below.
              </p>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-deep-green mb-3">Search churches by city</h2>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.map((city) => (
                    <Link
                      key={city}
                      href={`/search?q=${encodeURIComponent(city)}`}
                      className="inline-block border border-sage/50 text-deep-green text-sm px-4 py-2 rounded-full hover:bg-sage/20 transition-colors"
                    >
                      Churches in {city}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-deep-green mb-3">Browse by denomination</h2>
                <div className="flex flex-wrap gap-2">
                  {denominations.map((d) => (
                    <Link
                      key={d.id}
                      href={`/denominations/${d.slug}`}
                      className="inline-block border border-sage/50 text-deep-green text-sm px-4 py-2 rounded-full hover:bg-sage/20 transition-colors"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>

          ) : churches.length > 0 ? (
            /* ── Results ── */
            <>
              {introParagraph && (
                <p className="text-gray-600 text-sm mb-5">{introParagraph}</p>
              )}

              {/* Denomination filter pills — only when no denomination active */}
              {query && !activeDenomination && (
                <div className="mb-6 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500">Filter by denomination:</span>
                  {denominations.slice(0, 8).map((d) => (
                    <Link
                      key={d.id}
                      href={`/search?q=${encodeURIComponent(query)}&denomination=${d.slug}`}
                      className="inline-block border border-sage/40 text-deep-green text-xs px-3 py-1.5 rounded-full hover:bg-sage/20 transition-colors"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Active denomination — link to detail page + clear */}
              {activeDenomination && (
                <div className="mb-5 flex items-center gap-3 text-sm">
                  <span className="text-gray-500">Denomination:</span>
                  <Link
                    href={`/denominations/${activeDenomination.slug}`}
                    className="font-medium text-deep-green hover:underline"
                  >
                    {activeDenomination.name} →
                  </Link>
                  <Link
                    href={query ? `/search?q=${encodeURIComponent(query)}` : '/search'}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    Clear filter
                  </Link>
                </div>
              )}

              {/* Results grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {churches.map((c) => {
                  const cDenomName = c.denominations?.name
                  const cDenomSlug = c.denominations?.slug
                  const location = [c.suburb, c.city].filter(Boolean).join(', ')

                  return (
                    <Link
                      key={c.id}
                      href={`/churches/${c.slug}`}
                      className="group block bg-white border border-sage/40 rounded-xl overflow-hidden hover:border-deep-green/50 hover:shadow-md transition-all"
                    >
                      {/* Photo banner */}
                      <div className="relative h-36 bg-sage/30">
                        {c.photo_url ? (
                          <Image
                            src={c.photo_url}
                            alt={`Photo of ${c.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="#A7C4A0" className="w-12 h-12 opacity-60">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                        )}
                        {cDenomName && (
                          <span className="absolute bottom-2 left-2 inline-block text-xs font-medium text-deep-green bg-white/90 border border-sage/30 px-2 py-0.5 rounded-full">
                            {cDenomName}
                          </span>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-5">
                        <h2 className="font-semibold text-deep-green text-base group-hover:underline leading-snug mb-2">
                          {c.name}
                        </h2>

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
                          <p className="text-gray-500 text-sm flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Sunday {c.sunday_service_time}
                          </p>
                        )}

                        <span className="mt-3 inline-flex items-center gap-1 text-deep-green text-xs font-medium">
                          View {c.name} details
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Overflow notice */}
              {hasMore && (
                <p className="mt-6 text-center text-sm text-gray-500">
                  Showing the first {RESULT_LIMIT} results. Try a more specific suburb or use the denomination filter to narrow your search.
                </p>
              )}

              {/* Related city links */}
              {query && (
                <div className="mt-10 pt-8 border-t border-sage/30">
                  <h2 className="text-base font-semibold text-deep-green mb-3">Search churches in other New Zealand cities</h2>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CITIES.filter((c) => c.toLowerCase() !== query.toLowerCase()).map((city) => (
                      <Link
                        key={city}
                        href={`/search?q=${encodeURIComponent(city)}${denominationSlug ? `&denomination=${denominationSlug}` : ''}`}
                        className="inline-block border border-sage/40 text-deep-green text-sm px-3 py-1.5 rounded-full hover:bg-sage/20 transition-colors"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>

          ) : (
            /* ── No results ── */
            <>
              <div className="bg-white border border-sage/30 rounded-xl p-8 text-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#A7C4A0" className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <h2 className="font-semibold text-gray-800 text-lg mb-2">
                  No churches found near &ldquo;{query || activeDenomination?.name}&rdquo;
                </h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  We couldn&apos;t find any{activeDenomination ? ` ${activeDenomination.name}` : ''} churches matching that location. Try a nearby city, or browse all denominations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/denominations"
                    className="inline-flex items-center justify-center gap-2 bg-deep-green text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-deep-green/90 transition-colors"
                  >
                    Browse all denominations
                  </Link>
                  <Link
                    href="/churches"
                    className="inline-flex items-center justify-center gap-2 border border-deep-green/30 text-deep-green px-5 py-2.5 rounded-md text-sm font-medium hover:bg-sage/10 transition-colors"
                  >
                    See all listed churches
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold text-deep-green mb-3">Try searching a nearby city</h2>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.map((city) => (
                    <Link
                      key={city}
                      href={`/search?q=${encodeURIComponent(city)}${denominationSlug ? `&denomination=${denominationSlug}` : ''}`}
                      className="inline-block border border-sage/40 text-deep-green text-sm px-3 py-1.5 rounded-full hover:bg-sage/20 transition-colors"
                    >
                      Churches in {city}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
