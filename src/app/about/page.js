import Link from 'next/link'

export const metadata = {
  title: 'About FindMyChurch NZ | Free Church Directory for Aotearoa',
  description:
    'FindMyChurch NZ is a free church directory listing over 1,500 churches across Aotearoa New Zealand. Learn about our mission to help Kiwis find a welcoming church community.',
  alternates: {
    canonical: 'https://findmychurch.co.nz/about',
  },
  openGraph: {
    title: 'About FindMyChurch NZ | Free Church Directory for Aotearoa',
    description:
      'FindMyChurch NZ is a free church directory listing over 1,500 churches across Aotearoa New Zealand. Learn about our mission to help Kiwis find a welcoming church community.',
    url: 'https://findmychurch.co.nz/about',
    type: 'website',
  },
}

const STATS = [
  { value: '1,500+', label: 'Churches listed across NZ' },
  { value: '11', label: 'Denominations covered' },
  { value: 'Free', label: 'Always free to search' },
  { value: '137+', label: 'City & denomination pages' },
]

const CITY_LINKS = [
  { href: '/find/auckland/baptist', label: 'Baptist Churches in Auckland' },
  { href: '/find/wellington/catholic', label: 'Catholic Churches in Wellington' },
  { href: '/find/christchurch/anglican', label: 'Anglican Churches in Christchurch' },
  { href: '/find/auckland/presbyterian', label: 'Presbyterian Churches in Auckland' },
  { href: '/find/hamilton/methodist', label: 'Methodist Churches in Hamilton' },
  { href: '/find/tauranga/pentecostal', label: 'Pentecostal Churches in Tauranga' },
  { href: '/find/dunedin/baptist', label: 'Baptist Churches in Dunedin' },
  { href: '/find/auckland/catholic', label: 'Catholic Churches in Auckland' },
  { href: '/find/wellington/anglican', label: 'Anglican Churches in Wellington' },
]

const FAQS = [
  {
    question: 'Is FindMyChurch NZ free to use?',
    answer:
      'Yes — FindMyChurch NZ is completely free for anyone searching for a church. There are no subscriptions, no sign-ups required, and no hidden costs.',
  },
  {
    question: 'How many churches are listed on FindMyChurch NZ?',
    answer:
      'We list over 1,500 churches across Aotearoa New Zealand, covering 11 Christian denominations in cities and towns from Northland to Southland.',
  },
  {
    question: 'Can I add my church to the directory?',
    answer:
      'Yes — adding your church is free. Use our Add Your Church form and your listing will be reviewed and published within 2-3 business days.',
  },
  {
    question: 'What denominations does FindMyChurch NZ cover?',
    answer:
      'We cover Catholic, Anglican, Baptist, Presbyterian, Methodist, Pentecostal, Seventh-day Adventist, Lutheran, Eastern Orthodox, Evangelical/Charismatic and Non-denominational churches.',
  },
  {
    question: 'How do I find churches near me?',
    answer:
      "Use the search bar on the homepage and click \"Use my location\" — we'll show you the nearest churches with distance information. You can also search by city or suburb.",
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FindMyChurch NZ',
    url: 'https://findmychurch.co.nz',
    logo: 'https://findmychurch.co.nz/logo.png',
    description: 'Free church directory listing over 1,500 churches across Aotearoa New Zealand',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'matt.jenkinson@findmychurch.co.nz',
      contactType: 'customer support',
    },
    areaServed: 'NZ',
    knowsAbout: [
      'Christian churches',
      'Church directory',
      'New Zealand churches',
      'Aotearoa churches',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  },
]

export default function AboutPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main>
        {/* ── Header ── */}
        <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">About FindMyChurch NZ</h1>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="bg-white border-b border-sage/20 px-4 sm:px-6 py-10">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-deep-green mb-1">{value}</div>
                <div className="mx-auto mb-2 h-0.5 w-8 rounded-full bg-sage" />
                <div className="text-gray-500 text-xs leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main content ── */}
        <section className="py-16 px-4 sm:px-6 bg-off-white">
          <div className="max-w-3xl mx-auto space-y-10">

            {/* Our Mission */}
            <div>
              <h2 className="text-xl font-bold text-deep-green mb-3">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                FindMyChurch NZ exists for one reason: to make it easier for Kiwis to find a
                welcoming church community. Whether you&apos;re exploring Christianity for the first
                time, you&apos;ve just moved to a new city, or you&apos;re simply looking for a fresh
                start in your faith journey — this directory is for you. We believe every person in
                Aotearoa deserves to find a place where they belong, and we&apos;ve built the tools to
                help make that happen.
              </p>
            </div>

            {/* What We Do */}
            <div className="border-t border-sage/20 pt-10">
              <h2 className="text-xl font-bold text-deep-green mb-3">What We Do</h2>
              <p className="text-gray-600 leading-relaxed">
                We maintain a free, searchable directory of over 1,500 churches across Aotearoa New
                Zealand — from Auckland and Wellington to Christchurch, Hamilton, Tauranga, Dunedin
                and beyond. Every listing includes the church&apos;s address, denomination, service
                times and contact details where available. You can search by city, suburb or
                denomination, and if you share your location we&apos;ll show you the nearest churches
                with distance information. We cover 11 Christian denominations including Catholic,
                Anglican, Baptist, Presbyterian, Methodist, Pentecostal and more.
              </p>
            </div>

            {/* Why We Built This */}
            <div className="border-t border-sage/20 pt-10">
              <h2 className="text-xl font-bold text-deep-green mb-3">Why We Built This</h2>
              <p className="text-gray-600 leading-relaxed">
                Finding a church can feel surprisingly hard — especially when you&apos;re new to a
                city, new to faith, or simply not sure where to start. We searched for a simple,
                up-to-date New Zealand church directory and couldn&apos;t find one that worked well.
                So we built it. FindMyChurch NZ is built and maintained by a Kiwi, for Kiwis —
                with the goal of connecting people to church communities right across Aotearoa.
                We&apos;re not affiliated with any denomination or church organisation. We simply want
                to help people find their people.
              </p>
            </div>

            {/* Is Your Church Listed? */}
            <div className="border-t border-sage/20 pt-10">
              <h2 className="text-xl font-bold text-deep-green mb-3">Is Your Church Listed?</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                We list over 1,500 churches across New Zealand, but we know our directory isn&apos;t
                complete. If your church isn&apos;t listed yet — or if your details have changed —
                you can submit or update your listing for free. All submissions are reviewed by our
                team before going live. We want every listing to be accurate and helpful for people
                searching in your area.
              </p>
              <Link
                href="/add-church"
                className="inline-block bg-warm-sand text-deep-green font-semibold text-sm px-5 py-3 rounded-lg hover:bg-warm-sand/80 transition-colors"
              >
                Add Your Church — it&apos;s free
              </Link>
            </div>

            {/* Churches Across Aotearoa */}
            <div className="border-t border-sage/20 pt-10">
              <h2 className="text-xl font-bold text-deep-green mb-3">Churches Across Aotearoa</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                FindMyChurch NZ covers churches in cities and towns across New Zealand. Here are
                some of the most searched locations:
              </p>
              <div className="flex flex-wrap gap-2">
                {CITY_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="inline-block bg-sage/20 border border-sage/40 text-deep-green text-sm font-medium px-4 py-2 rounded-full hover:bg-sage/40 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Explore the Directory */}
            <div className="border-t border-sage/20 pt-10">
              <h2 className="text-xl font-bold text-deep-green mb-4">Explore the Directory</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/denominations" className="text-deep-green text-sm font-medium hover:underline">
                  Browse all denominations →
                </Link>
                <Link href="/search" className="text-deep-green text-sm font-medium hover:underline">
                  Search for a church →
                </Link>
                <Link href="/resources" className="text-deep-green text-sm font-medium hover:underline">
                  Faith resources →
                </Link>
              </div>
            </div>

            {/* Get in Touch */}
            <div className="border-t border-sage/20 pt-10">
              <h2 className="text-xl font-bold text-deep-green mb-3">Get in Touch</h2>
              <p className="text-gray-600 leading-relaxed">
                Have a question, spotted an error, or want to get in touch? Email us at{' '}
                <a
                  href="mailto:matt.jenkinson@findmychurch.co.nz"
                  className="text-deep-green underline hover:no-underline"
                >
                  matt.jenkinson@findmychurch.co.nz
                </a>
              </p>
            </div>

          </div>
        </section>
      </main>
    </>
  )
}
