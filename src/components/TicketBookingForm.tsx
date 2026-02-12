"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Ticket, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useRouter } from "next/navigation"

interface TicketBookingFormProps {
  matchId: string
  matchTitle: string
  availability: number
}

export function TicketBookingForm({ matchId, matchTitle, availability }: TicketBookingFormProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    quantity?: string
  }>({})

  const validateForm = () => {
    const errors: typeof fieldErrors = {}
    let isValid = true

    if (!name.trim()) {
      errors.name = "Name is required"
      isValid = false
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
      isValid = false
    }

    if (!email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    if (quantity < 1) {
      errors.quantity = "Quantity must be at least 1"
      isValid = false
    } else if (quantity > availability) {
      errors.quantity = `Only ${availability} ticket(s) available`
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          name: name.trim(),
          email: email.trim(),
          quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to book tickets")
      }

      // Redirect to success page with booking ID
      router.push(`/bookings/success?bookingId=${data.bookingId}&match=${encodeURIComponent(matchTitle)}&quantity=${quantity}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, availability))
    setQuantity(newQuantity)
    if (fieldErrors.quantity) {
      setFieldErrors((prev) => ({ ...prev, quantity: undefined }))
    }
  }

  if (availability <= 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-white/80">
            <AlertCircle className="w-5 h-5" />
            <p className="text-base">Tickets are sold out for this match.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Book Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Availability Display */}
          <div className="bg-barca-gold/20 border border-barca-gold/30 rounded-lg p-4">
            <p className="text-sm text-white/90 mb-1">Tickets Available</p>
            <p className="text-2xl font-bold text-barca-gold">{availability}</p>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: undefined }))
                }
              }}
              className={`w-full h-11 px-4 rounded-md bg-white/10 border ${
                fieldErrors.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/20 focus:border-barca-gold"
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-barca-gold focus:ring-offset-2 focus:ring-offset-transparent transition-colors`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {fieldErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }))
                }
              }}
              className={`w-full h-11 px-4 rounded-md bg-white/10 border ${
                fieldErrors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/20 focus:border-barca-gold"
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-barca-gold focus:ring-offset-2 focus:ring-offset-transparent transition-colors`}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Quantity Field */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-white mb-2">
              Quantity <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isSubmitting}
                className="w-11 h-11 rounded-md bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-barca-gold transition-colors flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max={availability}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1
                  handleQuantityChange(value)
                }}
                className={`flex-1 h-11 px-4 rounded-md bg-white/10 border ${
                  fieldErrors.quantity
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/20 focus:border-barca-gold"
                } text-white text-center focus:outline-none focus:ring-2 focus:ring-barca-gold focus:ring-offset-2 focus:ring-offset-transparent transition-colors`}
                disabled={isSubmitting}
                aria-invalid={!!fieldErrors.quantity}
                aria-describedby={fieldErrors.quantity ? "quantity-error" : undefined}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= availability || isSubmitting}
                className="w-11 h-11 rounded-md bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-barca-gold transition-colors flex items-center justify-center"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            {fieldErrors.quantity && (
              <p id="quantity-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.quantity}
              </p>
            )}
            <p className="mt-1 text-xs text-white/60">
              Maximum {availability} ticket(s) available
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
              <p className="text-sm text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || availability <= 0}
            className="w-full h-12 bg-barca-gold text-dark-charcoal hover:bg-barca-gold/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-barca-gold focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4 mr-2" />
                Book {quantity} Ticket{quantity !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

