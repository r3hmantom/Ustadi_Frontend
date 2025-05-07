import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground selection:bg-primary/80 selection:text-primary-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3px] focus-visible:shadow-md",
        "hover:border-primary/40 hover:shadow-sm",
        "aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
