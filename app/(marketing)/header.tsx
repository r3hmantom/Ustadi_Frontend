"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            Ustadi
          </Link>
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth?signup=true">Sign Up</Link>
          </Button>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden p-2 rounded-md focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isMobileMenuOpen ? "hidden" : "block"}
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isMobileMenuOpen ? "block" : "hidden"}
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b"
          >
            <div className="flex flex-col space-y-4 px-6 py-6 bg-background">
              <Link
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium hover:text-primary"
              >
                About
              </Link>
              <div className="flex flex-col space-y-3 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link
                    href="/auth?signup=true"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
