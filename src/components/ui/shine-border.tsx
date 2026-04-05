import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ShineBorderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ShineBorder({
  className,
  children,
  ...props
}: ShineBorderProps) {
  return (
    <div
      className={cn(
        "relative flex rounded-lg border border-white/10 bg-white/5 p-[1px]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-parofc-gold/0 via-parofc-gold/50 to-parofc-gold/0 opacity-0 transition-opacity duration-1000 hover:opacity-100" />
      <div className="relative z-10 w-full rounded-lg bg-gradient-parofc">
        {children}
      </div>
    </div>
  );
}
