/**
 * Application-wide constants
 */

// Shipping costs
export const SHIPPING_COST_BTN = 150 // Fixed shipping cost for Bhutan (in BTN)

// Email configuration
export const EMAIL_CONFIG = {
  FROM: 'Paro FC Shop <onboarding@resend.dev>',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@parofc.com',
  SUPPORT_EMAIL: 'shop@parofc.com',
} as const

// Cart storage
export const CART_STORAGE_KEY = 'paro-fc-cart'

// Sanity configuration fallbacks (should be overridden by env vars)
export const SANITY_FALLBACKS = {
  PROJECT_ID: '4rd3jbsr',
  DATASET: 'production',
} as const

