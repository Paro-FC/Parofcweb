'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, ChevronDown, ShoppingBag } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PRODUCTS_QUERY } from '@/sanity/lib/queries'
import type { SanityImageSource } from '@sanity/image-url'

interface Product {
  _id: string
  name: string
  slug: string
  image: SanityImageSource | string
  hoverImage?: SanityImageSource | string
  collection: string
  price: number
  currency: string
  salePrice?: number
  badge?: string
  sizes?: string[]
  inStock: boolean
  _createdAt?: string
}

const collectionLabels: Record<string, string> = {
  'home-kit': 'HOME KIT',
  'away-kit': 'AWAY KIT',
  'third-kit': 'THIRD KIT',
  'training': 'TRAINING',
  'retro': 'RETRO COLLECTION',
  'fan': 'FAN COLLECTION',
  'accessories': 'ACCESSORIES',
}

const badgeStyles: Record<string, string> = {
  'new': 'bg-green-500 text-white',
  'exclusive': 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
  'sale': 'bg-red-500 text-white',
  'limited': 'bg-amber-500 text-white',
  'bestseller': 'bg-barca-blue text-white',
}

const badgeLabels: Record<string, string> = {
  'new': 'NEW',
  'exclusive': '⭐ PARO FC EXCLUSIVE',
  'sale': 'SALE',
  'limited': 'LIMITED EDITION',
  'bestseller': 'BEST SELLER',
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'BTN') {
      return `Nu. ${price.toLocaleString()}`
    }
    return `$${price.toFixed(2)} USD`
  }

  const getImageUrl = (image: SanityImageSource | string) => {
    if (typeof image === 'string') {
      return image
    }
    try {
      return urlFor(image).width(600).height(750).url()
    } catch {
      return '/images/placeholder-product.png'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          {/* Main Image */}
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered && product.hoverImage ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* Hover Image */}
          {product.hoverImage && (
            <Image
              src={getImageUrl(product.hoverImage)}
              alt={`${product.name} - alternate view`}
              fill
              className={`object-cover transition-all duration-500 absolute inset-0 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Collection Badge (top-left) */}
          {product.collection && (
            <div className="absolute top-3 left-3">
              <span className="bg-barca-blue/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider">
                {collectionLabels[product.collection] || product.collection.toUpperCase()}
              </span>
            </div>
          )}

          {/* Special Badge (bottom-left) */}
          {product.badge && (
            <div className="absolute bottom-3 left-3">
              <span className={`${badgeStyles[product.badge]} text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider`}>
                {badgeLabels[product.badge]}
              </span>
            </div>
          )}

          {/* Quick Add Button (appears on hover) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute bottom-3 right-3"
          >
            <button className="bg-white/95 hover:bg-white text-barca-blue p-2.5 rounded-full shadow-lg transition-all hover:scale-110">
              <ShoppingBag size={18} />
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Collection Label */}
          {product.collection && (
            <p className="text-barca-blue text-xs font-semibold tracking-wider uppercase">
              {collectionLabels[product.collection] || product.collection.toUpperCase()}
            </p>
          )}
          
          {/* Product Name */}
          <h3 className="text-gray-900 font-medium text-sm leading-snug line-clamp-2 group-hover:text-barca-blue transition-colors">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-bold">
                  {formatPrice(product.salePrice, product.currency)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(product.price, product.currency)}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-bold">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>('newest')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await client.fetch(PRODUCTS_QUERY)
        console.log('Fetched products:', data)
        if (data && Array.isArray(data)) {
          console.log(`Found ${data.length} products`)
          setProducts(data)
        } else {
          console.warn('No products data or invalid format:', data)
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredProducts = products.filter(product => {
    if (!product) return false
    if (selectedCollection === 'all') return true
    return product.collection === selectedCollection
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        // Sort by creation date (newest first)
        if (a._createdAt && b._createdAt) {
          return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        }
        // If one doesn't have _createdAt, prioritize the one that does
        if (a._createdAt && !b._createdAt) return -1
        if (!a._createdAt && b._createdAt) return 1
        return 0
      case 'price-low':
        const priceA = a.salePrice ?? a.price ?? 0
        const priceB = b.salePrice ?? b.price ?? 0
        return priceA - priceB
      case 'price-high':
        const priceAHigh = a.salePrice ?? a.price ?? 0
        const priceBHigh = b.salePrice ?? b.price ?? 0
        return priceBHigh - priceAHigh
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      default:
        return 0
    }
  })

  const collections = [
    { value: 'all', label: 'All Products' },
    { value: 'home-kit', label: 'Home Kit' },
    { value: 'away-kit', label: 'Away Kit' },
    { value: 'third-kit', label: 'Third Kit' },
    { value: 'training', label: 'Training' },
    { value: 'retro', label: 'Retro Collection' },
    { value: 'fan', label: 'Fan Collection' },
    { value: 'accessories', label: 'Accessories' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Close Button */}
      <Link
        href="/"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <X size={24} />
      </Link>

      {/* Fixed Header Section - Moves up on scroll */}
      <div className={`fixed left-0 right-0 bg-white z-40 transition-all duration-300 ${
        isScrolled ? 'top-0' : 'top-0 md:top-[150px]'
      }`}>
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black italic text-gray-900 tracking-tight"
            >
              SHOP
            </motion.h1>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="border-b border-gray-200 bg-white z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-barca-blue transition-colors"
            >
              <SlidersHorizontal size={18} />
              <span>FILTER AND SORT</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Product Count */}
            <span className="text-sm text-gray-500">
              {sortedProducts.length} products
            </span>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Collection Filter */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wider">COLLECTION</h3>
                    <div className="flex flex-wrap gap-2">
                      {collections.map((collection) => (
                        <button
                          key={collection.value}
                          onClick={() => setSelectedCollection(collection.value)}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                            selectedCollection === collection.value
                              ? 'bg-barca-blue text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {collection.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wider">SORT BY</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'newest', label: 'Newest' },
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                        { value: 'name', label: 'Name A-Z' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                            sortBy === option.value
                              ? 'bg-barca-blue text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>

      {/* Products Grid */}
      <div className={`max-w-7xl mx-auto px-4 py-8 transition-all duration-300 ${
        isScrolled ? 'pt-[180px] md:pt-[180px]' : 'pt-[180px] md:pt-[300px]'
      }`}>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-lg" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">
              {products.length === 0 
                ? 'No products found. Add products in Sanity Studio to see them here.'
                : `No products found in "${collections.find(c => c.value === selectedCollection)?.label || 'this collection'}".`}
            </p>
            {products.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Make sure products have the required fields: name, slug, image, price, currency, collection, and inStock.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

