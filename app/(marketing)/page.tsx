"use client";

import React from "react";
import { Header } from "./header";
import { HeroSection } from "./hero-section";
import { CTASection } from "./cta-section";
import { Footer } from "./footer";

const MarketingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default MarketingPage;
