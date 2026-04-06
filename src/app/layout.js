import './globals.css'
import Link from 'next/link'

const siteUrl = 'https://findmychurch.co.nz'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'FindMyChurch NZ',
  description: 'Find a church near you in Aotearoa New Zealand',
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN',
  },
  openGraph: {
    title: 'FindMyChurch NZ',
    description: 'Find a church near you in Aotearoa New Zealand',
    url: siteUrl,
    siteName: 'FindMyChurch NZ',
    locale: 'en_NZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindMyChurch NZ',
    description: 'Find a church near you in Aotearoa New Zealand',
    site: '@findmychurchnz',
  },
}

function LeafIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 8Z" />
    </svg>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-off-white text-gray-800 font-sans">
        <header className="sticky top-0 z-50 bg-off-white border-b border-sage/30 shadow-sm">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-deep-green font-bold text-xl"
            >
              <span className="text-deep-green">
                <LeafIcon />
              </span>
              <span>FindMyChurch NZ</span>
            </Link>

            <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/churches"
                className="text-gray-700 hover:text-deep-green transition-colors"
              >
                Find a Church
              </Link>
              <Link
                href="/denominations"
                className="text-gray-700 hover:text-deep-green transition-colors"
              >
                Denominations
              </Link>
              <Link
                href="/add-church"
                className="bg-deep-green text-white px-4 py-2 rounded-md hover:bg-deep-green/90 transition-colors"
              >
                Add Your Church
              </Link>
            </div>

            <div className="flex sm:hidden items-center gap-3 text-sm">
              <Link
                href="/add-church"
                className="bg-deep-green text-white px-3 py-1.5 rounded-md text-xs font-medium"
              >
                Add Church
              </Link>
            </div>
          </nav>
        </header>

        {children}

        <footer className="bg-deep-green text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold text-lg">
              <LeafIcon />
              <span>FindMyChurch NZ</span>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-sage">
              <Link href="/churches" className="hover:text-white transition-colors">
                Find a Church
              </Link>
              <Link href="/denominations" className="hover:text-white transition-colors">
                Denominations
              </Link>
              <Link href="/add-church" className="hover:text-white transition-colors">
                Add Your Church
              </Link>
            </nav>
            <p className="text-sage/70 text-xs">
              &copy; {new Date().getFullYear()} FindMyChurch NZ
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
