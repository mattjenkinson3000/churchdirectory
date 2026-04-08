// Server component — renders a Google Maps Embed iframe.
// No 'use client' needed: an iframe requires no React state or effects.
export default function ChurchMap({ latitude, longitude, name, address }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Render nothing if coordinates or key are absent
  if (!latitude || !longitude || !apiKey) return null

  const embedSrc =
    `https://www.google.com/maps/embed/v1/place` +
    `?key=${apiKey}` +
    `&q=${latitude},${longitude}` +
    `&zoom=16`

  const directionsHref =
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

  return (
    <div>
      {/* Map iframe */}
      <div className="rounded-xl overflow-hidden border border-sage/40 shadow-sm h-72 sm:h-80 relative">
        <iframe
          title={`Map showing the location of ${name}${address ? `, ${address}` : ''}`}
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Directions link */}
      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-deep-green text-sm font-medium hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
          />
        </svg>
        Get directions to {name} in Google Maps
      </a>
    </div>
  )
}
