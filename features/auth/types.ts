import type { UserRole } from "@/types/common";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export interface AuthUser {
  email: string;
  role: UserRole;
  fullName?: string;
  active?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticating: boolean;
  isReady: boolean;
}
