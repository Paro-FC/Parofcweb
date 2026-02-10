import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-barca-gold text-dark-charcoal hover:bg-barca-gold/90",
  secondary: "bg-bronze text-white hover:bg-bronze/90",
  outline: "border border-medium-grey bg-transparent hover:bg-light-gold/10 hover:border-barca-gold hover:text-barca-gold",
  ghost: "hover:bg-light-gold/10 hover:text-barca-gold",
  gold: "bg-barca-gold text-dark-charcoal hover:bg-barca-gold/90",
} as const

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
} as const

type ButtonVariant = keyof typeof buttonVariants
type ButtonSize = keyof typeof buttonSizes

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-barca-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

