"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

const AuthPage = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("signin");

  useEffect(() => {
    // Check the URL query parameters
    const signup = searchParams.get("signup");
    if (signup === "true") {
      setActiveTab("signup");
    }
  }, [searchParams]);

  const handleSwitchToSignIn = () => {
    setActiveTab("signin");
  };

  const handleSwitchToSignUp = () => {
    setActiveTab("signup");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <SignIn onSwitchToSignUp={handleSwitchToSignUp} />
          </TabsContent>

          <TabsContent value="signup">
            <SignUp onSwitchToSignIn={handleSwitchToSignIn} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
