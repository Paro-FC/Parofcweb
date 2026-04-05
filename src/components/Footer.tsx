"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  YoutubeIcon,
  InstagramIcon,
  TiktokIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { PartnersSection } from "./PartnersSection";

interface Partner {
  _id: string;
  name: string;
  logo: string;
  url: string;
  category?: string;
}

interface FooterProps {
  partners?: Partner[];
}

export function Footer({ partners = [] }: FooterProps) {
  // Separate partners by category (excluding main partners as they're shown on homepage)
  const officialPartners = partners.filter((p) => p.category === "official");
  const otherPartners = partners.filter(
    (p) => !p.category || (p.category !== "main" && p.category !== "official"),
  );

  return (
    <footer className="bg-dark-charcoal text-light-gold py-16 px-4">
      <div className="container mx-auto">
        {/* Main Partners removed - shown on homepage only */}

        {/* Official Partners Section */}
        {officialPartners.length > 0 && (
          <PartnersSection
            partners={officialPartners}
            title="Official Partners"
          />
        )}

        {/* Other Partners Section */}
        {otherPartners.length > 0 && (
          <PartnersSection partners={otherPartners} title="Partners" />
        )}

        {/* Footer Bar — social where legal row used to be */}
        <div className="border-t border-white/20 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/logo.webp"
                alt="Paro FC Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <div className="text-light-gold font-bold text-lg mb-1">
                  Paro FC
                </div>
                <div className="text-light-gold/70 text-xs">
                  © Paro FC — official website
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 sm:gap-6 shrink-0">
              <a href="#" aria-label="Facebook" className="cursor-pointer p-1">
                <HugeiconsIcon
                  icon={Facebook01Icon}
                  size={28}
                  className="text-light-gold hover:text-parofc-gold transition-colors"
                />
              </a>
              <a href="#" aria-label="YouTube" className="cursor-pointer p-1">
                <HugeiconsIcon
                  icon={YoutubeIcon}
                  size={28}
                  className="text-light-gold hover:text-parofc-gold transition-colors"
                />
              </a>
              <a href="#" aria-label="Instagram" className="cursor-pointer p-1">
                <HugeiconsIcon
                  icon={InstagramIcon}
                  size={28}
                  className="text-light-gold hover:text-parofc-gold transition-colors"
                />
              </a>
              <a href="#" aria-label="TikTok" className="cursor-pointer p-1">
                <HugeiconsIcon
                  icon={TiktokIcon}
                  size={28}
                  className="text-light-gold hover:text-parofc-gold transition-colors"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
