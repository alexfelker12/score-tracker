"use client"

import { cn } from "@/lib/utils"

import { Separator } from "./separator"

export const LabeledSeparator = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("relative flex items-center text-center h-3.5", className)}
      role="presentation"
      {...props}
    >
      <Separator decorative />
      <span className="inline-block top-1/2 left-1/2 absolute bg-card px-2 h-3.5 text-muted-foreground text-sm leading-none whitespace-nowrap -translate-1/2">
        {children}
      </span>
    </div>
  )
}

