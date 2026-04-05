"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  YoutubeIcon,
  InstagramIcon,
  TiktokIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";
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

        {/* Information Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
          {/* Goalkeepers */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Goalkeepers</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Ugyen Namgay</li>
              <li>Pema Dorji</li>
            </ul>
          </div>

          {/* Defenders */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Defenders</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Karma Thinley</li>
              <li>Sonam Tshering</li>
              <li>Jigme Wangchuk</li>
              <li>Dorji Tashi</li>
              <li>Tshering Pelden</li>
              <li>Ugyen Phuntsho</li>
              <li>Rinzin Gyeltshen</li>
              <li>Tenzin Norbu</li>
            </ul>
          </div>

          {/* Midfielders */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Midfielders</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Kinley Wangdi</li>
              <li>Dechen Zangmo</li>
              <li>Chimi Dema</li>
              <li>Phub Dorji</li>
              <li>Tashi Dema</li>
              <li>Kezang Dorji</li>
              <li>Sonam Lhamo</li>
            </ul>
          </div>

          {/* Forwards */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Forwards</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Dawa Zangmo</li>
              <li>Karma Dema</li>
              <li>Cheki Wangmo</li>
              <li>Pema Tashi</li>
              <li>Tashi Phuntsho</li>
              <li>Ugyen Dema</li>
            </ul>
          </div>

          {/* Paro FC products & digital */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Paro FC products</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Supporters membership</li>
              <li>Paro FC+</li>
              <li>Tickets & museum</li>
              <li>Paro FC app</li>
              <li>Online store</li>
              <li>Support/FAQs</li>
              <li>Become beta tester</li>
              <li>Black Friday</li>
              <li>Holiday shop</li>
            </ul>
          </div>

          {/* Club */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Club</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Changlimithang Stadium</li>
              <li>Ethical channel</li>
              <li>The crest</li>
              <li>Anthem</li>
              <li>Work at the club stores</li>
            </ul>
          </div>

          {/* History */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">History</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>2010s–2020s. Our strongest years</li>
              <li>Building the modern squad</li>
              <li>2000s. Growing the academy</li>
              <li>Foundation and early years</li>
              <li>Paro FC in the AFC Cup</li>
            </ul>
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
