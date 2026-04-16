'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(name, city) {
  return [name, city]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Input({ id, type = 'text', required, placeholder, value, onChange, ...rest }) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900"
      {...rest}
    />
  )
}

function FieldNote({ children }) {
  return <p className="mt-1 text-xs text-gray-400">{children}</p>
}

function GroupHeading({ children }) {
  return (
    <div className="pt-6 pb-2 border-t border-gray-100 first:border-0 first:pt-0">
      <h2 className="text-sm font-semibold text-deep-green uppercase tracking-wider">{children}</h2>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddChurchPage() {
  const [denominations, setDenominations] = useState([])
  const [form, setForm] = useState({
    name: '',
    denomination_id: '',
    address: '',
    suburb: '',
    city: '',
    region: '',
    phone: '',
    website: '',
    sunday_service_time: '',
    other_service_times: '',
    contact_name: '',
    contact_email: '',
    photo_url: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useEffect(() => {
    supabase
      .from('denominations')
      .select('id, name')
      .order('name')
      .then(({ data }) => setDenominations(data ?? []))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')

    const slug = generateSlug(form.name, form.city)
    const submittedAt = new Date().toISOString()

    const selectedDenom = denominations.find((d) => d.id === form.denomination_id)

    const churchRow = {
      name: form.name,
      slug,
      address: form.address || null,
      suburb: form.suburb || null,
      city: form.city,
      region: form.region || null,
      phone: form.phone || null,
      website: form.website || null,
      sunday_service_time: form.sunday_service_time || null,
      other_service_times: form.other_service_times || null,
      photo_url: form.photo_url || null,
      denomination_id: form.denomination_id || null,
      is_active: false,
      is_verified: false,
      created_at: submittedAt,
    }

    const notifyBody = {
      churchName: form.name,
      city: form.city,
      denomination: selectedDenom?.name ?? 'Not specified',
      contactEmail: form.contact_email,
      submittedAt,
    }

    const [insertResult, notifyResult] = await Promise.allSettled([
      supabase.from('churches').insert([churchRow]),
      fetch('/api/notify-church-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifyBody),
      }),
    ])

    if (insertResult.status === 'rejected' || insertResult.value?.error) {
      console.error('Insert error:', insertResult.value?.error ?? insertResult.reason)
      setStatus('error')
      return
    }

    // Notify failure is non-fatal — submission still succeeded
    if (notifyResult.status === 'rejected') {
      console.warn('Notify email failed (non-fatal):', notifyResult.reason)
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <main className="bg-off-white min-h-screen">
        <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Add Your Church</h1>
            <p className="text-sage text-lg">Get your church listed on FindMyChurch NZ — free, forever.</p>
          </div>
        </section>
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2F5D50"
              className="w-12 h-12 mx-auto mb-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <h2 className="text-2xl font-bold text-deep-green mb-3">Thank you!</h2>
            <p className="text-gray-600 leading-relaxed">
              Your church has been submitted for review. We&apos;ll be in touch within 2&ndash;3 business days.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-off-white min-h-screen">

      {/* ── Header ── */}
      <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Add Your Church</h1>
          <p className="text-sage text-lg mb-2">
            Get your church listed on FindMyChurch NZ — free, forever.
          </p>
          <p className="text-white/60 text-sm">
            All submissions are reviewed before going live. We&apos;ll be in touch if we need anything.
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-7 sm:p-9">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Church Details */}
            <GroupHeading>Church Details</GroupHeading>

            <div>
              <Label htmlFor="name" required>Church Name</Label>
              <Input
                id="name"
                required
                placeholder="e.g. St John's Anglican Church"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="denomination_id">Denomination</Label>
              <select
                id="denomination_id"
                name="denomination_id"
                value={form.denomination_id}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900 bg-white"
              >
                <option value="">Select a denomination</option>
                {denominations.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="address" required>Street Address</Label>
              <Input
                id="address"
                required
                placeholder="e.g. 123 Main Street"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suburb">Suburb</Label>
                <Input
                  id="suburb"
                  placeholder="e.g. Ponsonby"
                  value={form.suburb}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="city" required>City</Label>
                <Input
                  id="city"
                  required
                  placeholder="e.g. Auckland"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                placeholder="e.g. Auckland Region"
                value={form.region}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 09 123 4567"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourchurch.org.nz"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Service Times */}
            <GroupHeading>Service Times</GroupHeading>

            <div>
              <Label htmlFor="sunday_service_time">Sunday Service Time</Label>
              <Input
                id="sunday_service_time"
                placeholder="e.g. 10:00 AM"
                value={form.sunday_service_time}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="other_service_times">Other Service Times</Label>
              <Input
                id="other_service_times"
                placeholder="e.g. Wednesday 7:00 PM"
                value={form.other_service_times}
                onChange={handleChange}
              />
            </div>

            {/* Contact Information */}
            <GroupHeading>Contact Information</GroupHeading>

            <div>
              <Label htmlFor="contact_name">Pastor / Contact Name</Label>
              <Input
                id="contact_name"
                placeholder="e.g. Pastor John Smith"
                value={form.contact_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="contact_email" required>Your Email Address</Label>
              <Input
                id="contact_email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.contact_email}
                onChange={handleChange}
              />
              <FieldNote>We&apos;ll use this to confirm your listing. Not shown publicly.</FieldNote>
            </div>

            <div>
              <Label htmlFor="photo_url">Church Photo URL</Label>
              <Input
                id="photo_url"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={form.photo_url}
                onChange={handleChange}
              />
              <FieldNote>
                If you have a photo hosted online, paste the URL here. We accept Google Photos,
                Dropbox or any direct image link.
              </FieldNote>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <p className="text-red-500 text-sm">
                Something went wrong. Please try again or email us at{' '}
                <a href="mailto:admin@localflow.co.nz" className="underline">
                  admin@localflow.co.nz
                </a>
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-deep-green text-white font-semibold py-3 rounded-lg hover:bg-deep-green/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Your Church'}
            </button>

          </form>
        </div>
      </section>

    </main>
  )
}
