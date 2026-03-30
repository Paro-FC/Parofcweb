'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
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

  const itemCount = getItemCount()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60]"
          />

          {/* Cart Slider */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-dark-charcoal uppercase tracking-wider">
                  Cart
                </h2>
                {itemCount > 0 && (
                  <span className="bg-dark-charcoal text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-dark-charcoal transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-5">
                  <ShoppingBag size={32} className="text-gray-200 mb-3" />
                  <h3 className="text-sm font-bold text-dark-charcoal mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">
                    Add some items to get started.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-dark-charcoal text-white px-5 py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-barca-red transition-colors cursor-pointer"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <div
                      key={`${item._id}-${item.size}`}
                      className="flex gap-4 px-5 py-4"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h4 className="text-xs font-bold text-dark-charcoal truncate leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Size: {item.size}
                        </p>
                        <p className="text-xs font-bold text-dark-charcoal mt-1">
                          {formatPrice(item.salePrice || item.price, item.currency)}
                        </p>

                        {/* Quantity + Remove */}
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-dark-charcoal hover:text-dark-charcoal transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-dark-charcoal tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-dark-charcoal hover:text-dark-charcoal transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item._id, item.size)}
                            className="text-gray-300 hover:text-barca-red transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
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
              <div className="border-t border-gray-100 px-5 py-5 space-y-4">
                {/* Subtotal */}
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                    Subtotal
                  </span>
                  <span className="text-lg font-black text-dark-charcoal tabular-nums">
                    {formatPrice(getSubtotal(), items[0]?.currency || 'BTN')}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Shipping calculated at checkout.
                </p>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-12 bg-dark-charcoal text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-barca-red transition-colors cursor-pointer"
                >
                  Checkout
                  <ArrowRight size={14} />
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-dark-charcoal transition-colors cursor-pointer uppercase tracking-wider"
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
