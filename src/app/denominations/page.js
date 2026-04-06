import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export const metadata = {
  title: 'Christian Denominations in New Zealand | FindMyChurch NZ',
  description:
    'Explore Christian denominations across Aotearoa New Zealand. Learn about Catholic, Baptist, Anglican, Presbyterian and more. Find a church that\'s right for you.',
  alternates: {
    canonical: '/denominations',
  },
  openGraph: {
    title: 'Christian Denominations in New Zealand | FindMyChurch NZ',
    description:
      'Explore Christian denominations across Aotearoa New Zealand. Learn about Catholic, Baptist, Anglican, Presbyterian and more.',
    url: '/denominations',
    type: 'website',
  },
  twitter: {
    title: 'Christian Denominations in New Zealand | FindMyChurch NZ',
    description:
      'Explore Christian denominations across Aotearoa New Zealand. Find a church that\'s right for you.',
  },
}

export default async function DenominationsPage() {
  const { data: denominations, error } = await supabase
    .from('denominations')
    .select('id, name, short_description, slug')
    .order('name')

  if (error) console.error('Database error:', error)

  return (
    <main>
      {/* ── Header ── */}
      <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sage text-sm mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Denominations</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Christian Denominations in New Zealand
          </h1>
          <p className="text-sage text-lg max-w-2xl">
            Explore the diverse traditions of Christianity across Aotearoa. Each denomination has its own history, style, and community — find the one that feels like home.
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {denominations && denominations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {denominations.map((d) => (
                <Link
                  key={d.id}
                  href={`/denominations/${d.slug}`}
                  className="group block border border-sage/40 rounded-xl p-6 bg-white hover:border-deep-green/50 hover:shadow-md transition-all"
                >
                  <h2 className="font-semibold text-deep-green text-lg mb-2 group-hover:underline">
                    {d.name}
                  </h2>
                  {d.short_description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {d.short_description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-deep-green text-sm font-medium">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No denominations found.</p>
          )}
        </div>
      </section>
    </main>
  )
}
