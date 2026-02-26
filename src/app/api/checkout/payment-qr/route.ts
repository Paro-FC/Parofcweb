import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

const PRODUCT_PAYMENT_QR_QUERY = `*[_type == "product" && _id == $id][0]{ "paymentQrCodeUrl": paymentQrCode.asset->url }`

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  if (!productId?.trim()) {
    return NextResponse.json({ paymentQrCodeUrl: null })
  }
  try {
    const data = await client.fetch<{ paymentQrCodeUrl?: string | null }>(
      PRODUCT_PAYMENT_QR_QUERY,
      { id: productId.trim() }
    )
    return NextResponse.json({
      paymentQrCodeUrl: data?.paymentQrCodeUrl ?? null,
    })
  } catch {
    return NextResponse.json({ paymentQrCodeUrl: null })
  }
}
