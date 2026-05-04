'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Facebook01Icon,
  YoutubeIcon,
  InstagramIcon,
  TiktokIcon,
} from '@hugeicons/core-free-icons';
import Image from 'next/image';
import Link from 'next/link';

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

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '#', label: 'Club' },
  { href: '/players', label: 'Team' },
  { href: '/matches', label: 'Match Center' },
  { href: '#', label: 'Paro FC TV' },
];

const ticketLinks = [
  { href: '#', label: 'Season Pass' },
  { href: '#', label: 'Membership' },
  { href: '/shop', label: 'Shop' },
];

const academyLinks = [
  { href: '#', label: 'Youth Teams' },
  { href: '#', label: 'Coaching Philosophy' },
  { href: '#', label: 'Trials' },
  { href: '#', label: 'Grassroots' },
];

const socialLinks = [
  { icon: Facebook01Icon, label: 'Facebook', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: YoutubeIcon, label: 'YouTube', href: '#' },
  { icon: TiktokIcon, label: 'TikTok', href: '#' },
];

export function Footer(_: FooterProps) {
  return (
    <footer className="border-t border-parofc-red/15 bg-[#0a0a0a]">
      {/* Footer columns */}
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/paro.png"
              alt="Paro FC"
              width={48}
              height={48}
              className="object-contain"
            />
            <div>
              <b className="text-xl text-parofc-red">PARO FC</b>
            </div>
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-white/40">
            Pride of Paro. Pride of Bhutan.
            <br />
            Together, we build a legacy that inspires generations.
          </p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-parofc-red/40 hover:text-parofc-red"
              >
                <HugeiconsIcon icon={s.icon} size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <b className="text-2xs font-black uppercase tracking-wider text-parofc-red">
            Quick Links
          </b>
          <div className="mt-3 space-y-2 text-xs text-white/40">
            {quickLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block transition hover:text-parofc-red"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tickets & Shop */}
        <div>
          <b className="text-2xs font-black uppercase tracking-wider text-parofc-red">
            Tickets & Shop
          </b>
          <div className="mt-3 space-y-2 text-xs text-white/40">
            {ticketLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block transition hover:text-parofc-red"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Academy */}
        <div>
          <b className="text-2xs font-black uppercase tracking-wider text-parofc-red">
            Academy
          </b>
          <div className="mt-3 space-y-2 text-xs text-white/40">
            {academyLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block transition hover:text-parofc-red"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <b className="text-2xs font-black uppercase tracking-wider text-parofc-red">
            Contact Us
          </b>
          <div className="mt-3 space-y-2 text-xs text-white/40">
            <p>info@parofc.bt</p>
            <p>+975 7728 0000</p>
            <p>
              Woochu Sports Arena,
              <br />
              Paro, Bhutan
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <b className="text-2xs font-black uppercase tracking-wider text-parofc-red">
            Newsletter
          </b>
          <p className="mt-2 text-2xs text-white/30">
            Subscribe for the latest news, updates and exclusive offers.
          </p>
          <input
            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-parofc-red/40 focus:outline-none"
            placeholder="Enter your email"
          />
          <button className="mt-2 w-full rounded-lg bg-[#ce0505] py-2.5 text-2xs font-black uppercase tracking-wider text-white transition hover:bg-[#e00606]">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 text-2xs text-white/25">
          <span>© 2025 Paro Football Club. All Rights Reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/50">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/50">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-white/50">
              Media Enquiries
            </a>
          </div>
          <span
            className="text-sm italic text-parofc-red/40"
            style={{ fontFamily: 'cursive' }}
          >
            pride of paro
          </span>
        </div>
      </div>
    </footer>
  );
}
