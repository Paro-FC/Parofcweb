import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'
import { SHIPPING_COST_BTN, EMAIL_CONFIG } from '@/lib/constants'

// Initialize Resend lazily to avoid build-time errors
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - emails will not be sent')
    return null
  }
  return new Resend(apiKey)
}

interface CartItem {
  _id: string
  name: string
  slug: string
  image: string
  price: number
  currency: string
  salePrice?: number
  size: string
  quantity: number
}

interface CustomerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  notes: string
}

interface CheckoutRequest {
  customer: CustomerDetails
  items: CartItem[]
  subtotal: number
  currency: string
}

// Validation schema
const CartItemSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1).max(200),
  slug: z.string().min(1),
  image: z.string().url().or(z.string().startsWith('/')),
  price: z.number().positive(),
  currency: z.string().length(3),
  salePrice: z.number().positive().optional(),
  size: z.string().min(1).max(10),
  quantity: z.number().int().positive().max(100),
})

const CustomerDetailsSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255),
  phone: z.string().min(1).max(20).trim(),
  address: z.string().min(1).max(500).trim(),
  city: z.string().min(1).max(100).trim(),
  state: z.string().max(100).trim(),
  zipCode: z.string().max(20).trim(),
  country: z.string().min(1).max(100).trim(),
  notes: z.string().max(1000).trim().optional().default(''),
})

const CheckoutSchema = z.object({
  customer: CustomerDetailsSchema,
  items: z.array(CartItemSchema).min(1).max(50),
  subtotal: z.number().positive(),
  currency: z.string().length(3),
})

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PFC-${timestamp}-${random}`
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'BTN') return `Nu. ${price.toLocaleString()}`
  if (currency === 'USD') return `$${price.toLocaleString()}`
  if (currency === 'EUR') return `€${price.toLocaleString()}`
  return `${price.toLocaleString()} ${currency}`
}

// Sanitize string for HTML output
function sanitizeHtml(str: string): string {
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [] })
}

function generateAdminEmailHtml(order: {
  orderId: string
  customer: CustomerDetails
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  currency: string
}): string {
  // Sanitize all user inputs
  const safeOrderId = sanitizeHtml(order.orderId)
  const safeFirstName = sanitizeHtml(order.customer.firstName)
  const safeLastName = sanitizeHtml(order.customer.lastName)
  const safeEmail = sanitizeHtml(order.customer.email)
  const safePhone = sanitizeHtml(order.customer.phone)
  const safeAddress = sanitizeHtml(order.customer.address)
  const safeCity = sanitizeHtml(order.customer.city)
  const safeState = sanitizeHtml(order.customer.state || '')
  const safeZipCode = sanitizeHtml(order.customer.zipCode || '')
  const safeCountry = sanitizeHtml(order.customer.country)
  const safeNotes = sanitizeHtml(order.customer.notes || '')
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <span style="color: #666; font-size: 14px;">Size: ${item.size}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice((item.salePrice || item.price) * item.quantity, item.currency)}</td>
      </tr>
    `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - ${order.orderId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #004D98 0%, #A50044 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🛒 New Order Received!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Order ID: <strong>${safeOrderId}</strong></p>
      </div>
      
      <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
        <h2 style="color: #004D98; margin-top: 0;">Customer Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px;">Name:</td>
            <td style="padding: 8px 0;"><strong>${safeFirstName} ${safeLastName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #004D98;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${safePhone}" style="color: #004D98;">${safePhone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Address:</td>
            <td style="padding: 8px 0;">
              ${safeAddress}<br>
              ${safeCity}${safeState ? `, ${safeState}` : ''}<br>
              ${safeZipCode ? `${safeZipCode}, ` : ''}${safeCountry}
            </td>
          </tr>
          ${safeNotes ? `
          <tr>
            <td style="padding: 8px 0; color: #666;">Notes:</td>
            <td style="padding: 8px 0; background: #f9f9f9; padding: 12px; border-radius: 8px;">${safeNotes}</td>
          </tr>
          ` : ''}
        </table>

        <h2 style="color: #004D98; margin-top: 30px;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 4px 0; color: #666;">Subtotal:</td>
              <td style="padding: 4px 0; text-align: right;">${formatPrice(order.subtotal, order.currency)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #666;">Shipping:</td>
              <td style="padding: 4px 0; text-align: right;">${formatPrice(order.shipping, order.currency)}</td>
            </tr>
            <tr style="font-size: 18px; font-weight: bold;">
              <td style="padding: 12px 0 0; border-top: 2px solid #ddd;">Total:</td>
              <td style="padding: 12px 0 0; border-top: 2px solid #ddd; text-align: right; color: #004D98;">${formatPrice(order.total, order.currency)}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <strong>⚠️ Payment Method:</strong> Cash on Delivery (COD)
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #666; font-size: 14px;">
        <p style="margin: 0;">This is an automated email from Paro FC Shop.</p>
        <p style="margin: 10px 0 0;">© ${new Date().getFullYear()} Paro FC. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmailHtml(order: {
  orderId: string
  customer: CustomerDetails
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  currency: string
}): string {
  // Sanitize all user inputs
  const safeOrderId = sanitizeHtml(order.orderId)
  const safeFirstName = sanitizeHtml(order.customer.firstName)
  const safeLastName = sanitizeHtml(order.customer.lastName)
  const safeAddress = sanitizeHtml(order.customer.address)
  const safeCity = sanitizeHtml(order.customer.city)
  const safeState = sanitizeHtml(order.customer.state || '')
  const safeZipCode = sanitizeHtml(order.customer.zipCode || '')
  const safeCountry = sanitizeHtml(order.customer.country)
  const safePhone = sanitizeHtml(order.customer.phone)
  
  const itemsHtml = order.items
    .map(
      (item) => {
        const safeName = sanitizeHtml(item.name)
        const safeSize = sanitizeHtml(item.size)
        return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${safeName}</strong><br>
          <span style="color: #666; font-size: 14px;">Size: ${safeSize}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice((item.salePrice || item.price) * item.quantity, item.currency)}</td>
      </tr>
    `
      }
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${order.orderId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #004D98 0%, #A50044 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Thank you for your order, ${safeFirstName}!</p>
      </div>
      
      <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #666; margin: 0;">Your order ID is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #004D98; margin: 10px 0; font-family: monospace;">${safeOrderId}</p>
        </div>

        <h2 style="color: #004D98; margin-top: 0;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 4px 0; color: #666;">Subtotal:</td>
              <td style="padding: 4px 0; text-align: right;">${formatPrice(order.subtotal, order.currency)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #666;">Shipping:</td>
              <td style="padding: 4px 0; text-align: right;">${formatPrice(order.shipping, order.currency)}</td>
            </tr>
            <tr style="font-size: 18px; font-weight: bold;">
              <td style="padding: 12px 0 0; border-top: 2px solid #ddd;">Total:</td>
              <td style="padding: 12px 0 0; border-top: 2px solid #ddd; text-align: right; color: #004D98;">${formatPrice(order.total, order.currency)}</td>
            </tr>
          </table>
        </div>

        <h2 style="color: #004D98; margin-top: 30px;">Shipping Address</h2>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 0;">
          ${safeFirstName} ${safeLastName}<br>
          ${safeAddress}<br>
          ${safeCity}${safeState ? `, ${safeState}` : ''}<br>
          ${safeZipCode ? `${safeZipCode}, ` : ''}${safeCountry}<br>
          <strong>Phone:</strong> ${safePhone}
        </p>

        <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">
          <strong>💰 Payment Method:</strong> Cash on Delivery (COD)<br>
          <span style="color: #666; font-size: 14px;">You will pay ${formatPrice(order.total, order.currency)} when your order arrives.</span>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666;">Our team will contact you shortly to confirm your order and arrange delivery.</p>
          <p style="color: #666;">If you have any questions, please contact us at:</p>
          <p style="margin: 5px 0;"><a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}" style="color: #004D98;">${EMAIL_CONFIG.SUPPORT_EMAIL}</a></p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #666; font-size: 14px;">
        <p style="margin: 0;">Thank you for supporting Paro FC! 🔵🔴</p>
        <p style="margin: 10px 0 0;">© ${new Date().getFullYear()} Paro FC. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input with Zod schema
    const validationResult = CheckoutSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.issues.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const { customer, items, subtotal, currency } = validationResult.data

    const orderId = generateOrderId()
    const shipping = SHIPPING_COST_BTN // Fixed shipping for Bhutan
    const total = subtotal + shipping

    const orderData = {
      orderId,
      customer,
      items,
      subtotal,
      shipping,
      total,
      currency,
    }

    // Get Resend instance
    const resend = getResend()

    if (resend) {
      try {
        // Send email to admin
        await resend.emails.send({
          from: EMAIL_CONFIG.FROM,
          to: EMAIL_CONFIG.ADMIN_EMAIL,
          subject: `🛒 New Order #${orderId} - ${customer.firstName} ${customer.lastName}`,
          html: generateAdminEmailHtml(orderData),
        })

        // Send confirmation email to customer
        await resend.emails.send({
          from: EMAIL_CONFIG.FROM,
          to: customer.email,
          subject: `Order Confirmed! #${orderId} - Paro FC Shop`,
          html: generateCustomerEmailHtml(orderData),
        })
      } catch (emailError) {
        console.error('Failed to send emails:', emailError)
        // Continue even if emails fail - order is still placed
      }
    } else {
      console.log('Email not sent - RESEND_API_KEY not configured')
      console.log('Order details:', JSON.stringify(orderData, null, 2))
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully',
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}

