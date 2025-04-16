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
          <TabsList className="grid w-full grid-cols-2 mb-8 gap-4">
            <TabsTrigger value="signin" className="transition-all font-bold rounded-md p-2">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="transition-all font-bold rounded-md p-2">
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card className="pt-0 rounded-md">
              <CardHeader className="py-3 bg-green-300 rounded-t-sm">
                <CardTitle className="text-2xl font-black">Sign In</CardTitle>
                <CardDescription className="font-medium text-black">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm font-medium">Remember me</Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="text-lg font-bold py-5 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center bg-white rounded-b-sm py-4">
                <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot your password?</a>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="pt-0 rounded-md">
              <CardHeader className="py-3 bg-pink-300 rounded-t-sm">
                <CardTitle className="text-2xl font-black">Register</CardTitle>
                <CardDescription className="font-medium text-black">Create a new account to get started</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="you@example.com" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input 
                        id="reg-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm font-medium">
                        I agree to the <a href="#" className="font-bold text-blue-600 hover:underline">Terms & Conditions</a>
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="text-lg font-bold py-5 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center bg-white rounded-b-sm py-4">
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