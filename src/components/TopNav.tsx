import { Button } from "./ui/button"
import Image from "next/image"

export function TopNav() {
  return (
    <>
      {/* Top Banner - Mobile Style */}
      <nav className="bg-barca-blue rounded-lg mx-4 mt-2 mb-2 py-3 px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="w-3 h-3 rounded-full bg-barca-red"></div>
          </div>
          <a href="#" className="flex-1 text-sm text-white font-semibold">
            New matches at Spotify Camp Nou!{" "}
            <span className="text-barca-gold font-bold text-base">BUY TICKETS</span>
          </a>
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden md:block bg-white border-b border-gray-200 py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="text-sm text-gray-900 hover:text-barca-gold transition-colors">
          🔵🔴 New matches at Spotify Camp Nou!{" "}
          <span className="text-barca-gold font-bold">BUY TICKETS</span>
        </a>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">Login</Button>
          <Button variant="default" size="sm">View Plans</Button>
          <span className="text-sm text-gray-900 cursor-pointer hover:text-barca-gold transition-colors">EN</span>
          <Button variant="ghost" size="icon">☰</Button>
        </div>
      </div>
    </nav>
    </>
  )
}

