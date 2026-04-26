'use client'

import { useState } from 'react'

const SUBJECTS = [
  'Update a church listing',
  'Add a new church',
  'Report an error',
  'Partnership enquiry',
  'General question',
  'Other',
]

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Failed')
      setStatus('success')
    } catch (err) {
      console.error('Contact form error:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-sage/20 rounded-xl p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2F5D50" className="w-10 h-10 mx-auto mb-3" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        <p className="text-gray-700 text-sm leading-relaxed">
          Thanks for getting in touch! We&apos;ll get back to you at{' '}
          <span className="font-semibold text-deep-green">{form.email}</span>{' '}
          within 1&ndash;2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <Label htmlFor="name" required>Your name</Label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900"
        />
      </div>

      <div>
        <Label htmlFor="email" required>Your email</Label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900"
        />
      </div>

      <div>
        <Label htmlFor="subject" required>Subject</Label>
        <select
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900 bg-white"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="message" required>Message</Label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-deep-green text-sm text-gray-900 resize-y"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Something went wrong. Please try again or email us directly at{' '}
          <a href="mailto:matt.jenkinson@findmychurch.co.nz" className="underline">
            matt.jenkinson@findmychurch.co.nz
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-deep-green text-white font-semibold py-3 rounded-lg hover:bg-deep-green/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
