// "use client";

// import { useState, useEffect } from "react";
// import { HugeiconsIcon } from "@hugeicons/react";
// import { ShoppingBag01Icon, SearchIcon, Menu, ChevronDown } from "@hugeicons/core-free-icons";
// import Image from "next/image";
// import Link from "next/link";
// import { SearchModal } from "./SearchModal";
// import { useSideMenu } from "@/contexts/SideMenuContext";
// import { useCart } from "@/contexts/CartContext";

// export function MainNav() {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const { openMenu } = useSideMenu();
//   const { getItemCount, setIsCartOpen } = useCart();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key === "k") {
//         e.preventDefault();
//         setIsSearchOpen(true);
//       }
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   const cartCount = mounted ? getItemCount() : 0;

//   return (
//     <>
//       {/* Mobile Header */}
//       <nav className="lg:hidden sticky top-0 z-50 bg-[#0a0a0a]/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/5">
//         <div className="flex items-center justify-between px-4 h-16">
//           <Link href="/" className="flex items-center gap-3 flex-shrink-0">
//             <Image
//               src="/assets/paro.png"
//               alt="Paro FC"
//               width={128}
//               height={128}
//               className="w-12 h-12 object-contain"
//               quality={100}
//             />
//             <div>
//               <div className="text-xl font-black tracking-tight text-parofc-red">PARO FC</div>
//               <div className="text-4xs font-bold uppercase tracking-[0.3em] text-white/50">Pride of Paro</div>
//             </div>
//           </Link>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setIsSearchOpen(true)}
//               className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-parofc-red transition-colors cursor-pointer"
//               aria-label="Search"
//             >
//               <HugeiconsIcon icon={SearchIcon} size={18} primaryColor="currentColor" strokeWidth={1.8} />
//             </button>
//             <button
//               onClick={() => setIsCartOpen(true)}
//               className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-parofc-red transition-colors cursor-pointer relative"
//               aria-label="Cart"
//             >
//               <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
//               {cartCount > 0 && (
//                 <span className="absolute top-1 right-1 bg-[#ce0505] text-white text-4xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={openMenu}
//               className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
//               aria-label="Menu"
//             >
//               <HugeiconsIcon icon={Menu} size={24} primaryColor="currentColor" strokeWidth={1.8} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Desktop Navigation */}
//       <header className="hidden lg:block sticky top-0 z-50 bg-[#0a0a0a]/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/5">
//         <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3">
//           <Link href="/" className="flex items-center gap-3">
//             <Image
//               src="/assets/paro.png"
//               alt="Paro FC"
//               width={128}
//               height={128}
//               className="w-14 h-14 object-contain"
//               quality={100}
//             />
//             <div>
//               <div className="text-2xl font-black tracking-tight text-parofc-red" style={{ fontFamily: "serif" }}>PARO FC</div>
//               <div className="text-2xs font-bold uppercase tracking-[0.3em] text-white/50">Pride of Paro</div>
//             </div>
//           </Link>

//           <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
//             <Link href="/" className="text-parofc-red">Home</Link>
//             {[
//               { label: "Team", href: "/players" },
//             ].map((item) => (
//               <Link key={item.label} href={item.href} className="flex items-center gap-1 text-white/70 transition hover:text-parofc-red">
//                 {item.label} <HugeiconsIcon icon={ChevronDown} size={12} primaryColor="currentColor" strokeWidth={2} />
//               </Link>
//             ))}
//             <Link href="/calendar" className="text-white/70 transition hover:text-parofc-red">Tickets</Link>
//             <Link href="/shop" className="text-white/70 transition hover:text-parofc-red">Shop</Link>
//             <Link href="#" className="text-white/70 transition hover:text-parofc-red">Academy</Link>
//             <Link href="#" className="flex items-center gap-1 text-white/70 transition hover:text-parofc-red">
//               More <HugeiconsIcon icon={ChevronDown} size={12} primaryColor="currentColor" strokeWidth={2} />
//             </Link>
//           </nav>

//           <div className="flex items-center gap-4 text-white/60">
//             <button
//               onClick={() => setIsSearchOpen(true)}
//               className="cursor-pointer hover:text-parofc-red transition-colors"
//               aria-label="Search"
//             >
//               <HugeiconsIcon icon={SearchIcon} size={18} primaryColor="currentColor" strokeWidth={1.8} />
//             </button>
//             <button
//               onClick={() => setIsCartOpen(true)}
//               className="cursor-pointer hover:text-parofc-red transition-colors relative"
//               aria-label="Cart"
//             >
//               <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-[#ce0505] text-white text-5xs font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       <SearchModal
//         isOpen={isSearchOpen}
//         onClose={() => setIsSearchOpen(false)}
//       />
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Menu01Icon,
  ShoppingBag01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { SearchModal } from "./SearchModal";
import { useSideMenu } from "@/contexts/SideMenuContext";
import { useCart } from "@/contexts/CartContext";

const leftLinks = [
  { href: "/standings", label: "Standings", icon: ArrowUpRight01Icon },
  { href: "/fixtures-results", label: "Fixtures&Results", icon: ArrowUpRight01Icon },
  { href: "/shop", label: "Shop", icon: ArrowUpRight01Icon },
];

const rightLinks = [
  { href: "/photos", label: "Photos", icon: ArrowUpRight01Icon },
  { href: "/players", label: "The Squads", icon: ArrowUpRight01Icon },
  { href: "/academy", label: "Academy", icon: ArrowUpRight01Icon },
  { href: "/ebooks", label: "Ebooks", icon: ArrowUpRight01Icon },
  { href: "/news", label: "News", icon: ArrowUpRight01Icon },
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
      <nav className="md:hidden sticky top-0 z-50 bg-dark-charcoal font-display">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/assets/paro.png"
              alt="Paro FC"
              width={128}
              height={128}
              className="w-14 h-14 object-contain"
              quality={100}
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
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </Button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer relative"
              aria-label="Cart"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-parofc-red text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={openMenu}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} />
            </button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 bg-dark-charcoal font-display">
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          {/* Left: Logo + links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/assets/paro.png"
                alt="Paro FC"
                width={128}
                height={128}
                className="w-16 h-16 object-contain"
                quality={100}
              />
            </Link>
            <div className="flex items-center gap-6">
              {leftLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  scroll={false}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-parofc-gold transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                  <HugeiconsIcon icon={link.icon} size={12} />
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
                prefetch
                scroll={false}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-parofc-gold transition-colors duration-200 cursor-pointer"
              >
                {link.label}
                <HugeiconsIcon icon={link.icon} size={12} />
              </Link>
            ))}

            <div className="w-px h-4 bg-white/10" />

            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-parofc-gold transition-colors cursor-pointer"
              aria-label="Search"
            >
              <HugeiconsIcon icon={Search01Icon} size={16} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-parofc-gold transition-colors cursor-pointer relative"
              aria-label="Cart"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-parofc-red text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-px bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
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
