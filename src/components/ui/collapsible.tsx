"use client"

import { cn } from "@/lib/utils"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { Slot } from "@radix-ui/react-slot"

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  asChild = false,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : CollapsiblePrimitive.CollapsibleTrigger
  return (
    <Comp
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn("data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden", className)}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
