// app/auth/page.jsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-black mb-6 text-center tracking-tight uppercase">Ustadi</h1>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-transparent gap-4">
            <TabsTrigger 
              value="signin" 
              className="data-[state=active]:bg-black data-[state=active]:text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-bold rounded-md p-2"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-black data-[state=active]:text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-bold rounded-md p-2"
            >
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card className="pt-0 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
              <CardHeader className="border-b-4 py-3 border-black bg-green-300 rounded-t-sm">
                <CardTitle className="text-2xl font-black">Sign In</CardTitle>
                <CardDescription className="font-medium text-black">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email" className="font-bold">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        className="border-4 border-black p-3 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password" className="font-bold">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="border-4 border-black p-3 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300" 
                        required 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" className="border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white" />
                      <Label htmlFor="remember" className="text-sm font-medium">Remember me</Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-purple-500 hover:bg-purple-600 text-white text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-bold rounded-md py-5 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t-4 border-black bg-white rounded-b-sm py-4">
                <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot your password?</a>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="pt-0 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
              <CardHeader className="border-b-4 py-3 border-black bg-pink-300 rounded-t-sm">
                <CardTitle className="text-2xl font-black">Register</CardTitle>
                <CardDescription className="font-medium text-black">Create a new account to get started</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name" className="font-bold">Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe" 
                        className="border-4 border-black p-3 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="reg-email" className="font-bold">Email</Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="you@example.com" 
                        className="border-4 border-black p-3 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="reg-password" className="font-bold">Password</Label>
                      <Input 
                        id="reg-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="border-4 border-black p-3 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="confirm-password" className="font-bold">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="border-4 border-black p-3 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300" 
                        required 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="terms" className="border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white" required />
                      <Label htmlFor="terms" className="text-sm font-medium">
                        I agree to the <a href="#" className="font-bold text-blue-600 hover:underline">Terms & Conditions</a>
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-purple-500 hover:bg-purple-600 text-white text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-bold rounded-md py-5 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t-4 border-black bg-white rounded-b-sm py-4">
                <p className="text-sm font-medium">
                  Already have an account? <a href="#" className="font-bold text-blue-600 hover:underline">Sign in</a>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}