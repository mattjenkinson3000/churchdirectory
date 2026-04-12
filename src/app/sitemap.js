import { supabase } from '../lib/supabase'

const BASE_URL = 'https://findmychurch.co.nz'

export default async function sitemap() {
  const [{ data: denominations }, { data: churches }] = await Promise.all([
    supabase.from('denominations').select('slug, updated_at'),
    supabase
      .from('churches')
      .select('city, denominations(slug)')
      .eq('is_active', true)
      .not('city', 'is', null)
      .not('denomination_id', 'is', null)
      .limit(5000),
  ])

  const denominationUrls = (denominations ?? []).map((d) => ({
    url: `${BASE_URL}/denominations/${d.slug}`,
    lastModified: d.updated_at ? new Date(d.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Distinct city + denomination slug combinations
  const seen = new Set()
  const findUrls = []
  for (const row of churches ?? []) {
    const slug = row.denominations?.slug
    const city = row.city
    if (!slug || !city) continue
    const key = `${city.toLowerCase()}|${slug}`
    if (!seen.has(key)) {
      seen.add(key)
      findUrls.push({
        url: `${BASE_URL}/find/${city.toLowerCase()}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/denominations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...denominationUrls,
    ...findUrls,
  ]
}
