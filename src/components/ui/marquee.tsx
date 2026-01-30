import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  vertical?: boolean
  repeat?: number
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
          "animate-marquee flex-row": !vertical && !reverse,
          "animate-marquee-reverse flex-row-reverse": !vertical && reverse,
          "animate-marquee-vertical flex-col": vertical && !reverse,
          "animate-marquee-vertical-reverse flex-col-reverse": vertical && reverse,
          "group-hover:[animation-play-state:paused]": pauseOnHover,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "flex-row": !vertical,
              "flex-col": vertical,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

