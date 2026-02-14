"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { 
  downloadICS, 
  generateGoogleCalendarURL, 
  generateOutlookCalendarURL,
  generateMicrosoft365CalendarURL 
} from "@/lib/calendar"

interface Match {
  _id: string
  homeTeam: string
  awayTeam: string
  competition: string
  date: string
  event: string
  venue: string
}

interface CalendarSyncModalProps {
  isOpen: boolean
  onClose: () => void
  matches: Match[]
}

const calendarOptions = [
  {
    id: "google",
    name: "GOOGLE",
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12">
        <rect width="24" height="24" fill="#4285F4" rx="2" />
        <rect x="4" y="4" width="16" height="16" fill="white" />
        <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#4285F4" fontWeight="bold">31</text>
        <circle cx="18" cy="6" r="2" fill="#34A853" />
        <circle cx="18" cy="10" r="2" fill="#FBBC04" />
        <circle cx="18" cy="14" r="2" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: "apple",
    name: "APPLE",
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12">
        <rect width="24" height="24" fill="white" rx="2" stroke="#E5E5E5" strokeWidth="1" />
        <text x="12" y="14" textAnchor="middle" fontSize="8" fill="#D32F2F" fontWeight="bold">JUL</text>
        <text x="12" y="20" textAnchor="middle" fontSize="8" fill="#D32F2F" fontWeight="bold">17</text>
      </svg>
    ),
  },
  {
    id: "outlook-web",
    name: "OUTLOOK.COM (WEB)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12">
        <rect width="24" height="24" fill="#0078D4" rx="2" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">O</text>
        <rect x="16" y="16" width="4" height="4" fill="#0078D4" />
      </svg>
    ),
  },
  {
    id: "outlook-classic",
    name: "CLASSIC OUTLOOK (DESKTOP)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12">
        <rect width="24" height="24" fill="#0078D4" rx="2" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">O</text>
        <rect x="16" y="16" width="4" height="4" fill="#0078D4" />
      </svg>
    ),
  },
  {
    id: "outlook-new",
    name: "NEW OUTLOOK (DESKTOP)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12">
        <rect width="24" height="24" fill="#0078D4" rx="2" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">O</text>
        <rect x="16" y="16" width="4" height="4" fill="#0078D4" />
      </svg>
    ),
  },
  {
    id: "microsoft365",
    name: "MICROSOFT 365",
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12">
        <rect width="24" height="24" fill="white" rx="2" />
        <path d="M6 6h6v6H6V6zm6 6h6v6h-6v-6z" fill="#F25022" />
        <path d="M6 12h6v6H6v-6z" fill="#7FBA00" />
        <path d="M12 6h6v6h-6V6z" fill="#00A4EF" />
        <path d="M12 12h6v6h-6v-6z" fill="#FFB900" />
      </svg>
    ),
  },
  {
    id: "other",
    name: "OTHER",
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12">
        <rect width="24" height="24" fill="white" rx="2" stroke="#E5E5E5" strokeWidth="1" />
        <rect x="4" y="6" width="16" height="14" rx="1" fill="none" stroke="#D32F2F" strokeWidth="1.5" />
        <line x1="7" y1="10" x2="17" y2="10" stroke="#D32F2F" strokeWidth="1.5" />
        <line x1="7" y1="13" x2="17" y2="13" stroke="#D32F2F" strokeWidth="1.5" />
        <line x1="7" y1="16" x2="17" y2="16" stroke="#D32F2F" strokeWidth="1.5" />
      </svg>
    ),
  },
]

export function CalendarSyncModal({ isOpen, onClose, matches }: CalendarSyncModalProps) {
  const handleCalendarSelect = (calendarId: string) => {
    if (matches.length === 0) {
      alert("No matches available to sync")
      return
    }

    switch (calendarId) {
      case "google":
        // Open Google Calendar in new tab
        const googleUrl = generateGoogleCalendarURL(matches)
        if (googleUrl) {
          window.open(googleUrl, "_blank")
        }
        break

      case "apple":
        // Download ICS file for Apple Calendar
        downloadICS(matches, "paro-fc-matches.ics")
        break

      case "outlook-web":
        // Open Outlook.com in new tab
        const outlookUrl = generateOutlookCalendarURL(matches)
        if (outlookUrl) {
          window.open(outlookUrl, "_blank")
        }
        break

      case "outlook-classic":
      case "outlook-new":
        // Download ICS file for Outlook Desktop
        downloadICS(matches, "paro-fc-matches.ics")
        // Show instructions
        setTimeout(() => {
          alert("ICS file downloaded. Please open it with Outlook Desktop to add the events to your calendar.")
        }, 100)
        break

      case "microsoft365":
        // Open Microsoft 365 Calendar in new tab
        const ms365Url = generateMicrosoft365CalendarURL(matches)
        if (ms365Url) {
          window.open(ms365Url, "_blank")
        }
        break

      case "other":
        // Download ICS file for other calendar applications
        downloadICS(matches, "paro-fc-matches.ics")
        setTimeout(() => {
          alert("ICS file downloaded. You can import this file into your calendar application.")
        }, 100)
        break

      default:
        console.warn("Unknown calendar type:", calendarId)
    }

    // Close modal after a short delay to allow the action to complete
    setTimeout(() => {
      onClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Yellow Header Bar - always visible on mobile */}
          <div className="bg-barca-gold h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-6">
            <button
              onClick={onClose}
              className="p-2 -ml-1 hover:bg-black/10 rounded-full transition-colors touch-manipulation"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            
            <div className="flex-shrink-0">
              <Image
                src="/assets/logo.webp"
                alt="Paro FC Logo"
                width={40}
                height={40}
                className="object-contain w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>
            
            <button
              onClick={onClose}
              className="p-2 -mr-1 hover:bg-black/10 rounded-full transition-colors touch-manipulation"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>
          </div>

          {/* Content - scrollable so header stays in view on small screens */}
          <div className="p-4 sm:p-8 overflow-y-auto flex-1 min-h-0">
            {/* Title */}
            <h2 className="text-xl sm:text-3xl font-bold text-barca-gold mb-3 sm:mb-4 text-center">
              CHOOSE YOUR CALENDAR
            </h2>

            {/* Disclaimer */}
            <p className="text-xs sm:text-sm text-gray-700 text-center mb-6 sm:mb-8">
              THIS EXPERIENCE IS POWERED BY ECAL, I AGREE TO{" "}
              <a
                href="#"
                className="text-barca-gold underline hover:text-barca-gold/80"
                onClick={(e) => e.stopPropagation()}
              >
                TERMS OF USE
              </a>{" "}
              AND{" "}
              <a
                href="#"
                className="text-barca-gold underline hover:text-barca-gold/80"
                onClick={(e) => e.stopPropagation()}
              >
                PRIVACY POLICY
              </a>
              .
            </p>

            {/* Calendar Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {calendarOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleCalendarSelect(option.id)}
                  className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center justify-center">
                    {option.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-900 text-center group-hover:text-barca-gold transition-colors">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Red Bottom Bar */}
          <div className="h-1 flex-shrink-0 bg-barca-red" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

