"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search, Menu, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchModal } from "./SearchModal";
import { useSideMenu } from "@/contexts/SideMenuContext";
import { useCart } from "@/contexts/CartContext";

const leftLinks = [
  { href: "/standings", label: "Standings" },
  { href: "/shop", label: "Shop" },
];

const rightLinks = [
  { href: "/photos", label: "Photos" },
  { href: "/players", label: "Players" },
  { href: "/news", label: "News" },
];

export function MainNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openMenu } = useSideMenu();
  const { getItemCount, setIsCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <>
      {/* Mobile Header */}
      <nav className="md:hidden sticky top-0 z-50 bg-dark-charcoal">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/assets/logo.webp"
              alt="Paro FC"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:bg-white/20 rounded-full w-10 h-10"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-barca-red text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={openMenu}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile quick links */}
        <div className="flex items-center border-t border-white/5 overflow-x-auto scrollbar-hide">
          {[...leftLinks, ...rightLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-shrink-0 px-4 py-2.5 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 bg-dark-charcoal">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Left: Logo + links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/assets/logo.webp"
                alt="Paro FC"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </Link>
            <div className="flex items-center gap-6">
              {leftLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-barca-gold transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              
            </div>
          </div>

          {/* Right: links + icons */}
          <div className="flex items-center gap-6">
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-barca-gold transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-4 bg-white/10" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-light-gold hover:text-barca-gold transition-colors" />
            </Button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-barca-gold transition-colors cursor-pointer relative"
              aria-label="Cart"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-barca-red text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-px bg-gradient-to-r from-barca-red via-barca-gold to-bronze" />
      </nav>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `,
        }}
      />
    </>
  );
}
