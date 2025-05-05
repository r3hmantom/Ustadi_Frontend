"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/hooks/useUser";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileSettings from "./profile-settings";
import PasswordSettings from "./password-settings";

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Handle authentication redirection in useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <div className="p-6 text-center">Loading your settings...</div>
        </Card>
      </div>
    );
  }

  // Don't render page content while redirecting or if user isn't logged in
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
