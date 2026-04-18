export const metadata = {
  title: 'Privacy Policy | FindMyChurch NZ',
  description:
    'Privacy Policy for FindMyChurch NZ — how we collect, use and protect your information.',
  alternates: {
    canonical: 'https://findmychurch.co.nz/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | FindMyChurch NZ',
    description:
      'Privacy Policy for FindMyChurch NZ — how we collect, use and protect your information.',
    url: 'https://findmychurch.co.nz/privacy',
    type: 'website',
  },
}

const SECTIONS = [
  {
    heading: '1. Introduction',
    body: "FindMyChurch NZ ('we', 'us', 'our') is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding your data.",
  },
  {
    heading: '2. Information We Collect',
    body: 'We collect information you provide when submitting a church listing, including: church name, address, contact name, contact email address, phone number, website and service times. We do not collect personal information from visitors who are simply browsing the directory.',
  },
  {
    heading: '3. How We Use Your Information',
    body: 'Information submitted via the Add Your Church form is used solely to create and manage your church listing on FindMyChurch NZ. Your contact email is used to communicate with you about your listing and is not displayed publicly on the site.',
  },
  {
    heading: '4. Cookies and Analytics',
    body: 'FindMyChurch NZ may use cookies and analytics tools (such as Google Analytics) to understand how visitors use the site. This data is anonymised and used only to improve the website. You can disable cookies in your browser settings at any time.',
  },
  {
    heading: '5. Third Party Services',
    body: 'We use the following third-party services: Supabase (database hosting), Vercel (website hosting), Google Maps (church location display), Resend (email notifications). Each of these services has their own privacy policy.',
  },
  {
    heading: '6. Display Advertising',
    body: 'FindMyChurch NZ displays advertisements via Google AdSense. Google may use cookies to show relevant ads based on your browsing history. You can opt out of personalised advertising at https://adssettings.google.com',
  },
  {
    heading: '7. Data Retention',
    body: 'Church listing information is retained for as long as the listing is active on the directory. You may request removal of your church listing or contact information at any time by emailing matt.jenkinson@findmychurch.co.nz',
  },
  {
    heading: '8. Your Rights',
    body: 'You have the right to request access to, correction of, or deletion of any personal information we hold about you. To exercise these rights, contact us at matt.jenkinson@findmychurch.co.nz',
  },
  {
    heading: '9. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.',
  },
  {
    heading: '10. Contact',
    body: 'For any privacy-related questions, contact us at matt.jenkinson@findmychurch.co.nz',
  },
]

export default function PrivacyPage() {
  return (
    <main>
      {/* ── Header ── */}
      <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sage text-sm">Last updated: April 2026</p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 px-4 sm:px-6 bg-off-white">
        <div className="max-w-3xl mx-auto space-y-8">
          {SECTIONS.map(({ heading, body }) => (
            <div key={heading} className="border-t border-sage/20 pt-8 first:border-0 first:pt-0">
              <h2 className="text-lg font-bold text-deep-green mb-2">{heading}</h2>
              <p className="text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
