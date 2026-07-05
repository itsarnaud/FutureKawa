"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

// ─── State ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  clearAuth: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "fk-auth",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist user info here — the JWT itself lives in its own cookie
      // (see lib/auth.ts), read directly by lib/api.ts and by middleware.ts.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
