"use client";

import { useAuthStore } from "@/stores/auth.store";

/**
 * Convenience hook that exposes auth state and actions.
 * Use this instead of calling useAuthStore directly.
 */
export function useAuth() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();

  return {
    user,
    isAuthenticated,
    setUser,
    logout: clearAuth,
  };
}
