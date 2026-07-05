import { api } from "./api";
import { AUTH_COOKIE_NAME } from "./constants";
import type { User } from "@/types";

interface AuthResponse {
  accessToken: string;
  user: User;
}

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 2; // matches the 2h JWT expiry set server-side

function setToken(token: string) {
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

function clearToken() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export const auth = {
  async login(email: string, password: string): Promise<User> {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    setToken(res.accessToken);
    return res.user;
  },

  async register(email: string, password: string, name: string): Promise<User> {
    const res = await api.post<AuthResponse>("/auth/register", { email, password, name });
    setToken(res.accessToken);
    return res.user;
  },

  logout() {
    clearToken();
  },
};
