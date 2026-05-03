import type { Metadata } from "next";
import Script from "next/script";
import { unstable_cache } from "next/cache";
import "../index.css";
import { SanityLive } from "@/sanity/lib/live-client";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { sanityFetch } from "@/sanity/lib/live";
import { PARTNERS_QUERY } from "@/sanity/lib/queries";

const getCachedPartners = unstable_cache(
  async () => {
    const partnersResult = await sanityFetch({ query: PARTNERS_QUERY }).catch(
      () => ({ data: [] }),
    );
    return (partnersResult.data as unknown[]) || [];
  },
  ["layout-partners"],
  { revalidate: 120 },
);

export const metadata: Metadata = {
  title: "Paro FC - Official Website",
  description:
    "Official home of Paro FC: news, fixtures, squad, tickets, and the club shop.",
  icons: {
    icon: "/assets/paro.png",
    apple: "/assets/paro.png",
    shortcut: "/assets/paro.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const partners = await getCachedPartners();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0a0a0a]">
        <ConditionalLayout partners={partners as any}>
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
