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

        {/* Divider */}
        <div className="border-t border-white/20 mb-12"></div>

        {/* Social Media Section */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-center text-light-gold mb-8">
            Follow Paro FC on social media
          </h3>
          <div className="flex justify-center items-center gap-6">
            <a href="#" aria-label="Facebook" className="cursor-pointer">
              <HugeiconsIcon
                icon={Facebook01Icon}
                size={32}
                className="text-light-gold hover:text-parofc-gold transition-colors"
              />
            </a>
            <a href="#" aria-label="YouTube" className="cursor-pointer">
              <HugeiconsIcon
                icon={YoutubeIcon}
                size={32}
                className="text-light-gold hover:text-parofc-gold transition-colors"
              />
            </a>
            <a href="#" aria-label="Instagram" className="cursor-pointer">
              <HugeiconsIcon
                icon={InstagramIcon}
                size={32}
                className="text-light-gold hover:text-parofc-gold transition-colors"
              />
            </a>
            <a href="#" aria-label="TikTok" className="cursor-pointer">
              <HugeiconsIcon
                icon={TiktokIcon}
                size={32}
                className="text-light-gold hover:text-parofc-gold transition-colors"
              />
            </a>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left - Logo and Copyright */}
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

            {/* Center - Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-light-gold/70 text-sm">
              <a href="#" className="hover:text-parofc-gold transition-colors">
                Legal Terms
              </a>
              <span className="text-light-gold/30">|</span>
              <a href="#" className="hover:text-parofc-gold transition-colors">
                Privacy Policy
              </a>
              <span className="text-light-gold/30">|</span>
              <a
                href="/font-license"
                className="hover:text-parofc-gold transition-colors"
              >
                Font License
              </a>
              <span className="text-light-gold/30">|</span>
              {/* <a href="#" className="hover:text-parofc-gold transition-colors">Accessibility</a>
              <span className="text-light-gold/30">|</span> */}
              <a href="#" className="hover:text-parofc-gold transition-colors">
                Contact Us
              </a>
              <span className="text-light-gold/30">|</span>
              <a href="#" className="hover:text-parofc-gold transition-colors">
                Support/FAQs
              </a>
              {/* <span className="text-light-gold/30">|</span> */}
              {/* <a href="#" className="hover:text-parofc-gold transition-colors">Consent management</a> */}
              {/* <span className="text-light-gold/30">|</span> */}
              {/* <a href="#" className="hover:text-parofc-gold transition-colors">Consent choices</a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
