'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Truck, Shield, CreditCard, CheckCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

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

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({})
  
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bhutan',
    notes: '',
  })

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'BTN') return `Nu. ${price.toLocaleString()}`
    if (currency === 'USD') return `$${price.toLocaleString()}`
    if (currency === 'EUR') return `€${price.toLocaleString()}`
    return `${price.toLocaleString()} ${currency}`
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {}
    
    if (!customerDetails.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!customerDetails.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!customerDetails.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!customerDetails.address.trim()) newErrors.address = 'Address is required'
    if (!customerDetails.city.trim()) newErrors.city = 'City is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCustomerDetails(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof CustomerDetails]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (items.length === 0) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerDetails,
          items: items,
          subtotal: getSubtotal(),
          currency: items[0]?.currency || 'BTN',
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setOrderId(data.orderId)
        setOrderComplete(true)
        clearCart()
      } else {
        alert(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Order Success View
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">Thank you for your order.</p>
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono font-semibold">{orderId}</span>
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to <strong>{customerDetails.email}</strong>.
                Our team will contact you shortly to confirm your order and arrange delivery.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-barca-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-barca-blue/90 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Empty Cart View
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Link
              href="/shop"
              className="inline-block bg-barca-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-barca-blue/90 transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const shipping = 150 // Fixed shipping for Bhutan
  const total = subtotal + shipping
  const currency = items[0]?.currency || 'BTN'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/shop" className="flex items-center gap-2 text-gray-600 hover:text-barca-blue transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Shop</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-barca-blue text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerDetails.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerDetails.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+975 17XXXXXX"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-barca-blue text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Street address"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={customerDetails.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dzongkhag/State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={customerDetails.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all"
                        placeholder="Dzongkhag/State"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={customerDetails.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all"
                        placeholder="Postal code"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={customerDetails.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all"
                      >
                        <option value="Bhutan">Bhutan</option>
                        <option value="India">India</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-barca-blue text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Additional Notes (Optional)
                </h2>
                
                <textarea
                  name="notes"
                  value={customerDetails.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barca-blue focus:border-transparent transition-all resize-none"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield size={20} className="text-green-600" />
                  <span className="text-sm">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck size={20} className="text-barca-blue" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard size={20} className="text-purple-600" />
                  <span className="text-sm">Cash on Delivery</span>
                </div>
              </div>

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-barca-gold text-barca-blue py-4 rounded-lg font-bold text-lg hover:bg-barca-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `PLACE ORDER • ${formatPrice(total, currency)}`
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item._id}-${item.size}`} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                      <span className="absolute -top-1 -right-1 bg-barca-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatPrice((item.salePrice || item.price) * item.quantity, item.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatPrice(shipping, currency)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-barca-blue">{formatPrice(total, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Note */}
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Payment Method:</strong> Cash on Delivery (COD). You will pay when your order arrives.
                </p>
              </div>

              {/* Submit Button (Desktop) */}
              <button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="hidden lg:flex w-full mt-6 bg-barca-gold text-barca-blue py-4 rounded-lg font-bold text-lg hover:bg-barca-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'PLACE ORDER'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

