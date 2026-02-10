"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface MenuItem {
  label: string
  href?: string
  icon?: string
  children?: MenuItem[]
  external?: boolean
}

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleItem = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const menuItems: MenuItem[] = [
    {
      label: "First Team",
      children: [
        { label: "Latest", href: "/news" },
        { label: "Schedule", href: "/calendar" },
        { label: "Tickets", href: "#" },
        { label: "Results", href: "#" },
        { label: "Standings", href: "/standings" },
        { label: "Players", href: "/players" },
        { label: "Photos", href: "/photos" },
        { label: "Honours", href: "#" },
      ],
    },
    {
      label: "Club",
      children: [
        { label: "Cat Culer", href: "#" },
        { label: "Latest", href: "/news" },
        { label: "Schedule", href: "/calendar" },
        { label: "Revista Barça", href: "#" },
        { label: "Organisation", href: "#" },
        { label: "Identity", href: "#" },
        { label: "History", href: "#" },
        { label: "Foundation", href: "#" },
        { label: "Documentation Centre", href: "#" },
        { label: "Sustainability", href: "#" },
        { label: "La Masia", href: "#" },
        { label: "Facilities", href: "#" },
        { label: "Spotify Camp Nou work", href: "#" },
        { label: "Barça Innovation Hub", href: "#" },
        { label: "Transparency and Compliance", href: "#" },
        { label: "Child safeguarding system", href: "#" },
        { label: "Services", href: "#" },
        { label: "Press", href: "#" },
        { label: "Accessibility", href: "#" },
        { label: "Members", href: "#" },
        { label: "Partners", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
    {
      label: "Barça Teams",
      children: [
        {
          label: "Football",
          children: [
            { label: "First Team", href: "/players" },
            { label: "Women's", href: "#" }
          ],
        },
        {
          label: "Futsal",
          children: [
            { label: "First Team", href: "#" },
            { label: "Latest", href: "#" },
            { label: "Schedule", href: "#" },
            { label: "Tickets", href: "#" },
            { label: "Results", href: "#" },
            { label: "Standings", href: "#" },
            { label: "Players", href: "#" },
            { label: "Photos", href: "#" },
            { label: "Honours", href: "#" },
            { label: "History", href: "#" },
          ],
        },
        {
          label: "Roller Hockey",
          children: [
            { label: "First Team", href: "#" },
            { label: "Latest", href: "#" },
            { label: "Schedule", href: "#" },
            { label: "Tickets", href: "#" },
            { label: "Results", href: "#" },
            { label: "Standings", href: "#" },
            { label: "Players", href: "#" },
            { label: "Photos", href: "#" },
            { label: "History", href: "#" },
            { label: "Honours", href: "#" },
          ],
        },
        {
          label: "Esports",
          children: [
            { label: "League of Legends", href: "#" },
            { label: "VALORANT Rising", href: "#" },
            { label: "VALORANT Game Changers", href: "#" },
            { label: "eFootball", href: "#" },
          ],
        },
      ],
    },
    {
      label: "Tickets & Museum",
      children: [
        { label: "Men's Football", href: "#" },
        { label: "VIP Men's football", href: "#" },
        { label: "Tours & Museum", href: "#" },
        { label: "Men's Basketball", href: "#" },
        { label: "VIP Men's Basketball", href: "#" },
        { label: "Women's football", href: "#" },
        { label: "Handball", href: "#" },
        { label: "Futsal", href: "#" },
        { label: "Roller-Hockey", href: "#" },
        { label: "Barça Atlètic", href: "#" },
        { label: "Ice rink", href: "#" },
        { label: "Packs and promotions", href: "#" },
        { label: "Barça Business", href: "#" },
        { label: "All about tickets", href: "#" },
        { label: "Barça Cafe", href: "#" },
      ],
    },
    {
      label: "Shop",
      href: "#",
      external: true,
    },
    {
      label: "Culers",
      href: "#",
      external: true,
    },
  ]

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.label)
    const indentClass = level === 0 ? "" : level === 1 ? "pl-4" : level === 2 ? "pl-8" : "pl-12"

    if (hasChildren) {
      return (
        <div key={item.label} className="border-b border-light-grey">
          <button
            onClick={() => toggleItem(item.label)}
            className={`w-full flex items-center justify-between py-4 px-6 text-left hover:bg-light-gold/10 hover:text-barca-gold transition-colors ${indentClass}`}
          >
            <span className="text-base font-semibold text-dark-charcoal">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-medium-grey group-hover:text-barca-gold" />
            ) : (
              <ChevronRight className="w-5 h-5 text-medium-grey group-hover:text-barca-gold" />
            )}
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-light-gold/20">
                  {item.children?.map((child) => renderMenuItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    if (item.href) {
      const content = (
        <div className={`flex items-center justify-between py-3 px-6 hover:bg-light-gold/10 hover:text-barca-gold transition-colors ${indentClass}`}>
          <span className="text-sm text-dark-charcoal">{item.label}</span>
          {item.external && (
            <span className="text-xs text-medium-grey">↗</span>
          )}
        </div>
      )

      if (item.external) {
        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-b border-light-grey"
          >
            {content}
          </a>
        )
      }

      return (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="block border-b border-gray-200"
        >
          {content}
        </Link>
      )
    }

    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Side Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-dark-charcoal border-b border-medium-grey z-10">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-xl font-bold text-light-gold">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-barca-gold/20 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-light-gold hover:text-barca-gold transition-colors" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => renderMenuItem(item))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

