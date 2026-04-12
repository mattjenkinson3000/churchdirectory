'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LocationButton({ denominationSlug = '' }) {
  const router = useRouter()
  const [status, setStatus] = useState('idle') // idle | loading | denied | unavailable

  function handleClick() {
    if (!navigator?.geolocation) {
      setStatus('unavailable')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const params = new URLSearchParams()
        params.set('lat', coords.latitude.toFixed(6))
        params.set('lng', coords.longitude.toFixed(6))
        if (denominationSlug) params.set('denomination', denominationSlug)
        router.push(`/search?${params.toString()}`)
      },
      (err) => {
        setStatus(err.code === 1 ? 'denied' : 'unavailable')
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  if (status === 'denied') {
    return (
      <p className="text-sm text-gray-500 text-center">
        Location access was denied. Please enter your town or city in the search bar above.
      </p>
    )
  }

  if (status === 'unavailable') {
    return (
      <p className="text-sm text-gray-500 text-center">
        Location isn&apos;t available on this device. Please enter your town or city above.
      </p>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading'}
      className="inline-flex items-center gap-2 text-deep-green text-sm font-medium border border-deep-green/30 px-4 py-2.5 rounded-md hover:bg-sage/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {status === 'loading' ? (
        <>
          <svg
            className="animate-spin w-4 h-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Getting your location…
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 shrink-0"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          Use my location
        </>
      )}
    </button>
  )
}
