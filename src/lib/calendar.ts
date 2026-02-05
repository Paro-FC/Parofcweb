interface Match {
  _id: string
  homeTeam: string
  awayTeam: string
  competition: string
  date: string
  event: string
  venue: string
}

/**
 * Format date to ICS format (YYYYMMDDTHHMMSS)
 */
function formatDateForICS(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

/**
 * Escape text for ICS format
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate ICS file content from matches
 */
export function generateICS(matches: Match[]): string {
  const now = new Date()
  const nowFormatted = formatDateForICS(now)
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Paro FC//Match Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Paro FC Matches',
    'X-WR-CALDESC:Paro FC Match Schedule',
    'X-WR-TIMEZONE:UTC',
  ]

  matches.forEach((match) => {
    const matchDate = new Date(match.date)
    const startDate = formatDateForICS(matchDate)
    // Match duration: 2 hours
    const endDate = formatDateForICS(new Date(matchDate.getTime() + 2 * 60 * 60 * 1000))
    
    const summary = `${match.homeTeam} vs ${match.awayTeam}`
    const description = [
      `Competition: ${match.competition}`,
      `Event: ${match.event}`,
      `Venue: ${match.venue}`,
      `Home Team: ${match.homeTeam}`,
      `Away Team: ${match.awayTeam}`,
    ].join('\\n')

    const location = escapeICS(match.venue)
    const escapedSummary = escapeICS(summary)
    const escapedDescription = escapeICS(description)

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:paro-fc-match-${match._id}@parofc.com`,
      `DTSTAMP:${nowFormatted}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${escapedSummary}`,
      `DESCRIPTION:${escapedDescription}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT'
    )
  })

  icsContent.push('END:VCALENDAR')
  return icsContent.join('\r\n')
}

/**
 * Download ICS file
 */
export function downloadICS(matches: Match[], filename: string = 'paro-fc-matches.ics') {
  const icsContent = generateICS(matches)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarURL(matches: Match[]): string {
  if (matches.length === 0) return ''
  
  // Use the first match for the URL (Google Calendar supports single events)
  const match = matches[0]
  const matchDate = new Date(match.date)
  const endDate = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000)
  
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${match.homeTeam} vs ${match.awayTeam}`,
    dates: `${formatGoogleDate(matchDate)}/${formatGoogleDate(endDate)}`,
    details: `Competition: ${match.competition}\nEvent: ${match.event}\nVenue: ${match.venue}`,
    location: match.venue,
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generate Outlook Calendar URL
 */
export function generateOutlookCalendarURL(matches: Match[]): string {
  if (matches.length === 0) return ''
  
  const match = matches[0]
  const matchDate = new Date(match.date)
  const endDate = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000)
  
  const formatOutlookDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  const params = new URLSearchParams({
    subject: `${match.homeTeam} vs ${match.awayTeam}`,
    startdt: matchDate.toISOString(),
    enddt: endDate.toISOString(),
    body: `Competition: ${match.competition}\nEvent: ${match.event}\nVenue: ${match.venue}`,
    location: match.venue,
  })
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Generate Microsoft 365 Calendar URL
 */
export function generateMicrosoft365CalendarURL(matches: Match[]): string {
  if (matches.length === 0) return ''
  
  const match = matches[0]
  const matchDate = new Date(match.date)
  const endDate = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000)
  
  const params = new URLSearchParams({
    subject: `${match.homeTeam} vs ${match.awayTeam}`,
    startdt: matchDate.toISOString(),
    enddt: endDate.toISOString(),
    body: `Competition: ${match.competition}\nEvent: ${match.event}\nVenue: ${match.venue}`,
    location: match.venue,
  })
  
  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
}

