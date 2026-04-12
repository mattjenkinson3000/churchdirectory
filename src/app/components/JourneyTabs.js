'use client'

import { useState } from 'react'
import Link from 'next/link'

const TABS = ['Exploring Faith', 'New to Faith', 'Finding a Church']

const CITIES = ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin']

function SearchBar({ placeholder = 'Enter your town or city' }) {
  return (
    <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-2 mt-1">
      <input
        type="text"
        name="q"
        placeholder={placeholder}
        aria-label="Search for churches by town or city"
        className="flex-1 border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-deep-green text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-deep-green/90 transition-colors whitespace-nowrap"
      >
        Search Churches
      </button>
    </form>
  )
}

function ExploringFaith() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-deep-green mb-3">Curious about Christianity?</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Whether you&apos;ve just started asking questions or you&apos;ve been wondering for a while, you&apos;re welcome here. Churches across Aotearoa are open to anyone who wants to explore.
      </p>

      <a
        href="https://alpha.org.nz"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-warm-sand text-deep-green font-semibold text-sm px-5 py-3 rounded-lg hover:bg-warm-sand/80 transition-colors mb-8"
      >
        What is the Alpha Course?
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>

      <div className="border-t border-sage/20 pt-6">
        <p className="text-sm text-gray-500 mb-3">Find a welcoming church near you — no experience required.</p>
        <SearchBar />
      </div>
    </div>
  )
}

function NewToFaith() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-deep-green mb-3">Welcome to the family.</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Taking that first step is huge. Finding the right church can make all the difference — a place where you&apos;ll be supported, encouraged and able to grow.
      </p>

      <div className="bg-off-white rounded-xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-deep-green mb-3">What to expect on your first visit</h3>
        <ul className="space-y-2">
          {[
            'Arrive a few minutes early',
            'Someone will welcome you at the door',
            'Services usually run 60–90 minutes',
            'No pressure to participate — just come as you are',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#A7C4A0" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-sage/20 pt-6">
        <SearchBar />
        <Link
          href="/denominations"
          className="inline-block mt-4 text-sm text-deep-green hover:underline"
        >
          Not sure which denomination is right for you? Learn about each tradition →
        </Link>
      </div>
    </div>
  )
}

function FindingChurch() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-deep-green mb-3">Find your next church home.</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Whether you&apos;ve moved to a new city or you&apos;re looking for a fresh start, Aotearoa has hundreds of great churches to explore.
      </p>

      <div className="mb-6">
        <p className="text-sm font-semibold text-deep-green mb-3">Browse by city</p>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <Link
              key={city}
              href={`/search?q=${encodeURIComponent(city)}`}
              className="inline-block bg-sage/20 border border-sage/40 text-deep-green text-sm font-medium px-4 py-2 rounded-full hover:bg-sage/40 transition-colors"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-sage/20 pt-6">
        <SearchBar placeholder="Or enter any town or city…" />
      </div>
    </div>
  )
}

export default function JourneyTabs() {
  const [active, setActive] = useState(0)

  return (
    <section className="bg-off-white py-14 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Your journey">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              aria-selected={active === i}
              aria-controls={`tab-panel-${i}`}
              id={`tab-${i}`}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-deep-green ${
                active === i
                  ? 'bg-deep-green text-white shadow-sm'
                  : 'bg-white text-deep-green border border-deep-green/20 hover:bg-sage/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          role="tabpanel"
          id={`tab-panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="bg-white rounded-xl shadow-sm p-7 sm:p-9"
        >
          {active === 0 && <ExploringFaith />}
          {active === 1 && <NewToFaith />}
          {active === 2 && <FindingChurch />}
        </div>

      </div>
    </section>
  )
}
