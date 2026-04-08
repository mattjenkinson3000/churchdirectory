import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export async function generateMetadata({ searchParams }) {
  const { q, denomination } = await searchParams
  const query = q?.trim() ?? ''

  if (!query) {
    return {
      title: 'Search Churches | FindMyChurch NZ',
      description: 'Search for churches across Aotearoa New Zealand by location and denomination.',
      robots: { index: false, follow: true },
    }
  }

  return {
    title: `Churches in ${query} | FindMyChurch NZ`,
    description: `Find ${denomination ? `${denomination} ` : ''}churches in ${query}, New Zealand. Browse local church listings, service times and contact details.`,
    robots: { index: false, follow: true },
  }
}

async function searchChurches(query, denominationSlug) {
  // Resolve denomination slug → ID if provided
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
      denominations ( name, slug )
    `)
    .eq('is_active', true)
    .or(`city.ilike.%${query}%,suburb.ilike.%${query}%`)
    .order('city')
    .order('name')

  if (denominationId) {
    dbQuery = dbQuery.eq('denomination_id', denominationId)
  }

  const { data, error } = await dbQuery
  if (error) console.error('Search error:', error)
  return data ?? []
}

async function getDenominations() {
  const { data } = await supabase
    .from('denominations')
    .select('id, name, slug')
    .order('name')
  return data ?? []
}

export default async function SearchPage({ searchParams }) {
  const { q, denomination: denominationSlug } = await searchParams
  const query = q?.trim() ?? ''

  const [churches, denominations] = await Promise.all([
    query ? searchChurches(query, denominationSlug) : Promise.resolve([]),
    getDenominations(),
  ])

  const activeDenomination = denominations.find((d) => d.slug === denominationSlug)

  const resultHeading = query
    ? `${churches.length} ${churches.length === 1 ? 'church' : 'churches'} found${activeDenomination ? ` in the ${activeDenomination.name} denomination` : ''} near "${query}"`
    : 'Search for churches across Aotearoa'

  return (
    <main>
      {/* ── Search header ── */}
      <section className="bg-deep-green text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sage text-sm mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Search</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Find a church near you</h1>

          {/* Inline search form */}
          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Enter your town or city"
              className="flex-1 border border-sage/40 rounded-md px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage bg-white"
            />
            <select
              name="denomination"
              defaultValue={denominationSlug ?? ''}
              className="sm:w-52 border border-sage/40 rounded-md px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sage bg-white"
            >
              <option value="">All Denominations</option>
              {denominations.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name}
                </option>
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

          {/* Result count / status heading */}
          <h2 className="text-xl font-bold text-deep-green mb-6">{resultHeading}</h2>

          {!query ? (
            /* No search entered yet */
            <div className="text-center py-16 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#A7C4A0" className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p className="text-base">Enter a town or city above to find churches near you.</p>
            </div>
          ) : churches.length > 0 ? (
            /* Results grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {churches.map((c) => {
                const denominationName = c.denominations?.name
                const denominationSlug = c.denominations?.slug
                const location = [c.suburb, c.city].filter(Boolean).join(', ')

                return (
                  <Link
                    key={c.id}
                    href={`/churches/${c.slug}`}
                    className="group block bg-white border border-sage/40 rounded-xl p-5 hover:border-deep-green/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-deep-green text-base group-hover:underline leading-snug">
                        {c.name}
                      </h3>
                      {denominationName && (
                        <span className="shrink-0 inline-block text-xs font-medium text-deep-green/70 bg-sage/20 border border-sage/30 px-2 py-0.5 rounded-full">
                          {denominationName}
                        </span>
                      )}
                    </div>

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
                  </Link>
                )
              })}
            </div>
          ) : (
            /* No results state */
            <div className="bg-white border border-sage/30 rounded-xl p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#A7C4A0" className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                No churches found near &ldquo;{query}&rdquo;
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                We couldn&apos;t find any{activeDenomination ? ` ${activeDenomination.name}` : ''} churches matching that location. Try a nearby city or suburb, or browse by denomination below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/denominations"
                  className="inline-flex items-center justify-center gap-2 bg-deep-green text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-deep-green/90 transition-colors"
                >
                  Browse denominations
                </Link>
                <Link
                  href="/churches"
                  className="inline-flex items-center justify-center gap-2 border border-deep-green/30 text-deep-green px-5 py-2.5 rounded-md text-sm font-medium hover:bg-sage/10 transition-colors"
                >
                  See all listed churches
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
