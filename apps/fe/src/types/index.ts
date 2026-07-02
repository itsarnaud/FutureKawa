// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "manager" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── i18n ────────────────────────────────────────────────────────────────────

export type Locale = "fr" | "en";
