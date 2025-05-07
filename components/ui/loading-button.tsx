import { ButtonHTMLAttributes, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { VariantProps, buttonVariants } from "class-variance-authority";

export interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  /**
   * Text to display when the button is in a loading state
   */
  loadingText?: string;
  /**
   * Optional icon to render when not in loading state
   */
  icon?: React.ReactNode;
}

/**
 * Button component that displays a loading state
 */
export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      loadingText,
      disabled,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        className={cn(className)}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader size="small" className="mr-2" />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    );
  }
); 