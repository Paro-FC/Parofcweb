"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, Ticket, ArrowLeft, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const bookingId = searchParams.get("bookingId")
  const matchTitle = searchParams.get("match")
  const quantity = searchParams.get("quantity")

  useEffect(() => {
    if (!bookingId) {
      router.push("/")
    }
  }, [bookingId, router])

  const handleCopyBookingId = async () => {
    if (bookingId) {
      try {
        await navigator.clipboard.writeText(bookingId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  if (!bookingId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-charcoal via-dark-charcoal to-barca-gold/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white shadow-2xl border-0">
          <CardContent className="pt-12 pb-8 px-6 md:px-12">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-dark-charcoal mb-3">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-medium-grey">
                Your ticket booking has been successfully processed.
              </p>
            </div>

            {/* Booking ID */}
            <div className="bg-barca-gold/10 border-2 border-barca-gold rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-medium-grey mb-2">Booking ID</p>
                  <p className="text-2xl md:text-3xl font-bold text-dark-charcoal font-mono break-all">
                    {bookingId}
                  </p>
                </div>
                <button
                  onClick={handleCopyBookingId}
                  className="flex-shrink-0 w-12 h-12 rounded-lg bg-barca-gold hover:bg-barca-gold/90 text-dark-charcoal flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-barca-gold focus:ring-offset-2"
                  aria-label="Copy booking ID"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-sm text-green-600 text-center">Copied to clipboard!</p>
              )}
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-8">
              {matchTitle && (
                <div className="flex items-start gap-3 p-4 bg-light-grey/10 rounded-lg">
                  <Ticket className="w-5 h-5 text-barca-gold mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-medium-grey mb-1">Match</p>
                    <p className="text-base font-semibold text-dark-charcoal">{decodeURIComponent(matchTitle)}</p>
                  </div>
                </div>
              )}

              {quantity && (
                <div className="flex items-start gap-3 p-4 bg-light-grey/10 rounded-lg">
                  <Ticket className="w-5 h-5 text-barca-gold mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-medium-grey mb-1">Quantity</p>
                    <p className="text-base font-semibold text-dark-charcoal">
                      {quantity} ticket{quantity !== "1" ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-green-800 leading-relaxed">
                <strong>What's next?</strong> A confirmation email has been sent to your email address. 
                Please arrive at the venue on time with your booking ID.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/calendar"
                className="flex-1 h-12 bg-barca-gold text-dark-charcoal hover:bg-barca-gold/90 font-semibold rounded-md inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-barca-gold focus:ring-offset-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </Link>
              <Link
                href="/"
                className="flex-1 h-12 border border-medium-grey text-dark-charcoal hover:bg-light-gold/10 rounded-md inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-barca-gold focus:ring-offset-2"
              >
                Go to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-dark-charcoal via-dark-charcoal to-barca-gold/20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}

