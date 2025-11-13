import { apiFetch } from "@/lib/api-client";
import type { AuthResponse, LoginRequest } from "./types";

export async function login(credentials: LoginRequest) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: credentials,
    authenticated: false,
  });
}

export async function fetchSession() {
  return apiFetch<undefined>("/api/auth/me", { method: "GET" });
}
