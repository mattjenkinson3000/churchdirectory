import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { churchName, city, denomination, contactEmail, submittedAt } = await request.json()

    await resend.emails.send({
      from: 'FindMyChurch NZ <onboarding@resend.dev>',
      to: 'admin@localflow.co.nz',
      subject: `New Church Submission - ${churchName}`,
      text: `A new church has been submitted to FindMyChurch NZ.

Church Name: ${churchName}
City: ${city}
Denomination: ${denomination}
Contact Email: ${contactEmail}
Submitted At: ${submittedAt}

Log in to Supabase to review and approve.`,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Notify email error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
