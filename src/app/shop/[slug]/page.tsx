'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ShoppingBag, Share2, Check, Truck, RotateCcw, Shield } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PRODUCT_QUERY, PRODUCTS_QUERY } from '@/sanity/lib/queries'
import { useParams } from 'next/navigation'
import type { SanityImageSource } from '@sanity/image-url'
import { useCart } from '@/contexts/CartContext'

interface Category {
  _id: string
  title: string
  slug: string
  image?: SanityImageSource | string
}

interface Product {
  _id: string
  name: string
  slug: string
  image: SanityImageSource | string
  hoverImage?: SanityImageSource | string
  category: Category | null
  price: number
  currency: string
  salePrice?: number
  badge?: string
  sizes?: string[]
  inStock: boolean
  description?: string
  assemblyRequired?: boolean
  color?: string
  dimensions?: string
  featured?: boolean
  images?: Array<{ _key: string; _type: string; asset: { _ref: string; _type: string } }>
  material?: string
  stock?: number
}

const badgeStyles: Record<string, string> = {
  'new': 'bg-green-500 text-white',
  'exclusive': 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
  'sale': 'bg-red-500 text-white',
  'limited': 'bg-amber-500 text-white',
  'bestseller': 'bg-barca-gold text-dark-charcoal',
}

const badgeLabels: Record<string, string> = {
  'new': 'NEW',
  'exclusive': '⭐ PARO FC EXCLUSIVE',
  'sale': 'SALE',
  'limited': 'LIMITED EDITION',
  'bestseller': 'BEST SELLER',
}


function RelatedProductCard({ product }: { product: Product }) {
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
      return urlFor(image).width(400).height(500).url()
    } catch {
      return '/images/placeholder-product.png'
    }
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-lg">
        <Image
          src={getImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <div className="absolute top-2 left-2">
            <span className={`${badgeStyles[product.badge]} text-[10px] font-bold px-2 py-1 rounded-full`}>
              {badgeLabels[product.badge]}
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        {product.category?.title && (
          <p className="text-barca-gold text-xs font-semibold tracking-wider uppercase">
            {product.category.title}
          </p>
        )}
        <h3 className="text-gray-900 text-sm font-medium line-clamp-2 group-hover:text-barca-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-900 font-bold text-sm">
          {formatPrice(product.salePrice || product.price, product.currency)}
        </p>
      </div>
    </Link>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem, setIsCartOpen } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSizeError, setShowSizeError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const [productData, allProducts] = await Promise.all([
          client.fetch(PRODUCT_QUERY, { slug }),
          client.fetch(PRODUCTS_QUERY)
        ])
        
        if (productData) {
          setProduct(productData)
          // Filter related products (same category, excluding current)
          const related = allProducts
            .filter((p: Product) => p._id !== productData._id && p.category?._id === productData.category?._id)
            .slice(0, 4)
          // If no related products in same category, show any other products
          if (related.length === 0) {
            const otherProducts = allProducts
              .filter((p: Product) => p._id !== productData._id)
              .slice(0, 4)
            setRelatedProducts(otherProducts)
          } else {
            setRelatedProducts(related)
          }
        } else {
          setProduct(null)
          setRelatedProducts([])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
        setRelatedProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

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
      return urlFor(image).width(800).height(1000).url()
    } catch {
      return '/images/placeholder-product.png'
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setShowSizeError(true)
      return
    }
    
    const imageUrl = getImageUrl(product.image)
    
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      image: imageUrl,
      price: product.price,
      currency: product.currency,
      salePrice: product.salePrice,
      size: selectedSize || 'One Size',
      quantity: 1,
    })
    
    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
      setIsCartOpen(true)
    }, 500)
  }

  const images = product ? [product.image, product.hoverImage].filter(Boolean) : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[4/5] bg-gray-200 animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoading && !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-barca-gold text-dark-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-barca-gold/90 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Floating Close Button */}
      <Link
        href="/shop"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 lg:bottom-24"
      >
        <X size={24} />
      </Link>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-lg">
                <Image
                  src={getImageUrl(images[currentImageIndex] || product.image)}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

              {/* Category Badge */}
              {product.category?.title && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-barca-gold/90 text-dark-charcoal text-xs font-bold px-4 py-2 rounded-full tracking-wider">
                    {product.category.title}
                  </span>
                </div>
              )}

              {/* Special Badge */}
              {product.badge && (
                <div className="absolute top-4 right-4">
                  <span className={`${badgeStyles[product.badge]} text-xs font-bold px-4 py-2 rounded-full tracking-wider`}>
                    {badgeLabels[product.badge]}
                  </span>
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft size={24} className="text-gray-900" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight size={24} className="text-gray-900" />
                  </button>
                </>
              )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-barca-gold' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img || product.image)}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-[160px] lg:self-start">
            <div className="space-y-6">
            {/* Category */}
            {product.category?.title && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-barca-gold/20 text-barca-gold text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full">
                  {product.category.title}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-barca-red">
                    {formatPrice(product.salePrice, product.currency)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price, product.currency)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {typeof product.description === 'string' 
                    ? product.description 
                    : 'Product description coming soon...'}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Select Size
                  </label>
                  {showSizeError && (
                    <span className="text-sm text-red-500">Please select a size</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size)
                        setShowSizeError(false)
                      }}
                      className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-barca-gold text-dark-charcoal ring-2 ring-barca-gold ring-offset-2'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {!product.inStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">Out of Stock</p>
                <p className="text-red-600 text-sm mt-1">This product is currently unavailable.</p>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || addedToCart}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                product.inStock
                  ? addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-barca-gold text-dark-charcoal hover:bg-barca-gold/90'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={20} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  {product.inStock ? 'ADD TO CART' : 'SOLD OUT'}
                </>
              )}
            </button>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: `Check out ${product.name} on Paro FC Shop!`,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="flex-1 py-3 px-4 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-barca-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                  <p className="text-sm text-gray-600">On orders over Nu. 5,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={20} className="text-barca-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-barca-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Authentic Products</h3>
                  <p className="text-sm text-gray-600">100% official Paro FC merchandise</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 mt-16 pt-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Add to Cart (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-lg transition-all ${
            product.inStock
              ? addedToCart
                ? 'bg-green-500 text-white'
                : 'bg-barca-gold text-dark-charcoal'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {addedToCart ? (
            <>
              <Check size={20} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={20} />
              {product.inStock ? 'ADD TO CART' : 'SOLD OUT'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
