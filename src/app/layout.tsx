import type { Metadata } from "next";
import Script from "next/script";
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
  description:
    "Official home of Paro FC: news, fixtures, squad, tickets, and the club shop.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
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
        {/* Privacy-friendly analytics by Plausible */}
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
        <Script
          src="http://localhost:8080/js/pa-19zkOjsnH4gqiklTplcwP.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
