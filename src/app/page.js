import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: denominations, error } = await supabase
    .from('denominations')
    .select('id, name, short_description')
    .order('name')

  if (error) console.error('Database error:', error)

  return (
    <main>
      {/* ── Hero ── */}
      <section className="min-h-[75vh] grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-16 bg-off-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-deep-green leading-tight">
            Find a church near you in Aotearoa
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-gray-600 max-w-md">
            Connecting you to welcoming churches across New Zealand
          </p>
          <p className="mt-4 text-base italic text-sage font-medium">
            Come as you are. There&apos;s a place for you.
          </p>
        </div>
        <div className="bg-sage min-h-[280px] md:min-h-0" aria-hidden="true" />
      </section>

      {/* ── Search bar ── */}
      <section className="bg-white py-10 border-b border-sage/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <form
            action="/churches"
            method="GET"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              name="location"
              placeholder="Enter your town or city"
              className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent"
            />
            <select
              name="denomination"
              className="sm:w-52 border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent bg-white"
            >
              <option value="">All Denominations</option>
              {denominations?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-deep-green text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-deep-green/90 transition-colors whitespace-nowrap"
            >
              Search Churches
            </button>
          </form>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              ),
              title: 'Explore Churches',
              body: 'Browse churches across New Zealand by location, style, and community.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              ),
              title: 'Service Times',
              body: 'Find Sunday services, midweek gatherings, and special events near you.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              ),
              title: 'Denomination Guides',
              body: 'Understand the beliefs, traditions, and communities of different denominations.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-sage/30 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-deep-green mb-4">{card.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Denomination grid ── */}
      <section className="bg-white py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-deep-green mb-2">Denominations</h2>
          <p className="text-gray-500 mb-10">Explore the traditions and communities across Aotearoa</p>

          {denominations && denominations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {denominations.map((d) => (
                <div
                  key={d.id}
                  className="border border-sage/40 rounded-xl p-5 hover:border-deep-green/40 hover:shadow-sm transition-all bg-off-white"
                >
                  <h3 className="font-semibold text-deep-green text-base mb-1">{d.name}</h3>
                  {d.short_description && (
                    <p className="text-gray-500 text-sm leading-relaxed">{d.short_description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No denominations found.</p>
          )}
        </div>
      </section>

      {/* ── Why section ── */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-deep-green mb-2">Why FindMyChurch?</h2>
        <p className="text-gray-500 mb-10">Built for Kiwis, by people who care</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              ),
              title: 'Welcoming',
              body: 'Every listing is chosen with warmth in mind — churches that open their doors to all.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              ),
              title: 'Local',
              body: 'Focused on your town, your suburb, your community across Aotearoa.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              ),
              title: 'Trusted',
              body: 'Real churches, real communities, right across Aotearoa.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ),
              title: 'Growing',
              body: 'New churches added regularly as our network expands across New Zealand.',
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              {item.icon}
              <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA section ── */}
      <section className="bg-warm-sand py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-deep-green mb-4">You&apos;re not alone</h2>
          <p className="text-gray-700 text-lg mb-8">
            Thousands of Kiwis are finding community, belonging, and hope through local churches. Let us help you find yours.
          </p>
          <a
            href="/churches"
            className="inline-block bg-deep-green text-white px-8 py-4 rounded-md font-semibold text-base hover:bg-deep-green/90 transition-colors"
          >
            Get started
          </a>
        </div>
      </section>
    </main>
  )
}
