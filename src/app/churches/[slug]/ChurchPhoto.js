'use client'

import { useState } from 'react'

export default function ChurchPhoto({ photoUrl, name }) {
  const [failed, setFailed] = useState(false)

  console.log('[ChurchPhoto]', { name, photoUrl, failed })

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join('')

  const placeholder = (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" aria-hidden="true">
      <span className="text-white/40 text-7xl font-bold tracking-widest select-none">
        {initials}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="white" className="w-10 h-10 opacity-20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    </div>
  )

  return (
    <div className="relative w-full h-64 sm:h-80 bg-[#2F5D50] overflow-hidden">
      {photoUrl && !failed ? (
        // Plain <img> bypasses Next.js image optimisation entirely — the Google CDN
        // URLs already carry their own size parameters (=w800-h500-k-no), so
        // optimisation adds no benefit and remotePatterns is irrelevant.
        <img
          src={photoUrl}
          alt={`Photo of ${name}`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => {
            console.log('[ChurchPhoto] onError fired for', photoUrl)
            setFailed(true)
          }}
        />
      ) : (
        placeholder
      )}
    </div>
  )
}
