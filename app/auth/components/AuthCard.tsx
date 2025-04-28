"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function AuthCard() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [formError, setFormError] = useState<string | null>(null);
  
  // Reset errors when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormError(null);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {activeTab === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {activeTab === "login" 
            ? "Sign in to access your account" 
            : "Fill in your details to get started"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onFormError={setFormError} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onFormError={setFormError} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}