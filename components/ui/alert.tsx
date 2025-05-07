import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border border-border/60 px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-sm backdrop-blur-[2px]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-card to-card/95 text-card-foreground",
        destructive:
          "text-destructive bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90",
        primary:
          "text-primary bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 [&>svg]:text-primary *:data-[slot=alert-description]:text-primary/90",
        accent:
          "text-accent bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 [&>svg]:text-accent *:data-[slot=alert-description]:text-accent/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
