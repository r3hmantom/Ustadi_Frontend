"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { AuthCard } from "./components/AuthCard";

export default function AuthPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <>
      <h1 className="text-4xl font-black mb-8 text-center tracking-tight uppercase">Ustadi</h1>
      <AuthCard />
      <p className="mt-8 text-sm text-center text-gray-500">
        Need help? <a href="#" className="font-medium text-blue-600 hover:underline">Contact Support</a>
      </p>
    </>
  );
}