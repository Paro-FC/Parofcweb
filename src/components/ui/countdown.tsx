"use client"

import { useEffect, useState } from "react"

interface CountdownProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!targetDate) return
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [targetDate])
  
  if (!targetDate) return null

  const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-bold text-barca-gold">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] md:text-xs uppercase text-gray-600 mt-1 font-semibold">{label}</span>
    </div>
  )

  return (
    <div className="flex items-center justify-center gap-2">
      <CountdownItem value={timeLeft.days} label="Days" />
      <span className="text-2xl font-bold text-barca-gold">:</span>
      <CountdownItem value={timeLeft.hours} label="Hours" />
      <span className="text-2xl font-bold text-barca-gold">:</span>
      <CountdownItem value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl font-bold text-barca-gold">:</span>
      <CountdownItem value={timeLeft.seconds} label="Secs" />
    </div>
  )
}

