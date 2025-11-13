import type { UserRole } from "@/types/common";

export type { UserRole } from "@/types/common";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  email?: string;
}

const ACCESS_KEY = "mediplan.access";
const REFRESH_KEY = "mediplan.refresh";
const ROLE_KEY = "mediplan.role";
const EMAIL_KEY = "mediplan.email";

let memoryTokens: StoredTokens | null = null;
const listeners = new Set<(tokens: StoredTokens | null) => void>();

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function subscribeToTokenChanges(listener: (tokens: StoredTokens | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(tokens: StoredTokens | null) {
  listeners.forEach((listener) => listener(tokens));
}

export function setTokens(tokens: StoredTokens) {
  memoryTokens = tokens;
  if (isBrowser()) {
    window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    window.localStorage.setItem(ROLE_KEY, tokens.role);
    if (tokens.email) {
      window.localStorage.setItem(EMAIL_KEY, tokens.email);
    } else {
      window.localStorage.removeItem(EMAIL_KEY);
    }
  }
  notify(tokens);
}

export function clearTokens() {
  memoryTokens = null;
  if (isBrowser()) {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(ROLE_KEY);
    window.localStorage.removeItem(EMAIL_KEY);
  }
  notify(null);
}

export function getTokens(): StoredTokens | null {
  if (memoryTokens) {
    return memoryTokens;
  }
  if (!isBrowser()) {
    return null;
  }
  const accessToken = window.localStorage.getItem(ACCESS_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_KEY);
  const role = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
  if (!accessToken || !refreshToken || !role) {
    return null;
  }
  const email = window.localStorage.getItem(EMAIL_KEY) || undefined;
  memoryTokens = { accessToken, refreshToken, role, email };
  return memoryTokens;
}
