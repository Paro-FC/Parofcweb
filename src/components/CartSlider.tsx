'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export function CartSlider() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, getSubtotal, getItemCount } = useCart()

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'BTN') return `Nu. ${price.toLocaleString()}`
    if (currency === 'USD') return `$${price.toLocaleString()}`
    if (currency === 'EUR') return `€${price.toLocaleString()}`
    return `${price.toLocaleString()} ${currency}`
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60]"
          />

          {/* Cart Slider */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingBag size={24} className="text-barca-blue" />
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                <span className="bg-barca-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {getItemCount()}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some items to get started!</p>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-barca-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-barca-blue/90 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item._id}-${item.size}`}
                      className="flex gap-4 bg-gray-50 rounded-lg p-3"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>
                        <p className="text-sm font-bold text-barca-blue mt-1">
                          {formatPrice(item.salePrice || item.price, item.currency)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-semibold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item._id, item.size)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(getSubtotal(), items[0]?.currency || 'BTN')}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-barca-gold text-barca-blue py-4 rounded-lg font-bold text-center block hover:bg-barca-gold/90 transition-colors"
                >
                  PROCEED TO CHECKOUT
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-sm text-gray-600 hover:text-barca-blue transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

