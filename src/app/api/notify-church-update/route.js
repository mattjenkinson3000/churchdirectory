import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const {
      churchName,
      churchSlug,
      city,
      contactName,
      contactEmail,
      submittedAt,
      proposedName,
      proposedAddress,
      proposedSuburb,
      proposedCity,
      proposedPhone,
      proposedWebsite,
      proposedSundayServiceTime,
      proposedOtherServiceTimes,
      proposedDescription,
      proposedPhotoUrl,
      notes,
    } = await request.json()

    await resend.emails.send({
      from: 'FindMyChurch NZ <onboarding@resend.dev>',
      to: 'admin@localflow.co.nz',
      subject: `Church Update Request - ${churchName}`,
      text: `A church has requested an update to their listing.

Church: ${churchName}
City: ${city}
Listing: https://findmychurch.co.nz/churches/${churchSlug}

Submitted by: ${contactName || 'Not provided'} (${contactEmail || 'No email'})
Submitted at: ${submittedAt}

Proposed changes:
Name: ${proposedName || '-'}
Address: ${proposedAddress || '-'}
Suburb: ${proposedSuburb || '-'}
City: ${proposedCity || '-'}
Phone: ${proposedPhone || '-'}
Website: ${proposedWebsite || '-'}
Sunday Service: ${proposedSundayServiceTime || '-'}
Other Services: ${proposedOtherServiceTimes || '-'}
Description: ${proposedDescription || '-'}
Photo URL: ${proposedPhotoUrl || '-'}

Notes: ${notes || 'None'}

Log in to Supabase to review and approve:
https://supabase.com/dashboard/project/ilxubdmgjfhcnvvahtdl/editor`,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Notify church update error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
