"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Search, Menu, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { SearchModal } from "./SearchModal"
import { useSideMenu } from "@/contexts/SideMenuContext"
import { useCart } from "@/contexts/CartContext"

export function MainNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { openMenu } = useSideMenu()
  const { getItemCount, setIsCartOpen } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut: Cmd+K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {/* Mobile Header - Dark Charcoal */}
      <nav className="md:hidden sticky top-0 z-50 bg-dark-charcoal">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <Image 
              src="/assets/logo.webp" 
              alt="Paro FC Logo" 
              width={60}
              height={60}
              className="w-12 h-12 object-contain"
            />
          </a>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-barca-gold text-dark-charcoal text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Button>
            {/* <Button 
              variant="default" 
              size="sm"
              className="bg-barca-red hover:bg-barca-red/90 text-white rounded-md px-4 py-2 h-auto"
            >
              <span className="text-sm font-semibold">Login</span>
            </Button> */}
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-10 h-10"
              onClick={openMenu}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Secondary Navigation - White Background */}
      <nav className="md:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-around px-2 py-3 overflow-x-auto scrollbar-hide">
          <a href="/shop" className="flex items-center gap-2 text-xs font-bold uppercase text-gray-900 whitespace-nowrap px-2">
            <span>👕</span>
            <span>SHOP</span>
            <span className="text-[10px]">↗</span>
          </a>
          <a href="#" className="flex items-center gap-2 text-xs font-bold uppercase text-gray-900 whitespace-nowrap px-2">
            <span>🎫</span>
            <span>TICKETS</span>
          </a>
          <a href="/news" className="flex items-center gap-2 text-xs font-bold uppercase text-gray-900 whitespace-nowrap px-2">
            <span>🏷️</span>
            <span>NEWS</span>
          </a>
          {/* <a href="#" className="flex items-center gap-2 text-xs font-bold uppercase text-gray-900 whitespace-nowrap px-2">
            <span>👥</span>
            <span>CULERS</span>
          </a> */}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 bg-dark-charcoal backdrop-blur-sm">
      {/* Two-color bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-barca-gold"></div>
        <div className="flex-1 bg-barca-red"></div>
      </div>
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo and left nav items grouped together */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/" className="flex-shrink-0">
            <Image 
              src="/assets/logo.webp" 
              alt="Paro FC Logo" 
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
            />
          </a>
          <div className="flex items-center gap-4">
              <a href="/standings" className="text-sm font-semibold uppercase text-light-gold hover:text-barca-gold transition-colors">
                Standings <span className="text-xs">↗</span>
            </a>
              <a href="/shop" className="text-sm font-semibold uppercase text-light-gold hover:text-barca-gold transition-colors">
                Shop <span className="text-xs">↗</span>
            </a>
              {/* <a href="#" className="text-sm font-semibold uppercase text-light-gold hover:text-barca-gold transition-colors">
                Culers <span className="text-xs">↗</span>
            </a> */}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
            <a href="/photos" className="text-sm font-semibold uppercase text-light-gold hover:text-barca-gold transition-colors">
              Photos <span className="text-xs">↗</span>
          </a>
            <a href="/players" className="text-sm font-semibold uppercase text-light-gold hover:text-barca-gold transition-colors">
              Players <span className="text-xs">↗</span>
          </a>
            <a href="/news" className="text-sm font-semibold uppercase text-light-gold hover:text-barca-gold transition-colors">
              News <span className="text-xs">↗</span>
            </a>
            {/* <a href="#" className="text-sm font-semibold uppercase text-light-gold hover:text-barca-gold transition-colors">
              Barça Teams <span className="text-xs">▼</span>
          </a> */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-light-gold hover:text-barca-gold transition-colors" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-light-gold hover:text-barca-gold transition-colors" />
            {mounted && getItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-barca-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </Button>
        </div>
      </div>
    </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
    </>
  )
}
