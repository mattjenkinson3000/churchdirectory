export const metadata = {
  title: 'Christian Resources for New Zealand | FindMyChurch NZ',
  description:
    'The best Christian resources for Kiwis - from beginner-friendly Bible apps and Alpha Course NZ to in-depth study tools for established believers. All free or affordable.',
  keywords: [
    'christian resources new zealand',
    'alpha course nz',
    'bible app for beginners',
    'christian courses aotearoa',
  ],
  alternates: {
    canonical: 'https://findmychurch.co.nz/resources',
  },
  openGraph: {
    title: 'Christian Resources for New Zealand | FindMyChurch NZ',
    description:
      'The best Christian resources for Kiwis - from beginner-friendly Bible apps and Alpha Course NZ to in-depth study tools for established believers. All free or affordable.',
    url: 'https://findmychurch.co.nz/resources',
    type: 'website',
  },
}

const NEW_TO_FAITH = [
  {
    title: 'Alpha Course NZ',
    badge: 'Perfect for beginners',
    description:
      "The Alpha Course is one of the most widely used introductions to Christianity in the world, and it's running in churches across Aotearoa right now. It's a free, relaxed series of sessions where you can ask any question about faith - no pressure, no commitment required. Each session includes food, a short talk and open conversation. It's a great first step if you're curious about Christianity but not sure where to start.",
    href: 'https://alpha.org.nz',
    button: 'Find a course near you',
  },
  {
    title: 'Manna Christian Bookstore',
    badge: 'New believer essential',
    description:
      "Manna is New Zealand's leading Christian bookstore, with a wide range of Bibles from affordable everyday editions to beautiful leather-bound gift Bibles. If you're new to faith and looking for your first Bible, their team can help you choose the right translation. They deliver across Aotearoa and also stock devotionals, journals and gifts for new believers.",
    href: 'https://manna.co.nz',
    button: 'Find a Bible',
  },
  {
    title: 'YouVersion Bible App',
    badge: 'Free app',
    description:
      "YouVersion is the world's most downloaded Bible app, with over 500 million installs globally. It's completely free and includes hundreds of Bible translations, daily verse notifications and reading plans designed specifically for beginners. The 'Bible in One Year' plan is a popular starting point for new Christians in New Zealand and around the world.",
    href: 'https://www.youversion.com',
    button: 'Download free',
  },
  {
    title: 'Bible Project',
    badge: 'Free videos',
    description:
      "Bible Project creates beautifully animated videos that explain the Bible in a way that's engaging and easy to understand. Every video is free on YouTube and their website. If you've ever found the Bible confusing or overwhelming, Bible Project is one of the best places to start - their overview videos for each book of the Bible are particularly helpful for new believers.",
    href: 'https://bibleproject.com',
    button: 'Watch free',
  },
]

const GROW_YOUR_FAITH = [
  {
    title: 'Right Now Media',
    badge: 'Great for small groups',
    description:
      "Right Now Media is often called the Netflix of Bible studies - a huge library of video-based Bible studies, kids content and leadership resources. Many New Zealand churches offer their congregation free access, so check with your church before subscribing. If your church doesn't have it yet, individual subscriptions are also available.",
    href: 'https://www.rightnowmedia.org',
    button: 'Explore studies',
  },
  {
    title: 'Bible Project',
    badge: 'Free & in-depth',
    description:
      "Beyond their beginner content, Bible Project goes deep into biblical theology, narrative themes and the original languages of scripture. Their podcast series and extended classroom content are excellent for Christians wanting to develop a more serious understanding of the Bible. All content remains free.",
    href: 'https://bibleproject.com',
    button: 'Watch free',
  },
  {
    title: 'Carey Baptist College NZ',
    badge: 'For deeper study',
    description:
      "Carey is New Zealand's leading evangelical theological college, based in Auckland. They offer everything from short courses and online papers to full degree programmes in theology and ministry. If you feel called to ministry or simply want to study the Bible at a deeper level, Carey is the most respected institution in Aotearoa for Christian education.",
    href: 'https://www.carey.ac.nz',
    button: 'Learn more',
  },
  {
    title: 'Olive Tree Bible App',
    badge: 'For serious study',
    description:
      "Olive Tree is a powerful Bible study app designed for serious students of scripture. It includes access to commentaries, Bible dictionaries, original language tools and study Bibles all in one place. Unlike many apps, your content is stored on your device so you can study offline - ideal for those leading small groups or preparing sermons.",
    href: 'https://www.olivetree.com',
    button: 'Download',
  },
  {
    title: 'BibleThinker',
    badge: 'Deep Bible teaching',
    description:
      "BibleThinker is the ministry of pastor and teacher Mike Winger, who has built one of the most respected Bible teaching channels on YouTube. His content is known for being thorough, honest and willing to tackle difficult questions that other teachers avoid. Whether you want verse-by-verse teaching, apologetics or answers to tough theological questions, BibleThinker is an outstanding free resource.",
    href: 'https://biblethinker.org',
    button: 'Watch free',
  },
]

const FAQS = [
  {
    question: 'What is the Alpha Course and is it available in New Zealand?',
    answer:
      'The Alpha Course is a free, multi-week introduction to Christianity run by local churches. It covers the basics of the Christian faith in a relaxed, no-pressure environment. Alpha is widely available across New Zealand - you can find a course near you at alpha.org.nz.',
  },
  {
    question: 'What is the best Bible app for beginners?',
    answer:
      "YouVersion is the most popular Bible app in the world and is completely free. It includes beginner-friendly reading plans and hundreds of Bible translations. For those wanting deeper study tools, Olive Tree is an excellent step up.",
  },
  {
    question: 'Are there any free Christian resources for New Zealanders?',
    answer:
      'Yes - several of the best resources are completely free. YouVersion, Bible Project and BibleThinker are all free online. The Alpha Course is also free to attend. Manna Christian Bookstore offers affordable Bibles for those wanting a physical copy.',
  },
  {
    question: 'Can I study theology in New Zealand?',
    answer:
      "Yes - Carey Baptist College in Auckland is New Zealand's leading theological college, offering everything from short online courses to full degree programmes. They welcome students from all Christian denominations.",
  },
  {
    question: 'What resources are good for a church small group?',
    answer:
      'Right Now Media is one of the best resources for small groups, with a huge library of video-based Bible studies designed for group settings. Many NZ churches provide free access to their congregation.',
  },
]

const INTERNAL_LINKS = [
  { href: '/find/auckland/baptist', label: 'Baptist Churches in Auckland' },
  { href: '/find/wellington/catholic', label: 'Catholic Churches in Wellington' },
  { href: '/find/christchurch/anglican', label: 'Anglican Churches in Christchurch' },
  { href: '/find/auckland/presbyterian', label: 'Presbyterian Churches in Auckland' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
}

// ─── Components ───────────────────────────────────────────────────────────────

function ResourceCard({ title, badge, description, href, button }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
      {badge && (
        <span className="self-start bg-sage/20 text-deep-green text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {badge}
        </span>
      )}
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
      <h2 className="text-2xl font-bold text-deep-green inline-block">{children}</h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-sage" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Header ── */}
        <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Faith Resources</h1>
            <p className="text-sage text-lg max-w-2xl">
              Whether you&apos;re just starting out or deepening your faith, these resources are for you.
            </p>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-white px-4 sm:px-6 py-10 border-b border-sage/20">
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-600 leading-relaxed text-base max-w-3xl">
              Whether you&apos;ve just started exploring Christianity or you&apos;ve been walking in faith for
              years, having the right resources makes a real difference. We&apos;ve pulled together the best
              tools, courses and apps available to Kiwis - from free beginner-friendly options to
              in-depth study resources for those wanting to go deeper. All of the resources below are
              either free or affordable, and most are available instantly online.
            </p>
          </div>
        </section>

        {/* ── New to Faith ── */}
        <section className="py-16 px-4 sm:px-6 bg-off-white">
          <div className="max-w-5xl mx-auto">
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
          <div className="max-w-5xl mx-auto">
            <SectionHeading>Grow Your Faith</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {GROW_YOUR_FAITH.map((r) => (
                <ResourceCard key={r.title} {...r} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Internal links ── */}
        <section className="py-14 px-4 sm:px-6 bg-off-white border-t border-sage/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-deep-green mb-3">Looking for a church?</h2>
            <p className="text-gray-600 text-sm mb-6 max-w-2xl">
              These resources are just the beginning. If you&apos;re ready to find a church community
              in your area, browse our directory by city and denomination.
            </p>
            <div className="flex flex-wrap gap-2">
              {INTERNAL_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="inline-block bg-sage/20 border border-sage/40 text-deep-green text-sm font-medium px-4 py-2 rounded-full hover:bg-sage/40 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 sm:px-6 bg-white border-t border-sage/20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading>Frequently Asked Questions</SectionHeading>
            <dl className="space-y-6">
              {FAQS.map(({ question, answer }) => (
                <div
                  key={question}
                  className="border border-sage/40 rounded-xl p-6 bg-off-white"
                >
                  <dt className="font-semibold text-gray-900 mb-2">{question}</dt>
                  <dd className="text-gray-500 text-sm leading-relaxed">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <section className="py-10 px-4 sm:px-6 bg-off-white border-t border-sage/20">
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-400 text-sm text-center">
              FindMyChurch NZ is not affiliated with these organisations. We share them because we
              believe they genuinely help people.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
