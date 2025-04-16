"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-black font-bold text-base px-1 py-0.5 rounded-[4px] bg-[#FFD600] border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
      {...props}
    />
  )
}

export { Label }
