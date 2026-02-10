/**
 * Type definitions for Sanity CMS data structures
 */

// Base Sanity document structure
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt?: string
  _updatedAt?: string
  _rev?: string
}

// Slug structure used across Sanity
export interface SanitySlug {
  current: string
  _type: 'slug'
}

// Image reference structure
export interface SanityImageReference {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

// Portable Text block (simplified - can be expanded)
export type PortableText = Array<{
  _type: string
  [key: string]: any
}>

// News Article
export interface NewsItem extends SanityDocument {
  _type: 'news'
  title: string
  slug: SanitySlug
  publishedAt: string
  excerpt?: string
  body?: PortableText
  author?: string
  image?: SanityImageReference
  badge?: string
  category?: string
}

// Product
export interface Product extends SanityDocument {
  _type: 'product'
  name: string
  slug: SanitySlug
  image?: SanityImageReference
  hoverImage?: SanityImageReference
  price: number
  currency: string
  salePrice?: number
  badge?: string
  sizes?: string[]
  inStock?: boolean
  _createdAt?: string
}

// Player
export interface Player extends SanityDocument {
  _type: 'player'
  firstName: string
  lastName: string
  slug: SanitySlug
  position: string
  number?: number
  image?: SanityImageReference
  bio?: PortableText
  dateOfBirth?: string
  nationality?: string
  height?: number
  weight?: number
}

// Match
export interface Match extends SanityDocument {
  _type: 'match'
  title: string
  slug: SanitySlug
  date: string
  competition?: string
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  venue?: string
  status?: string
}

// Standing
export interface Standing extends SanityDocument {
  _type: 'standing'
  competition: string
  season: string
  teams: Array<{
    position: number
    teamName: string
    teamLogo?: string
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    points: number
    form?: ('W' | 'D' | 'L')[]
  }>
}

// Story
export interface Story extends SanityDocument {
  _type: 'story'
  title: string
  slug: SanitySlug
  excerpt?: string
  image?: SanityImageReference
  publishedAt?: string
}

// Trophy
export interface Trophy extends SanityDocument {
  _type: 'trophy'
  name: string
  year: string
  image?: SanityImageReference
  competition?: string
}

// Partner
export interface Partner extends SanityDocument {
  _type: 'partner'
  name: string
  logo: string
  url: string
  category?: string
}

// Photo
export interface Photo extends SanityDocument {
  _type: 'photo'
  title?: string
  image: SanityImageReference
  category?: string
  date?: string
}

