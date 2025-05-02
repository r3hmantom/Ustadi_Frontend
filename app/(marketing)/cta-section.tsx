"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CTASection = () => {
  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10 opacity-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-secondary/30 blur-3xl" />
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto text-center space-y-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.h2
          className="text-3xl md:text-5xl font-bold"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          Ready to transform your learning experience?
        </motion.h2>
        <motion.p
          className="text-xl text-muted-foreground"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          Join thousands of learners who have already discovered the Ustadi
          advantage.
        </motion.p>
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, delay: 0.2 },
            },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pt-4"
        >
          <Button
            size="lg"
            className="text-base px-10 py-6 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl"
            asChild
          >
            <Link href="/auth?signup=true">Sign Up Now</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
