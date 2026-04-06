import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: denominations, error } = await supabase
    .from('denominations')
    .select('*')
    .order('name')

  if (error) console.error('Database error:', error)

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Church Directory NZ</h1>
      <p>Find a church near you</p>
      <h2>Denominations</h2>
      {denominations ? (
        <ul>
          {denominations.map((d) => (
            <li key={d.id}><strong>{d.name}</strong> — {d.short_description}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  )
}
