import type { Metadata } from 'next'
import '../index.css'
import { SanityLive } from '@/sanity/lib/live'
import { ConditionalLayout } from '@/components/ConditionalLayout'
import { sanityFetch } from '@/sanity/lib/live'
import { PARTNERS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Paro FC - Official Website',
  description: 'Paro FC Official Website',
  icons: {
    icon: '/assets/logo.webp',
    apple: '/assets/logo.webp',
    shortcut: '/assets/logo.webp',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch partners for footer (only if not on studio route)
  const partnersResult = await sanityFetch({ query: PARTNERS_QUERY }).catch(() => ({ data: [] }))

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConditionalLayout partners={(partnersResult.data as any) || []}>
          {children}
        </ConditionalLayout>
        <SanityLive />
      </body>
    </html>
  )
}
