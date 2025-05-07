import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:from-primary hover:to-primary/80 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200",
        destructive:
          "bg-gradient-to-br from-destructive to-destructive/90 text-white shadow-md hover:shadow-lg hover:from-destructive hover:to-destructive/80 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/50",
        outline:
          "border border-primary/30 bg-background shadow-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 dark:border-primary/20 dark:hover:bg-primary/10",
        secondary:
          "bg-gradient-to-br from-secondary to-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg hover:from-secondary hover:to-secondary/80 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200",
        ghost:
          "hover:bg-accent/20 hover:text-accent-foreground hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 dark:hover:bg-accent/10",
        link: "text-primary hover:text-primary/80 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
