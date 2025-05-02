import React from "react";
import Header from "./header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const MarketingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 ">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Learn smarter, achieve more with Ustadi
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The intelligent learning platform that adapts to your needs and
              helps you reach your full potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild>
                <Link href="/auth?signup=true">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Ustadi?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="mb-4 p-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 ">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to transform your learning experience?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of learners who have already discovered the Ustadi
              advantage.
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/auth?signup=true">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className=" text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ustadi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Simple icon components for features
const features = [
  {
    icon: (
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
        className="text-primary"
      >
        <path d="M14.5 2H6a2 0 0 0-2 2v16a2 0 0 0 2 2h12a2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    ),
    title: "Personalized Learning",
    description:
      "Our adaptive technology tailors the learning experience to your unique needs and pace.",
  },
  {
    icon: (
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
        className="text-primary"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    ),
    title: "Interactive Tasks",
    description:
      "Engage with dynamic tasks that make learning active and enjoyable rather than passive.",
  },
  {
    icon: (
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
        className="text-primary"
      >
        <path d="M14 9V5a3 0 0 0-3-3l-4 9v11h11.28a2 0 0 0 2-1.7l1.38-9a2 0 0 0-2-2.3zM7 22H4a2 0 0 1-2-2v-7a2 0 0 1 2-2h3"></path>
      </svg>
    ),
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics and actionable insights.",
  },
];

export default MarketingPage;
