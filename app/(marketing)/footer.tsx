"use client";

import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t py-12 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4">Ustadi</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The intelligent learning platform that helps you achieve your full
              potential.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ustadi. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-linkedin"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
