"use client"

import React, { ReactNode } from "react";
import { motion, useAnimation, useInView, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  className = "",
  direction = "up",
  distance = 30,
  once = true,
}: FadeInProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  // Define direction-based initial positions
  const initialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      case "none":
        return { opacity: 0 };
      default:
        return { opacity: 0, y: distance };
    }
  };

  // Define direction-based animations
  const animate = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "none":
        return { opacity: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start(animate());
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={initialPosition()}
      animate={controls}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Smooth easing curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = "",
  once = true,
}: StaggerContainerProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Marquee({
  children,
  className = "",
  direction = "left",
  speed = 50,
}: {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  speed?: number;
}) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : 0 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 100 / speed,
          ease: "linear",
        }}
        className="inline-block"
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ x: direction === "left" ? "100%" : 0 }}
        animate={{ x: direction === "left" ? 0 : "100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 100 / speed,
          ease: "linear",
        }}
        className="inline-block"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ParallaxScroll({
  children,
  speed = 0.5,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <motion.div
      style={{
        y: useTransform(useScroll().scrollY, [0, 1000], [0, -500 * speed]),
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Export motion for direct use in other components
export { motion };
