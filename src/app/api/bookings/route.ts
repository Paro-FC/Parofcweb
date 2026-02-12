import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'
import { createClient } from '@sanity/client'
import { EMAIL_CONFIG, SANITY_FALLBACKS } from '@/lib/constants'

// Create write client for mutations (create, patch)
const getWriteClient = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || SANITY_FALLBACKS.PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || SANITY_FALLBACKS.DATASET
  const token = process.env.SANITY_API_TOKEN

  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for booking operations. Please set it in your environment variables.')
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false, // Write operations require CDN disabled
    token, // API token for authenticated requests
  })
}

// Read client for queries
const getReadClient = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || SANITY_FALLBACKS.PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || SANITY_FALLBACKS.DATASET

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true,
  })
}

// Initialize Resend lazily to avoid build-time errors
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - emails will not be sent')
    return null
  }
  return new Resend(apiKey)
}

// Validation schema
const BookingRequestSchema = z.object({
  matchId: z.string().min(1),
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255),
  quantity: z.number().int().positive().max(100),
})

function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TKT-${timestamp}-${random}`
}

// Sanitize string for HTML output
function sanitizeHtml(str: string): string {
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [] })
}

function generateAdminBookingEmailHtml(booking: {
  bookingId: string
  name: string
  email: string
  quantity: number
  match: {
    homeTeam: string
    awayTeam: string
    competition?: string
    date: string
    venue?: string
  }
  newAvailability: number
}): string {
  const safeBookingId = sanitizeHtml(booking.bookingId)
  const safeName = sanitizeHtml(booking.name)
  const safeEmail = sanitizeHtml(booking.email)
  const safeHomeTeam = sanitizeHtml(booking.match.homeTeam)
  const safeAwayTeam = sanitizeHtml(booking.match.awayTeam)
  const safeCompetition = sanitizeHtml(booking.match.competition || 'Match')
  const safeVenue = sanitizeHtml(booking.match.venue || 'TBD')
  
  const matchDate = new Date(booking.match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Ticket Booking - ${safeBookingId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1A1A1A 0%, #E6BB29 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎫 New Ticket Booking</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Booking ID: <strong>${safeBookingId}</strong></p>
      </div>
      
      <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
        <h2 style="color: #1A1A1A; margin-top: 0;">Customer Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px;">Name:</td>
            <td style="padding: 8px 0;"><strong>${safeName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #E6BB29;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Quantity:</td>
            <td style="padding: 8px 0;"><strong>${booking.quantity} ticket(s)</strong></td>
          </tr>
        </table>

        <h2 style="color: #1A1A1A; margin-top: 30px;">Match Information</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 15px;">
          <p style="margin: 0 0 10px; font-size: 18px; font-weight: bold;">
            ${safeHomeTeam} vs ${safeAwayTeam}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Competition:</strong> ${safeCompetition}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Date & Time:</strong> ${formattedDate}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Venue:</strong> ${safeVenue}
          </p>
        </div>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>Remaining Tickets:</strong> ${booking.newAvailability} available
          </p>
        </div>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #eee; border-top: none;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          This is an automated notification from the Paro FC booking system.
        </p>
      </div>
    </body>
    </html>
  `
}

function generateBookingEmailHtml(booking: {
  bookingId: string
  name: string
  email: string
  quantity: number
  match: {
    homeTeam: string
    awayTeam: string
    competition?: string
    date: string
    venue?: string
  }
}): string {
  const safeBookingId = sanitizeHtml(booking.bookingId)
  const safeName = sanitizeHtml(booking.name)
  const safeEmail = sanitizeHtml(booking.email)
  const safeHomeTeam = sanitizeHtml(booking.match.homeTeam)
  const safeAwayTeam = sanitizeHtml(booking.match.awayTeam)
  const safeCompetition = sanitizeHtml(booking.match.competition || 'Match')
  const safeVenue = sanitizeHtml(booking.match.venue || 'TBD')
  
  const matchDate = new Date(booking.match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ticket Booking Confirmation - ${safeBookingId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1A1A1A 0%, #E6BB29 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎫 Ticket Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Booking ID: <strong>${safeBookingId}</strong></p>
      </div>
      
      <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
        <h2 style="color: #1A1A1A; margin-top: 0;">Booking Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px;">Name:</td>
            <td style="padding: 8px 0;"><strong>${safeName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #E6BB29;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Quantity:</td>
            <td style="padding: 8px 0;"><strong>${booking.quantity} ticket(s)</strong></td>
          </tr>
        </table>

        <h2 style="color: #1A1A1A; margin-top: 30px;">Match Information</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 15px;">
          <p style="margin: 0 0 10px; font-size: 18px; font-weight: bold;">
            ${safeHomeTeam} vs ${safeAwayTeam}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Competition:</strong> ${safeCompetition}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Date & Time:</strong> ${formattedDate}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Venue:</strong> ${safeVenue}
          </p>
        </div>

        <div style="background: #E6BB29; color: #1A1A1A; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
          <p style="margin: 0; font-size: 16px; font-weight: bold;">
            Your booking has been confirmed! Please arrive at the venue on time.
          </p>
        </div>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #eee; border-top: none;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          If you have any questions, please contact us at <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}" style="color: #E6BB29;">${EMAIL_CONFIG.SUPPORT_EMAIL}</a>
        </p>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request
    const validationResult = BookingRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { matchId, name, email, quantity } = validationResult.data

    const readClient = getReadClient()
    
    // Check if API token is configured
    if (!process.env.SANITY_API_TOKEN) {
      console.error('SANITY_API_TOKEN not configured')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const writeClient = getWriteClient()

    // Fetch match to check availability
    const match = await readClient.fetch(
      `*[_type == "match" && _id == $matchId][0] {
        _id,
        homeTeam,
        awayTeam,
        competition,
        date,
        venue,
        hasTickets,
        ticketAvailability
      }`,
      { matchId }
    )

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    if (!match.hasTickets) {
      return NextResponse.json(
        { error: 'Tickets are not available for this match' },
        { status: 400 }
      )
    }

    const available = match.ticketAvailability ?? 0
    if (available < quantity) {
      return NextResponse.json(
        { error: `Only ${available} ticket(s) available. You requested ${quantity}.` },
        { status: 400 }
      )
    }

    // Generate booking ID
    const bookingId = generateBookingId()

    // Create booking document in Sanity
    let bookingDoc
    try {
      bookingDoc = await writeClient.create({
        _type: 'booking',
        match: {
          _type: 'reference',
          _ref: matchId,
        },
        name: sanitizeHtml(name),
        email: sanitizeHtml(email),
        quantity,
        bookingId,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      })
    } catch (createError: any) {
      console.error('Failed to create booking:', createError)
      if (createError.statusCode === 403 || createError.message?.includes('permission')) {
        return NextResponse.json(
          { error: 'Server configuration error. Please ensure SANITY_API_TOKEN has write permissions. See SANITY_API_TOKEN_SETUP.md for setup instructions.' },
          { status: 500 }
        )
      }
      throw createError
    }

    // Update match availability
    const newAvailability = available - quantity
    let availabilityUpdated = false
    try {
      await writeClient
        .patch(matchId)
        .set({ ticketAvailability: newAvailability })
        .commit()
      availabilityUpdated = true
    } catch (patchError: any) {
      console.error('Failed to update match availability:', patchError)
      // Booking was created but availability update failed - log but don't fail the request
      // The booking is still valid
      if (patchError.statusCode === 403 || patchError.message?.includes('permission')) {
        console.warn('Could not update match availability - check SANITY_API_TOKEN permissions')
      }
    }

    // Send confirmation emails
    const resend = getResend()
    if (resend) {
      try {
        // Send confirmation email to customer
        await resend.emails.send({
          from: EMAIL_CONFIG.SUPPORT_EMAIL,
          to: email,
          subject: `🎫 Ticket Booking Confirmed - ${bookingId}`,
          html: generateBookingEmailHtml({
            bookingId,
            name,
            email,
            quantity,
            match: {
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              competition: match.competition,
              date: match.date,
              venue: match.venue,
            },
          }),
        })

        // Send notification email to admin
        await resend.emails.send({
          from: EMAIL_CONFIG.SUPPORT_EMAIL,
          to: EMAIL_CONFIG.ADMIN_EMAIL,
          subject: `🎫 New Ticket Booking - ${bookingId}`,
          html: generateAdminBookingEmailHtml({
            bookingId,
            name,
            email,
            quantity,
            match: {
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              competition: match.competition,
              date: match.date,
              venue: match.venue,
            },
            newAvailability: availabilityUpdated ? newAvailability : available,
          }),
        })
      } catch (emailError) {
        console.error('Failed to send booking emails:', emailError)
        // Don't fail the booking if email fails
      }
    } else {
      console.log('Emails not sent - RESEND_API_KEY not configured')
      console.log('Booking details:', JSON.stringify({
        bookingId,
        name,
        email,
        quantity,
        match: {
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          competition: match.competition,
          date: match.date,
          venue: match.venue,
        },
      }, null, 2))
    }

    return NextResponse.json({
      success: true,
      bookingId,
      booking: {
        _id: bookingDoc._id,
        bookingId,
        name,
        email,
        quantity,
        matchId,
      },
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking. Please try again.' },
      { status: 500 }
    )
  }
}

