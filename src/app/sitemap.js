import { supabase } from '../lib/supabase'

const BASE_URL = 'https://findmychurch.co.nz'

export default async function sitemap() {
  const { data: denominations } = await supabase
    .from('denominations')
    .select('slug, updated_at')

  const denominationUrls = (denominations ?? []).map((d) => ({
    url: `${BASE_URL}/denominations/${d.slug}`,
    lastModified: d.updated_at ? new Date(d.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

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
  ]
}
