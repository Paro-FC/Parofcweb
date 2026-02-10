"use client"

// import { Button } from "./ui/button"
// import { Menu } from "lucide-react"
import { useSideMenu } from "@/contexts/SideMenuContext"

export function TopNav() {
  const { openMenu } = useSideMenu()

  return (
    <>
      {/* Top Banner - Mobile Style */}
      <nav className="bg-dark-charcoal rounded-lg mx-4 mt-2 mb-2 py-3 px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-barca-gold"></div>
            <div className="w-3 h-3 rounded-full bg-barca-red"></div>
          </div>
          <a href="#" className="flex-1 text-sm text-light-gold font-semibold">
            New matches at Spotify Camp Nou!{" "}
            <span className="text-barca-gold font-bold text-base">BUY TICKETS</span>
          </a>
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden md:block bg-light-gold border-b border-medium-grey py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="text-sm text-dark-charcoal hover:text-barca-gold transition-colors">
          🔵🔴 New matches at Spotify Camp Nou!{" "}
          <span className="text-barca-gold font-bold">BUY TICKETS</span>
        </a>
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="sm">Login</Button> */}
          {/* <Button variant="default" size="sm">View Plans</Button> */}
          {/* <span className="text-sm text-dark-charcoal cursor-pointer hover:text-barca-gold transition-colors">EN</span> */}
          {/* <Button 
            variant="ghost" 
            size="icon"
            onClick={openMenu}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </nav>
    </>
  )
}

