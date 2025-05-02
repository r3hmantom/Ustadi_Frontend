"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="py-28 md:py-40 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-secondary/30 blur-3xl" />
      </motion.div>

      <div className="max-w-4xl mx-auto text-center px-4 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="space-y-8"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
          >
            Learn smarter, achieve more with Ustadi
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
          >
            The intelligent learning platform that adapts to your needs and
            helps you reach your full potential.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 0.6, delay: 0.3 },
              },
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="px-8 font-medium text-base shadow-lg"
                asChild
              >
                <Link href="/auth?signup=true">Get Started</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="px-8 font-medium text-base"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute -z-10 opacity-70 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            className="absolute top-10 right-0 w-16 h-16 rounded-full border-4 border-primary/30"
            animate={{
              y: [0, -15, 0],
              transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
          <motion.div
            className="absolute -bottom-20 left-20 w-32 h-32 rounded-full border-4 border-secondary/20"
            animate={{
              y: [0, 20, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              },
            }}
          />
          <motion.div
            className="absolute -top-10 left-1/3 w-20 h-20 rounded-full border-4 border-muted"
            animate={{
              y: [0, -20, 0],
              transition: {
                duration: 3.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              },
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};
