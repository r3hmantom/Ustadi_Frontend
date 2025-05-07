"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../stores/useUserStore";

export function useUser() {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    fetchUser,
    logout,
    clearError,
  } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Fetch user data when the hook is first initialized
    if (!user && !isLoading) {
      fetchUser();
    }
  }, [user, isLoading, fetchUser]);

  // Wrapper for logout that handles navigation
  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return {
    user,
    loading: isLoading,
    error,
    logout: handleLogout,
    isAuthenticated,
    clearError,
  };
}

export default useUser;
