import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "../index.css";
import { SanityLive } from "@/sanity/lib/live";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PARTNERS_QUERY,
  LATEST_TICKETS_MATCH_QUERY,
} from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Paro FC - Official Website",
  description: "Paro FC Official Website",
  icons: {
    icon: "/assets/logo.webp",
    apple: "/assets/logo.webp",
    shortcut: "/assets/logo.webp",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch partners for footer and latest match for TopNav
  const [partnersResult, matchResult] = await Promise.all([
    sanityFetch({ query: PARTNERS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: LATEST_TICKETS_MATCH_QUERY }).catch(() => ({
      data: null,
    })),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConditionalLayout
          partners={(partnersResult.data as any) || []}
          latestMatch={(matchResult.data as any) || null}
        >
          {children}
        </ConditionalLayout>
        <SanityLive />
        <Script
          src="https://cdn.jotfor.ms/agent/embedjs/019c65f6986573f7bac29fc192091672fdef/embed.js"
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  );
}
