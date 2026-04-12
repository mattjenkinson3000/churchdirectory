import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

async function getDenomination(slug) {
  const { data, error } = await supabase
    .from('denominations')
    .select('id, name, slug, short_description, full_description')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('denominations')
    .select('slug')

  return (data ?? []).map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const denomination = await getDenomination(slug)

  if (!denomination) {
    return { title: 'Denomination Not Found | FindMyChurch NZ' }
  }

  const { name, short_description } = denomination
  const title = `${name} Churches in New Zealand | FindMyChurch NZ`
  const description = `Find ${name} churches near you in New Zealand. ${short_description ?? ''} Search by location and find your local ${name} church today.`.trim()

  return {
    title,
    description,
    alternates: {
      canonical: `/denominations/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/denominations/${slug}`,
      type: 'website',
    },
    twitter: {
      title,
      description,
    },
  }
}

export default async function DenominationPage({ params }) {
  const { slug } = await params
  const denomination = await getDenomination(slug)

  if (!denomination) notFound()

  const { id: denominationId, name, short_description, full_description } = denomination

  // Distinct cities for this denomination
  const { data: cityRows } = await supabase
    .from('churches')
    .select('city')
    .eq('is_active', true)
    .eq('denomination_id', denominationId)
    .not('city', 'is', null)

  const cities = [...new Set((cityRows ?? []).map((r) => r.city).filter(Boolean))].sort()

  const faqs = [
    {
      question: `What is the ${name} church?`,
      answer:
        short_description ??
        `The ${name} church is a Christian denomination with its own distinct history, beliefs, and style of worship. Each local congregation has its own community and character.`,
    },
    {
      question: `Where can I find ${name} churches in New Zealand?`,
      answer: `FindMyChurch NZ lists ${name} churches across Aotearoa. Use the search above to find a ${name} church near you by entering your town or city.`,
    },
    {
      question: `What can I expect at a ${name} service?`,
      answer: `${name} churches in New Zealand warmly welcome visitors. You can expect a service that reflects the ${name} tradition, along with a friendly community. Many churches offer morning and evening services — check the individual church listing for times.`,
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
            name: 'Denominations',
            item: 'https://findmychurch.co.nz/denominations',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: `https://findmychurch.co.nz/denominations/${slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `https://findmychurch.co.nz/denominations/${slug}`,
        name: `${name} Churches in New Zealand`,
        description: `Find ${name} churches near you in New Zealand. ${short_description ?? ''}`.trim(),
        url: `https://findmychurch.co.nz/denominations/${slug}`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'FindMyChurch NZ',
          url: 'https://findmychurch.co.nz',
        },
        about: {
          '@type': 'Organization',
          name,
          additionalType: 'https://schema.org/ReligiousOrganization',
        },
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
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-sage text-sm mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/denominations" className="hover:text-white transition-colors">Denominations</Link>
              <span>/</span>
              <span className="text-white">{name}</span>
            </nav>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{name}</h1>
            {short_description && (
              <p className="text-sage text-lg max-w-2xl">{short_description}</p>
            )}
          </div>
        </section>

        {/* ── Search ── */}
        <section className="bg-warm-sand py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-deep-green mb-2">
              Find {name} churches near you
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Enter your town or city to find {name} churches in your area.
            </p>
            <form
              action="/search"
              method="GET"
              className="flex flex-col sm:flex-row gap-3"
            >
              <input type="hidden" name="denomination" value={slug} />
              <input
                type="text"
                name="q"
                placeholder="Enter your town or city"
                className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent bg-white"
              />
              <button
                type="submit"
                className="bg-deep-green text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-deep-green/90 transition-colors whitespace-nowrap"
              >
                Search {name} Churches
              </button>
            </form>
          </div>
        </section>

        {/* ── Full description ── */}
        {full_description && (
          <section className="py-16 px-4 sm:px-6 bg-white">
            <div className="max-w-3xl mx-auto prose prose-p:text-gray-600 prose-headings:text-deep-green prose-a:text-deep-green max-w-none">
              <h2 className="text-2xl font-bold text-deep-green mb-6">About {name}</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                {full_description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section className="py-16 px-4 sm:px-6 bg-off-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-deep-green mb-8">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
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

        {/* ── Find by city ── */}
        {cities.length > 0 && (
          <section className="py-12 px-4 sm:px-6 bg-white border-t border-sage/20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-deep-green mb-5">
                Find {name} Churches by City
              </h2>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/find/${city.toLowerCase()}/${slug}`}
                    className="inline-block bg-sage/20 border border-sage/40 text-deep-green text-sm font-medium px-4 py-2 rounded-full hover:bg-sage/40 transition-colors"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Back link ── */}
        <section className="py-10 px-4 sm:px-6 border-t border-sage/20">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/denominations"
              className="inline-flex items-center gap-2 text-deep-green text-sm font-medium hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to all denominations
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
