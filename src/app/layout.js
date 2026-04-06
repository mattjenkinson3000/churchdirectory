export const metadata = {
  title: 'Church Directory NZ',
  description: 'Find a church near you in New Zealand',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
