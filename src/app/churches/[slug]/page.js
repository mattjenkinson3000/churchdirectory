import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import ChurchMap from './ChurchMap'
import ChurchPhoto from './ChurchPhoto'

async function getChurch(slug) {
  const { data, error } = await supabase
    .from('churches')
    .select(`
      id,
      name,
      slug,
      address,
      suburb,
      city,
      region,
      postcode,
      phone,
      website,
      sunday_service_time,
      other_service_times,
      youth_group,
      bible_study,
      kids_ministry,
      creche,
      other_gatherings,
      description,
      latitude,
      longitude,
      is_verified,
      photo_url,
      denominations ( name, slug )
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('churches')
    .select('slug')

  return (data ?? []).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const church = await getChurch(slug)

  if (!church) {
    return { title: 'Church Not Found | FindMyChurch NZ' }
  }

  const denominationName = church.denominations?.name ?? 'Christian'
  const suburb = church.suburb ?? ''
  const city = church.city ?? 'New Zealand'
  const sundayTime = church.sunday_service_time

  const title = `${church.name} - ${denominationName} Church in ${city} | FindMyChurch NZ`
  const descriptionParts = [
    `${church.name} is a ${denominationName} church in ${[suburb, city].filter(Boolean).join(', ')}, New Zealand.`,
    sundayTime ? `Sunday services at ${sundayTime}.` : null,
    'Get directions, contact details and service times.',
  ].filter(Boolean)
  const description = descriptionParts.join(' ')

  const keywords = [
    church.name,
    `${denominationName} church ${city}`,
    suburb ? `${denominationName} church ${suburb}` : null,
    `church in ${city} New Zealand`,
  ].filter(Boolean)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/churches/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/churches/${slug}`,
      type: 'website',
    },
    twitter: {
      title,
      description,
    },
  }
}

export default async function ChurchPage({ params }) {
  const { slug } = await params
  const church = await getChurch(slug)

  if (!church) notFound()

  const {
    name,
    address,
    suburb,
    city,
    region,
    postcode,
    phone,
    website,
    sunday_service_time,
    other_service_times,
    youth_group,
    bible_study,
    kids_ministry,
    creche,
    other_gatherings,
    description,
    latitude,
    longitude,
    is_verified,
    photo_url,
    denominations,
  } = church

  const denominationName = denominations?.name ?? 'Christian'
  const denominationSlug = denominations?.slug ?? null
  const fullAddress = [address, suburb, city].filter(Boolean).join(', ')

  const faqs = [
    {
      question: `What time is Sunday service at ${name}?`,
      answer: sunday_service_time
        ? `Sunday services at ${name} are held at ${sunday_service_time}. Please check with the church directly as times may vary on public holidays.`
        : `Please contact ${name} directly or visit their website for current Sunday service times.`,
    },
    {
      question: `Where is ${name} located?`,
      answer: fullAddress
        ? `${name} is located at ${fullAddress}. ${latitude && longitude ? 'Use the map on this page for directions.' : 'Contact the church for directions.'}`
        : `Please contact ${name} directly for their address and directions.`,
    },
    {
      question: `What denomination is ${name}?`,
      answer: `${name} is a ${denominationName} church${city ? ` in ${city}` : ''}.${denominationSlug ? ` You can learn more about the ${denominationName} denomination and find other ${denominationName} churches across New Zealand on our denomination page.` : ''}`,
    },
  ]

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
            name: city ?? 'New Zealand',
            item: `https://findmychurch.co.nz/churches#${encodeURIComponent(city ?? '')}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: `https://findmychurch.co.nz/churches/${slug}`,
          },
        ],
      },
      {
        '@type': 'Church',
        '@id': `https://findmychurch.co.nz/churches/${slug}`,
        name,
        description: description ?? undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: address ?? undefined,
          addressLocality: suburb ?? city ?? undefined,
          addressRegion: city ?? undefined,
          addressCountry: 'NZ',
        },
        ...(latitude && longitude
          ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } }
          : {}),
        telephone: phone ?? undefined,
        url: website ?? `https://findmychurch.co.nz/churches/${slug}`,
        ...(website ? { sameAs: website } : {}),
        ...(sunday_service_time ? { openingHours: `Su ${sunday_service_time}` } : {}),
        parentOrganization: {
          '@type': 'Organization',
          name: denominationName,
          ...(denominationSlug
            ? { url: `https://findmychurch.co.nz/denominations/${denominationSlug}` }
            : {}),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Hero ── */}
        <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="text-sage text-sm mb-4 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/churches" className="hover:text-white transition-colors">
                Churches in New Zealand
              </Link>
              {city && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link href={`/churches#${encodeURIComponent(city)}`} className="hover:text-white transition-colors">
                    {city}
                  </Link>
                </>
              )}
              <span aria-hidden="true">/</span>
              <span className="text-white">{name}</span>
            </nav>

            <h1 className="text-4xl sm:text-5xl font-bold mb-3">{name}</h1>

            <span className="inline-block bg-sage/20 text-sage border border-sage/40 text-sm font-medium px-3 py-1 rounded-full">
              {denominationName}
            </span>

            {fullAddress && (
              <p className="mt-4 text-sage/80 flex items-center gap-1.5 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {fullAddress}
              </p>
            )}
          </div>
        </section>

        {/* ── Photo banner ── */}
        <ChurchPhoto photoUrl={photo_url} name={name} />

        {/* ── Main content ── */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left column: description, service times, map */}
            <div className="lg:col-span-2 space-y-8">
              {description && (
                <div>
                  <h2 className="text-xl font-bold text-deep-green mb-3">About {name}</h2>
                  <div className="text-gray-600 leading-relaxed space-y-3">
                    {description.split('\n').filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {(sunday_service_time || other_service_times || youth_group || bible_study || kids_ministry || creche || other_gatherings) && (
                <div>
                  <h2 className="text-xl font-bold text-deep-green mb-3">Services &amp; Gatherings</h2>
                  <div className="bg-white border border-sage/30 rounded-xl p-5">
                    <ul className="space-y-2" aria-label={`Services and gatherings at ${name}`}>
                      {sunday_service_time && sunday_service_time.split(',').map((t) => t.trim()).filter(Boolean).map((time, i) => (
                        <li key={`sun-${i}`} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span><span className="font-medium text-gray-700">Sunday Services</span> — {time}</span>
                        </li>
                      ))}
                      {other_service_times && (
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span><span className="font-medium text-gray-700">Other Services</span> — {other_service_times}</span>
                        </li>
                      )}
                      {youth_group && (
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span><span className="font-medium text-gray-700">Youth Group</span> — {youth_group}</span>
                        </li>
                      )}
                      {bible_study && (
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span><span className="font-medium text-gray-700">Bible Study / Small Groups</span> — {bible_study}</span>
                        </li>
                      )}
                      {kids_ministry && (
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span><span className="font-medium text-gray-700">Kids &amp; Children&apos;s Ministry</span> — {kids_ministry}</span>
                        </li>
                      )}
                      {creche && (
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span><span className="font-medium text-gray-700">Crèche On-Site</span> — Yes</span>
                        </li>
                      )}
                      {other_gatherings && (
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span><span className="font-medium text-gray-700">Other Gatherings</span> — {other_gatherings}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Map */}
              <div>
                <h2 className="text-xl font-bold text-deep-green mb-3">
                  Location{fullAddress ? ` — ${fullAddress}` : ''}
                </h2>
                {latitude && longitude ? (
                  <ChurchMap
                    latitude={latitude}
                    longitude={longitude}
                    name={name}
                    address={fullAddress}
                  />
                ) : (
                  <div
                    className="bg-sage/20 border border-sage/40 rounded-xl h-56 flex flex-col items-center justify-center gap-2 text-deep-green/60"
                    role="img"
                    aria-label={`Map unavailable for ${name}${fullAddress ? `, ${fullAddress}` : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>
                    <p className="text-sm font-medium">Map not available</p>
                    {fullAddress && <p className="text-xs">{fullAddress}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Right column: contact sidebar */}
            <aside aria-label="Church contact details">
              <div className="bg-white border border-sage/30 rounded-xl p-5 space-y-4">
                <h2 className="font-bold text-deep-green text-base">Contact &amp; details</h2>

                {fullAddress && (
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span>{fullAddress}</span>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-5 h-5 shrink-0" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
                    </svg>
                    <a href={`tel:${phone}`} className="text-deep-green hover:underline">
                      Call {name}
                    </a>
                  </div>
                )}

                {website && (
                  <div className="flex items-center gap-3 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-5 h-5 shrink-0" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12a8.959 8.959 0 0 0 .284 2.253" />
                    </svg>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-deep-green hover:underline truncate"
                    >
                      Visit {name} website
                    </a>
                  </div>
                )}

                {denominationSlug && (
                  <div className="flex items-center gap-3 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-5 h-5 shrink-0" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <Link href={`/denominations/${denominationSlug}`} className="text-deep-green hover:underline">
                      About {denominationName} churches
                    </Link>
                  </div>
                )}
              </div>

              {denominationSlug && (
                <Link
                  href={`/denominations/${denominationSlug}`}
                  className="mt-4 block w-full text-center bg-off-white border border-deep-green/30 text-deep-green text-sm font-medium px-4 py-3 rounded-xl hover:bg-sage/20 transition-colors"
                >
                  Find more {denominationName} churches in New Zealand
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 inline ml-1.5 -mt-0.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              )}
            </aside>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-12 px-4 sm:px-6 bg-off-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-deep-green mb-8">
              Frequently asked questions about {name}
            </h2>
            <dl className="space-y-5">
              {faqs.map(({ question, answer }) => (
                <div
                  key={question}
                  className="border border-sage/40 rounded-xl p-6 bg-white"
                >
                  <dt className="font-semibold text-gray-900 mb-2">{question}</dt>
                  <dd className="text-gray-500 text-sm leading-relaxed">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Suggest an update ── */}
        <section className="py-8 px-4 sm:px-6 border-t border-sage/20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-sage/20 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Are you from this church? Suggest an update to keep your listing accurate.
              </p>
              <Link
                href={`/churches/${slug}/suggest-update`}
                className="inline-flex items-center gap-1.5 text-deep-green text-sm font-medium hover:underline shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
                Is something incorrect? Suggest an update
              </Link>
            </div>
          </div>
        </section>

        {/* ── Back link ── */}
        <section className="py-8 px-4 sm:px-6 border-t border-sage/20">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/churches"
              className="inline-flex items-center gap-2 text-deep-green text-sm font-medium hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Browse all churches in New Zealand
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
