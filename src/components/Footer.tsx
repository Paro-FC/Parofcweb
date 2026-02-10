"use client"

import { Facebook, Twitter, Youtube, Instagram, Music } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"
import { PartnersSection } from "./PartnersSection"

interface Partner {
  _id: string
  name: string
  logo: string
  url: string
  category?: string
}

interface FooterProps {
  partners?: Partner[]
}

export function Footer({ partners = [] }: FooterProps) {
  // Separate partners by category (excluding main partners as they're shown on homepage)
  const officialPartners = partners.filter(p => p.category === 'official')
  const otherPartners = partners.filter(p => !p.category || (p.category !== 'main' && p.category !== 'official'))

  return (
    <footer className="bg-dark-charcoal text-light-gold py-16 px-4">
      <div className="container mx-auto">
        {/* Main Partners removed - shown on homepage only */}

        {/* Official Partners Section */}
        {officialPartners.length > 0 && (
          <PartnersSection partners={officialPartners} title="Official Partners" />
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
            <Facebook className="w-8 h-8 text-light-gold hover:text-barca-gold transition-colors cursor-pointer" />
            <Youtube className="w-8 h-8 text-light-gold hover:text-barca-gold transition-colors cursor-pointer" />
            <Instagram className="w-8 h-8 text-light-gold hover:text-barca-gold transition-colors cursor-pointer" />
            <svg className="w-8 h-8 text-light-gold hover:text-barca-gold transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </div>
        </div>

        {/* Information Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
          {/* Goalkeepers */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Goalkeepers</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Wojciech Szczęsny</li>
              <li>Joan Garcia</li>
            </ul>
          </div>

          {/* Defenders */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Defenders</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>João Cancelo</li>
              <li>Alejandro Balde</li>
              <li>Ronald Araujo</li>
              <li>Pau Cubarsí</li>
              <li>Andreas Christensen</li>
              <li>Gerard Martin</li>
              <li>Jules Kounde</li>
              <li>Eric Garcia</li>
            </ul>
          </div>

          {/* Midfielders */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Midfielders</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Gavi</li>
              <li>Pedri</li>
              <li>Fermín López</li>
              <li>Marc Casadó</li>
              <li>Frenkie de Jong</li>
              <li>Dani Olmo</li>
              <li>Marc Bernal</li>
            </ul>
          </div>

          {/* Forwards */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Forwards</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Ferran Torres</li>
              <li>Robert Lewandowski</li>
              <li>Lamine Yamal</li>
              <li>Raphinha</li>
              <li>Marcus Rashford</li>
              <li>Roony Bardghji</li>
            </ul>
          </div>

          {/* Barça Products */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Barça Products</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Culers Membership</li>
              <li>Barça One</li>
              <li>Tickets & Museum</li>
              <li>Barça App</li>
              <li>Online store</li>
              <li>Support/FAQs</li>
              <li>Become Beta Tester</li>
              <li>Black Friday</li>
              <li>Christmas Barça</li>
            </ul>
          </div>

          {/* Club */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">Club</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>Spotify Camp Nou</li>
              <li>Ethical Channel</li>
              <li>The Crest</li>
              <li>Anthem</li>
              <li>Work at the Barça Stores</li>
            </ul>
          </div>

          {/* History */}
          <div>
            <h4 className="text-light-gold font-bold mb-4">History</h4>
            <ul className="space-y-2 text-light-gold/70 text-sm">
              <li>2008-20. The best years in our history</li>
              <li>The era of the Dream Team</li>
              <li>1950-1961. The Kubala era</li>
              <li>1899-1909. Foundation and survival</li>
              <li>Barça in the Campions League</li>
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
                <div className="text-light-gold font-bold text-lg mb-1">Paro FC</div>
                <div className="text-light-gold/70 text-xs">
                  © Copyright Paro FC Official website of Paro FC
                </div>
              </div>
            </div>

            {/* Center - Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-light-gold/70 text-sm">
              <a href="#" className="hover:text-barca-gold transition-colors">Legal Terms</a>
              <span className="text-light-gold/30">|</span>
              <a href="#" className="hover:text-barca-gold transition-colors">Privacy Policy</a>
              <span className="text-light-gold/30">|</span>
              <a href="/font-license" className="hover:text-barca-gold transition-colors">Font License</a>
              <span className="text-light-gold/30">|</span>
              {/* <a href="#" className="hover:text-barca-gold transition-colors">Accessibility</a>
              <span className="text-light-gold/30">|</span> */}
              <a href="#" className="hover:text-barca-gold transition-colors">Contact Us</a>
              <span className="text-light-gold/30">|</span>
              <a href="#" className="hover:text-barca-gold transition-colors">Support/FAQs</a>
              {/* <span className="text-light-gold/30">|</span> */}
              {/* <a href="#" className="hover:text-barca-gold transition-colors">Consent management</a> */}
              {/* <span className="text-light-gold/30">|</span> */}
              {/* <a href="#" className="hover:text-barca-gold transition-colors">Consent choices</a> */}
            </div>

            {/* Right - BARÇA Text */}
            <div className="text-light-gold font-bold text-4xl md:text-5xl">
              PARO FC
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

