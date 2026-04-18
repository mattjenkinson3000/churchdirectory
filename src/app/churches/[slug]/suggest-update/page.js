'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../lib/supabase'

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Input({ id, type = 'text', required, placeholder, value, onChange }) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900"
    />
  )
}

function Textarea({ id, required, placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea
      id={id}
      name={id}
      required={required}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      rows={rows}
      className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900 resize-y"
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

export default function SuggestUpdatePage() {
  const { slug } = useParams()
  const [church, setChurch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    proposed_name: '',
    proposed_address: '',
    proposed_suburb: '',
    proposed_city: '',
    proposed_phone: '',
    proposed_website: '',
    proposed_sunday_service_time: '',
    proposed_other_service_times: '',
    proposed_description: '',
    proposed_photo_url: '',
    contact_name: '',
    contact_email: '',
    notes: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useEffect(() => {
    if (!slug) return
    supabase
      .from('churches')
      .select('id, name, slug, address, suburb, city, phone, website, sunday_service_time, other_service_times, description, photo_url')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        if (data) {
          setChurch(data)
          setForm((prev) => ({
            ...prev,
            proposed_name: data.name ?? '',
            proposed_address: data.address ?? '',
            proposed_suburb: data.suburb ?? '',
            proposed_city: data.city ?? '',
            proposed_phone: data.phone ?? '',
            proposed_website: data.website ?? '',
            proposed_sunday_service_time: data.sunday_service_time ?? '',
            proposed_other_service_times: data.other_service_times ?? '',
            proposed_description: data.description ?? '',
            proposed_photo_url: data.photo_url ?? '',
          }))
        }
        setLoading(false)
      })
  }, [slug])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!church) return
    setStatus('submitting')

    const submittedAt = new Date().toISOString()

    const row = {
      church_id: church.id,
      church_name: church.name,
      church_slug: church.slug,
      status: 'pending',
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      notes: form.notes || null,
      proposed_name: form.proposed_name || null,
      proposed_address: form.proposed_address || null,
      proposed_suburb: form.proposed_suburb || null,
      proposed_city: form.proposed_city || null,
      proposed_phone: form.proposed_phone || null,
      proposed_website: form.proposed_website || null,
      proposed_sunday_service_time: form.proposed_sunday_service_time || null,
      proposed_other_service_times: form.proposed_other_service_times || null,
      proposed_description: form.proposed_description || null,
      proposed_photo_url: form.proposed_photo_url || null,
    }

    const notifyBody = {
      churchName: church.name,
      churchSlug: church.slug,
      city: church.city,
      contactName: form.contact_name,
      contactEmail: form.contact_email,
      submittedAt,
      proposedName: form.proposed_name,
      proposedAddress: form.proposed_address,
      proposedSuburb: form.proposed_suburb,
      proposedCity: form.proposed_city,
      proposedPhone: form.proposed_phone,
      proposedWebsite: form.proposed_website,
      proposedSundayServiceTime: form.proposed_sunday_service_time,
      proposedOtherServiceTimes: form.proposed_other_service_times,
      proposedDescription: form.proposed_description,
      proposedPhotoUrl: form.proposed_photo_url,
      notes: form.notes,
    }

    const [insertResult, notifyResult] = await Promise.allSettled([
      supabase.from('church_updates').insert([row]),
      fetch('/api/notify-church-update', {
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

    if (notifyResult.status === 'rejected') {
      console.warn('Notify email failed (non-fatal):', notifyResult.reason)
    }

    setStatus('success')
  }

  if (loading) {
    return (
      <main className="bg-off-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    )
  }

  if (!church) {
    return (
      <main className="bg-off-white min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Church not found.</p>
      </main>
    )
  }

  if (status === 'success') {
    return (
      <main className="bg-off-white min-h-screen">
        <section className="bg-deep-green text-white py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Suggest an Update</h1>
            <p className="text-sage">{church.name}</p>
          </div>
        </section>
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <h2 className="text-2xl font-bold text-deep-green mb-3">Thank you!</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Your suggested update has been submitted. We&apos;ll review it within 2&ndash;3 business days and apply any changes.
            </p>
            <Link
              href={`/churches/${church.slug}`}
              className="inline-block bg-deep-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-deep-green/90 transition-colors"
            >
              Back to {church.name}
            </Link>
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
          <nav aria-label="Breadcrumb" className="text-sage text-sm mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/churches/${church.slug}`} className="hover:text-white transition-colors">{church.name}</Link>
            <span>/</span>
            <span className="text-white">Suggest an Update</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Suggest an Update for {church.name}
          </h1>
          <p className="text-sage text-base">
            See something that needs updating? Fill in only the fields you&apos;d like to change and we&apos;ll review your suggestion within 2&ndash;3 business days.
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
              <Label htmlFor="proposed_name">Church Name</Label>
              <Input id="proposed_name" value={form.proposed_name} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="proposed_address">Street Address</Label>
              <Input id="proposed_address" value={form.proposed_address} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposed_suburb">Suburb</Label>
                <Input id="proposed_suburb" value={form.proposed_suburb} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="proposed_city">City</Label>
                <Input id="proposed_city" value={form.proposed_city} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposed_phone">Phone</Label>
                <Input id="proposed_phone" type="tel" value={form.proposed_phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="proposed_website">Website</Label>
                <Input id="proposed_website" type="url" placeholder="https://" value={form.proposed_website} onChange={handleChange} />
              </div>
            </div>

            {/* Service Times */}
            <GroupHeading>Service Times</GroupHeading>

            <div>
              <Label htmlFor="proposed_sunday_service_time">Sunday Service Time</Label>
              <Input id="proposed_sunday_service_time" placeholder="e.g. 10:00 AM" value={form.proposed_sunday_service_time} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="proposed_other_service_times">Other Service Times</Label>
              <Input id="proposed_other_service_times" placeholder="e.g. Wednesday 7:00 PM" value={form.proposed_other_service_times} onChange={handleChange} />
            </div>

            {/* About */}
            <GroupHeading>About Your Church</GroupHeading>

            <div>
              <Label htmlFor="proposed_description">Description</Label>
              <Textarea id="proposed_description" value={form.proposed_description} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="proposed_photo_url">Church Photo URL</Label>
              <Input id="proposed_photo_url" type="url" placeholder="https://example.com/photo.jpg" value={form.proposed_photo_url} onChange={handleChange} />
              <FieldNote>Paste a direct image URL if you have an updated photo.</FieldNote>
            </div>

            {/* Your Details */}
            <GroupHeading>Your Details</GroupHeading>

            <div>
              <Label htmlFor="contact_name">Your Name</Label>
              <Input id="contact_name" value={form.contact_name} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="contact_email" required>Your Email</Label>
              <Input id="contact_email" type="email" required value={form.contact_email} onChange={handleChange} />
              <FieldNote>So we can confirm the update. Not shown publicly.</FieldNote>
            </div>

            <div>
              <Label htmlFor="notes">Anything else you&apos;d like us to know?</Label>
              <Textarea id="notes" placeholder="Optional — any context that might help us review your update." value={form.notes} onChange={handleChange} rows={3} />
            </div>

            {/* Error */}
            {status === 'error' && (
              <p className="text-red-500 text-sm">
                Something went wrong. Please try again or email us at{' '}
                <a href="mailto:admin@localflow.co.nz" className="underline">admin@localflow.co.nz</a>
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-deep-green text-white font-semibold py-3 rounded-lg hover:bg-deep-green/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Update'}
            </button>

          </form>
        </div>
      </section>

    </main>
  )
}
