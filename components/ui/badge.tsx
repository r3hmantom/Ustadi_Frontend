import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3px] aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50 aria-invalid:border-destructive transition-all duration-200 overflow-hidden shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary to-primary/90 text-primary-foreground [a&]:hover:from-primary/95 [a&]:hover:to-primary/85 hover:shadow-md",
        secondary:
          "border-transparent bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground [a&]:hover:from-secondary/95 [a&]:hover:to-secondary/85 hover:shadow-md",
        destructive:
          "border-transparent bg-gradient-to-r from-destructive to-destructive/90 text-white [a&]:hover:from-destructive/95 [a&]:hover:to-destructive/85 hover:shadow-md focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/50",
        outline:
          "border-primary/30 text-foreground [a&]:hover:bg-primary/10 [a&]:hover:text-primary dark:border-primary/20 dark:hover:bg-primary/15",
        accent:
          "border-transparent bg-gradient-to-r from-accent to-accent/90 text-accent-foreground [a&]:hover:from-accent/95 [a&]:hover:to-accent/85 hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
