import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-black bg-white text-black placeholder:text-gray-400 rounded-[6px] border-[3px] px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-visible:border-black focus-visible:ring-black focus-visible:ring-[3px] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
