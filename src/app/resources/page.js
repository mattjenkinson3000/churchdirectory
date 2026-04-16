export const metadata = {
  title: 'Faith Resources | FindMyChurch NZ',
  description:
    'Helpful resources for anyone exploring Christianity or wanting to grow in faith — courses, Bible apps, study tools and more.',
  alternates: {
    canonical: 'https://findmychurch.co.nz/resources',
  },
  openGraph: {
    title: 'Faith Resources | FindMyChurch NZ',
    description:
      'Helpful resources for anyone exploring Christianity or wanting to grow in faith — courses, Bible apps, study tools and more.',
    url: 'https://findmychurch.co.nz/resources',
    type: 'website',
  },
}

const NEW_TO_FAITH = [
  {
    title: 'Alpha Course NZ',
    description:
      'A free, no-pressure course exploring the basics of Christianity. Run by local churches across Aotearoa.',
    href: 'https://alpha.org.nz',
    button: 'Find a course near you',
  },
  {
    title: 'Bible Society NZ',
    description:
      'Free and affordable Bibles for anyone who wants one, delivered across New Zealand.',
    href: 'https://www.biblesociety.org.nz',
    button: 'Get a Bible',
  },
  {
    title: 'YouVersion Bible App',
    description:
      'The world's most popular Bible app — free, with reading plans perfect for beginners.',
    href: 'https://www.youversion.com',
    button: 'Download free',
  },
  {
    title: 'GodSpace NZ',
    description:
      'A New Zealand Christian community with articles and resources for those exploring faith.',
    href: 'https://godspace.org.nz',
    button: 'Explore',
  },
]

const GROW_YOUR_FAITH = [
  {
    title: 'Right Now Media',
    description:
      'Often called the Netflix of Bible studies. Ask your church for free access, or sign up directly.',
    href: 'https://www.rightnowmedia.org',
    button: 'Explore studies',
  },
  {
    title: 'Bible Project',
    description:
      'Free animated videos making the Bible accessible and engaging. Loved by churches worldwide.',
    href: 'https://bibleproject.com',
    button: 'Watch free',
  },
  {
    title: 'Carey Baptist College NZ',
    description:
      'New Zealand's leading theological college for those wanting to study faith more deeply.',
    href: 'https://www.carey.ac.nz',
    button: 'Learn more',
  },
  {
    title: 'Olive Tree Bible App',
    description:
      'A powerful Bible study app for deeper reading, commentaries and study tools.',
    href: 'https://www.olivetree.com',
    button: 'Download',
  },
]

function ResourceCard({ title, description, href, button }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
      <h3 className="text-deep-green font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">{description}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block self-start bg-warm-sand text-deep-green text-sm font-semibold px-4 py-2 rounded-lg hover:bg-warm-sand/80 transition-colors"
      >
        {button}
      </a>
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-deep-green inline-block">
        {children}
      </h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-sage" />
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <main>
      {/* ── Header ── */}
      <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Faith Resources</h1>
          <p className="text-sage text-lg max-w-2xl">
            Whether you&apos;re just starting out or deepening your faith, these resources are for you.
          </p>
        </div>
      </section>

      {/* ── New to Faith ── */}
      <section className="py-16 px-4 sm:px-6 bg-off-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeading>New to Faith</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {NEW_TO_FAITH.map((r) => (
              <ResourceCard key={r.title} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Grow Your Faith ── */}
      <section className="py-16 px-4 sm:px-6 bg-white border-t border-sage/20">
        <div className="max-w-4xl mx-auto">
          <SectionHeading>Grow Your Faith</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GROW_YOUR_FAITH.map((r) => (
              <ResourceCard key={r.title} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-10 px-4 sm:px-6 bg-off-white border-t border-sage/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm text-center">
            FindMyChurch NZ is not affiliated with these organisations. We share them because we believe they genuinely help people.
          </p>
        </div>
      </section>
    </main>
  )
}
