"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem, Marquee, motion } from "@/components/ui/animated-elements";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#f5f5f5]">
      {/* Hero section with animated header */}
      <header className="relative overflow-hidden bg-[#e1e5f2] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <StaggerContainer className="flex flex-col items-center text-center gap-6">
            <StaggerItem>
              <motion.div
                animate={{ 
                  rotate: [0, 2, 0, -2, 0], 
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="mb-8"
              >
                <div className="inline-block bg-[#FFD600] p-2 border-4 border-black mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h1 className="text-5xl md:text-7xl font-bold text-black">
                    Ustadi
                  </h1>
                </div>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <h2 className="text-3xl md:text-4xl font-bold text-black max-w-3xl">
                Learn, Create, and Master Your Skills
              </h2>
            </StaggerItem>
            
            <StaggerItem>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
                The comprehensive platform designed to accelerate your learning journey through interactive experiences.
              </p>
            </StaggerItem>
            
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button variant="neuPrimary" size="neuLg">
                  Get Started
                </Button>
                <Button variant="neuSecondary" size="neuLg">
                  Learn More
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-pink-400 border-3 border-black"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, 360], 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-blue-500 border-3 border-black"
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, -180, 0], 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute top-40 right-40 w-24 h-24 bg-[#FFD600] border-4 border-black rotate-12"
          animate={{ 
            rotate: [12, -5, 12],
            scale: [1, 1.1, 1], 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
      </header>

      {/* Marquee section */}
      <div className="py-4 bg-blue-500 border-b-4 border-black overflow-hidden">
        <Marquee speed={35} className="text-xl font-bold text-white">
          <span className="mx-4">• LEARN • CREATE • MASTER • INNOVATE • GROW • ACHIEVE • EXCEL • DEVELOP • PROGRESS • </span>
        </Marquee>
      </div>

      {/* Features Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Ustadi?</h2>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <FadeIn delay={0.1}>
            <Card variant="neubrutalism" className="bg-[#FFD600] p-2">
              <CardHeader>
                <CardTitle className="text-2xl">Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Engage with interactive lessons and exercises designed to accelerate your learning journey.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="neubrutalism" className="mt-4">
                  Explore
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>

          {/* Feature 2 */}
          <FadeIn delay={0.2}>
            <Card variant="neubrutalism" className="bg-blue-200 p-2">
              <CardHeader>
                <CardTitle className="text-2xl">Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Learn directly from industry professionals through curated content and personalized feedback.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="neubrutalism" className="mt-4">
                  Meet Experts
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>

          {/* Feature 3 */}
          <FadeIn delay={0.3}>
            <Card variant="neubrutalism" className="bg-pink-200 p-2">
              <CardHeader>
                <CardTitle className="text-2xl">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Monitor your development with comprehensive analytics and achievement milestones.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="neubrutalism" className="mt-4">
                  View Dashboard
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-[#e1e5f2] border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn direction="left">
              <Card variant="neubrutalism" className="bg-white p-2 transform rotate-[-1deg]">
                <CardContent>
                  <p className="text-lg italic mb-4">
                    "Ustadi has transformed how I approach learning new skills. The interactive elements and immediate feedback are game-changers!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFD600] border-2 border-black flex items-center justify-center mr-4 font-bold">
                      AH
                    </div>
                    <div>
                      <p className="font-bold">Ahmed Hassan</p>
                      <p className="text-sm text-gray-600">Web Developer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <Card variant="neubrutalism" className="bg-white p-2 transform rotate-[1deg]">
                <CardContent>
                  <p className="text-lg italic mb-4">
                    "The structured learning paths combined with flexible pacing made it possible for me to gain new skills while managing my busy schedule."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-pink-400 border-2 border-black flex items-center justify-center mr-4 font-bold">
                      SR
                    </div>
                    <div>
                      <p className="font-bold">Sara Rahman</p>
                      <p className="text-sm text-gray-600">Data Scientist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <Card variant="neubrutalism" className="bg-blue-500 p-8">
              <CardContent className="flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Start Your Learning Journey?
                </h2>
                <p className="text-lg text-blue-100 mb-8">
                  Join thousands of learners who are achieving their goals with Ustadi.
                </p>
                <Button variant="neubrutalism" size="neuLg">
                  Sign Up Now
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-[#333] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ustadi</h3>
              <p className="text-gray-300">
                Empowering learners worldwide through interactive education and skill development.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Courses</a></li>
                <li><a href="#" className="hover:underline">Pricing</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <p className="text-gray-300 mb-2">Stay updated with our latest news and offerings.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">Twitter</a>
                <a href="#" className="hover:text-blue-600">Facebook</a>
                <a href="#" className="hover:text-pink-500">Instagram</a>
                <a href="#" className="hover:text-blue-700">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Ustadi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
