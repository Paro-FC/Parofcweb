import { NextRequest, NextResponse } from 'next/server'
import { getServerClient } from '@/sanity/lib/serverClient'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId')
    const file = formData.get('file')

    if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'A valid image file is required' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use JPEG, PNG, or WebP.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const client = getServerClient()
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, {
      filename: file.name || 'payment-proof.jpg',
      contentType: file.type,
    })

    await client.create({
      _type: 'paymentProof',
      orderId: orderId.trim(),
      paymentImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      uploadedAt: new Date().toISOString(),
    })

    const imageUrl = typeof (asset as { url?: string }).url === 'string' ? (asset as { url: string }).url : null
    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error('Upload payment error:', error)
    return NextResponse.json(
      { error: 'Failed to upload payment proof' },
      { status: 500 }
    )
  }
}
