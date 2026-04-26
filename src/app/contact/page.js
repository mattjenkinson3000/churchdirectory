import Link from 'next/link'
import ContactForm from '../components/ContactForm'

export const metadata = {
  title: 'Contact FindMyChurch NZ | Church Directory Support',
  description:
    'Get in touch with FindMyChurch NZ. Update a church listing, add your church to our free directory, or ask us anything about finding a church across Aotearoa New Zealand.',
  alternates: {
    canonical: 'https://findmychurch.co.nz/contact',
  },
  openGraph: {
    title: 'Contact FindMyChurch NZ | Church Directory Support',
    description:
      'Get in touch with FindMyChurch NZ. Update a church listing, add your church to our free directory, or ask us anything.',
    url: 'https://findmychurch.co.nz/contact',
    type: 'website',
  },
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: 'How do I get my church listed on FindMyChurch NZ?',
    answer:
      'Adding your church is completely free. Use our Add Your Church form and your listing will be reviewed and published within 2-3 business days. We list churches of all mainstream Christian denominations across Aotearoa New Zealand.',
  },
  {
    question: "How do I update my church's details?",
    answer:
      "Visit your church's listing page on FindMyChurch NZ and click 'Suggest an update' at the bottom of the page. Fill in the details you'd like to change and we'll review and apply them within 2-3 business days.",
  },
  {
    question: 'Is it free to list my church?',
    answer:
      'Yes - completely free, always. FindMyChurch NZ is a free directory for churches and for anyone searching for a church across Aotearoa New Zealand.',
  },
  {
    question: 'How long does it take for my church to appear in the directory?',
    answer:
      'We review all new submissions and updates within 2-3 business days. Once approved your listing will appear immediately in search results across the directory.',
  },
  {
    question: 'Can I remove my church from the directory?',
    answer:
      "Yes. Email us at matt.jenkinson@findmychurch.co.nz and we'll remove your listing within 2-3 business days.",
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact FindMyChurch NZ',
    url: 'https://findmychurch.co.nz/contact',
    description: 'Contact page for FindMyChurch NZ church directory',
    mainEntity: {
      '@type': 'Organization',
      name: 'FindMyChurch NZ',
      email: 'matt.jenkinson@findmychurch.co.nz',
      url: 'https://findmychurch.co.nz',
    },
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
    </svg>
  )
}

function PlusCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
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
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact FindMyChurch NZ</h1>
            <p className="text-sage text-lg max-w-2xl">
              Questions, updates, or just want to say hello? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* ── Two-column body ── */}
        <section className="py-16 px-4 sm:px-6 bg-off-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left column */}
            <div>
              <p className="text-gray-600 leading-relaxed mb-8">
                FindMyChurch NZ is a free church directory built for Kiwis. Whether you&apos;ve spotted
                an error in a listing, want to add your church, or have a question about finding a
                church in Aotearoa - we&apos;re here to help.
              </p>

              <div className="space-y-4">

                {/* Card 1 — Update a listing */}
                <div className="bg-white rounded-xl shadow-sm border-l-4 border-sage p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <PencilIcon />
                    <h2 className="font-semibold text-deep-green text-base">Suggest a listing update</h2>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Found incorrect details on a church listing? Visit the church page and click
                    &lsquo;Suggest an update&rsquo;. We review all changes within 2&ndash;3 business days.
                  </p>
                </div>

                {/* Card 2 — Add your church */}
                <div className="bg-white rounded-xl shadow-sm border-l-4 border-sage p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <PlusCircleIcon />
                    <h2 className="font-semibold text-deep-green text-base">Add your church</h2>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    Your church isn&apos;t listed yet? Submit it for free and we&apos;ll get it live within
                    2&ndash;3 business days.
                  </p>
                  <Link
                    href="/add-church"
                    className="inline-block bg-warm-sand text-deep-green text-sm font-semibold px-4 py-2 rounded-lg hover:bg-warm-sand/80 transition-colors"
                  >
                    Add your church
                  </Link>
                </div>

                {/* Card 3 — General enquiries */}
                <div className="bg-white rounded-xl shadow-sm border-l-4 border-sage p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MailIcon />
                    <h2 className="font-semibold text-deep-green text-base">General enquiries</h2>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    For anything else, email us directly at{' '}
                    <a
                      href="mailto:matt.jenkinson@findmychurch.co.nz"
                      className="text-deep-green underline hover:no-underline"
                    >
                      matt.jenkinson@findmychurch.co.nz
                    </a>{' '}
                    - we aim to respond within 1&ndash;2 business days.
                  </p>
                </div>

              </div>
            </div>

            {/* Right column — form */}
            <div className="bg-white rounded-xl shadow-md p-7 sm:p-8 h-fit">
              <h2 className="text-xl font-bold text-deep-green mb-6">Send us a message</h2>
              <ContactForm />
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 sm:px-6 bg-white border-t border-sage/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-deep-green mb-8">Frequently asked questions</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FAQS.map(({ question, answer }) => (
                <div key={question} className="border border-sage/40 rounded-xl p-6 bg-off-white h-full">
                  <dt className="font-semibold text-gray-900 mb-2">{question}</dt>
                  <dd className="text-gray-500 text-sm leading-relaxed">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

      </main>
    </>
  )
}
