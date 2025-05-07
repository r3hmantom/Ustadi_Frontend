import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type LoaderProps = {
  /**
   * The size of the loader
   * @default "small"
   */
  size?: "small" | "big";
  /**
   * Text to display below the loader
   * @optional
   */
  text?: string;
  /**
   * Additional CSS classes to apply to the loader container
   * @optional
   */
  className?: string;
};

/**
 * Beautiful loader component with small and big variants
 */
export function Loader({ size = "small", text, className }: LoaderProps) {
  // Common animation properties
  const circleDuration = 1.5; // animation duration in seconds
  const circleDelay = 0.15; // delay between each circle animation
  
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "relative flex items-center justify-center",
          size === "small" ? "h-8 w-8" : "h-24 w-24"
        )}
      >
        {/* Circle 1 (outer) */}
        <motion.div
          className={cn(
            "absolute rounded-full border-t-2 border-primary/80",
            size === "small" ? "h-8 w-8" : "h-24 w-24"
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: circleDuration,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        
        {/* Circle 2 (middle) */}
        <motion.div
          className={cn(
            "absolute rounded-full border-t-2 border-r-2 border-primary",
            size === "small" ? "h-6 w-6" : "h-16 w-16"
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: circleDuration - 0.3,
            ease: "linear",
            repeat: Infinity,
            delay: circleDelay,
          }}
        />
        
        {/* Circle 3 (inner) - Only for big loader */}
        {size === "big" && (
          <motion.div
            className="absolute h-8 w-8 rounded-full border-t-2 border-l-2 border-accent"
            animate={{ rotate: 360 }}
            transition={{
              duration: circleDuration - 0.6,
              ease: "linear",
              repeat: Infinity,
              delay: circleDelay * 2,
            }}
          />
        )}
        
        {/* Center dot - with a pulse animation */}
        <motion.div
          className={cn(
            "rounded-full bg-primary",
            size === "small" ? "h-2 w-2" : "h-4 w-4"
          )}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
      
      {/* Optional text */}
      {text && (
        <p className={cn(
          "mt-3 text-center text-muted-foreground",
          size === "small" ? "text-sm" : "text-base"
        )}>
          {text}
        </p>
      )}
    </div>
  );
} 