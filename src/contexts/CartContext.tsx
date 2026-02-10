'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CART_STORAGE_KEY } from '@/lib/constants'

export interface CartItem {
  _id: string
  name: string
  slug: string
  image: string
  collection: string
  price: number
  currency: string
  salePrice?: number
  size: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error('Error parsing cart data:', e)
          // Clear corrupted data
          localStorage.removeItem(CART_STORAGE_KEY)
        }
      }
    } catch (e) {
      // Handle localStorage access errors (private browsing, etc.)
      if (e instanceof DOMException) {
        console.warn('localStorage not available:', e.message)
      } else {
        console.error('Error loading cart:', e)
      }
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (e) {
        if (e instanceof DOMException) {
          if (e.name === 'QuotaExceededError') {
            console.error('Cart storage quota exceeded. Clearing old items...')
            // Try to clear and save again with current items only
            try {
              localStorage.removeItem(CART_STORAGE_KEY)
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
            } catch (retryError) {
              console.error('Failed to save cart after clearing:', retryError)
            }
          } else {
            console.warn('localStorage not available:', e.message)
          }
        } else {
          console.error('Error saving cart:', e)
        }
      }
    }
  }, [items, isHydrated])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i._id === item._id && i.size === item.size
      )
      
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += item.quantity
        return updated
      }
      
      return [...prev, item]
    })
  }

  const removeItem = (id: string, size: string) => {
    setItems((prev) => prev.filter((item) => !(item._id === id && item.size === size)))
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id, size)
      return
    }
    
    setItems((prev) =>
      prev.map((item) =>
        item._id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.salePrice || item.price
      return total + price * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

