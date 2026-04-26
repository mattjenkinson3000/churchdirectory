import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, email, subject, message, submittedAt } = await request.json()

    await resend.emails.send({
      from: 'FindMyChurch NZ <onboarding@resend.dev>',
      to: 'matt.jenkinson@findmychurch.co.nz',
      subject: `FindMyChurch Contact: ${subject} - from ${name}`,
      text: `New contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Submitted at: ${submittedAt}`,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
