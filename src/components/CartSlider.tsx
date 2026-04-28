"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  MinusSignIcon,
  PlusSignIcon,
  ShoppingBag01Icon,
  Delete02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export function CartSlider() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
  } = useCart();

  const formatPrice = (price: number, currency: string) => {
    if (currency === "BTN") return `Nu. ${price.toLocaleString()}`;
    if (currency === "USD") return `$${price.toLocaleString()}`;
    if (currency === "EUR") return `€${price.toLocaleString()}`;
    return `${price.toLocaleString()} ${currency}`;
  };

  const itemCount = getItemCount();

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-dark-charcoal z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-end px-5 h-14 flex-shrink-0">
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <div className="h-px bg-white/5" />

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-5">
                  <HugeiconsIcon
                    icon={ShoppingBag01Icon}
                    size={32}
                    className="text-white/10 mb-3"
                  />
                  <h3 className="text-sm font-bold text-white/60 mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-white/30 mb-6">
                    Add some items to get started.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-parofc-red text-white px-5 py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-parofc-red/80 transition-colors cursor-pointer"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <div className="py-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item._id}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.03 }}
                      className="flex gap-4 px-5 py-4"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-20 bg-white/5 rounded flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h4 className="text-xs font-bold text-white/80 truncate leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-2xs text-white/30 mt-0.5">
                          Size: {item.size}
                        </p>
                        <p className="text-xs font-bold text-parofc-gold mt-1">
                          {formatPrice(
                            item.salePrice || item.price,
                            item.currency,
                          )}
                        </p>

                        {/* Quantity + Remove */}
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.size,
                                  item.quantity - 1,
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center border border-white/10 text-white/40 hover:border-white/30 hover:text-white transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <HugeiconsIcon icon={MinusSignIcon} size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.size,
                                  item.quantity + 1,
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center border border-white/10 text-white/40 hover:border-white/30 hover:text-white transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <HugeiconsIcon icon={PlusSignIcon} size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item._id, item.size)}
                            className="text-white/20 hover:text-parofc-red transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 px-5 py-5 space-y-4">
                {/* Subtotal */}
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-white/30 uppercase tracking-wider font-bold">
                    Subtotal
                  </span>
                  <span className="text-lg font-black text-parofc-gold tabular-nums">
                    {formatPrice(getSubtotal(), items[0]?.currency || "BTN")}
                  </span>
                </div>
                <p className="text-2xs text-white/20">
                  Shipping calculated at checkout.
                </p>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-12 bg-parofc-red text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-parofc-red/80 transition-colors cursor-pointer"
                >
                  Checkout
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-2xs font-bold text-white/30 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {/* Bottom accent */}
            <div className="h-px bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
