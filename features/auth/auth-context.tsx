"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSession, login as loginRequest } from "./services";
import type { AuthResponse, AuthState, AuthUser, LoginRequest } from "./types";
import { ApiError } from "@/lib/errors";
import {
  clearTokens,
  getTokens,
  setTokens,
  subscribeToTokenChanges,
  type StoredTokens,
} from "@/lib/token-storage";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

interface InitialAuthSnapshot {
  state: AuthState;
  shouldValidate: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapTokensToUser(tokens: StoredTokens | null): AuthUser | null {
  if (!tokens) {
    return null;
  }
  return {
    email: tokens.email ?? "",
    role: tokens.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [initialSnapshot] = useState<InitialAuthSnapshot>(() => {
    const tokens = getTokens();
    if (!tokens) {
      return {
        state: { user: null, isAuthenticating: false, isReady: true },
        shouldValidate: false,
      };
    }
    return {
      state: { user: mapTokensToUser(tokens), isAuthenticating: true, isReady: false },
      shouldValidate: true,
    };
  });
  const [state, setState] = useState<AuthState>(initialSnapshot.state);
  const { shouldValidate } = initialSnapshot;

  useEffect(() => {
    const unsubscribe = subscribeToTokenChanges((tokens) => {
      setState((current) => ({
        ...current,
        user: mapTokensToUser(tokens),
      }));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!shouldValidate) {
      return;
    }
    let active = true;
    fetchSession()
      .catch(() => {
        if (!active) {
          return;
        }
        clearTokens();
        setState({ user: null, isAuthenticating: false, isReady: true });
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setState((current) => ({ ...current, isAuthenticating: false, isReady: true }));
      });
    return () => {
      active = false;
    };
  }, [shouldValidate]);

  const login = useCallback(async (credentials: LoginRequest) => {
    setState((current) => ({ ...current, isAuthenticating: true }));
    try {
      const response = await loginRequest(credentials);
      applyTokens(response, credentials.email);
      setState({
        user: {
          email: credentials.email,
          role: response.role,
        },
        isAuthenticating: false,
        isReady: true,
      });
      if (response.role === "ADMIN") {
        router.replace("/admin");
      } else if (response.role === "MEDECIN") {
        router.replace("/medecin");
      } else {
        router.replace("/");
      }
    } catch (error) {
      setState((current) => ({ ...current, isAuthenticating: false }));
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Impossible de se connecter pour le moment.");
    }
  }, [router]);

  const logout = useCallback(() => {
    clearTokens();
    setState({ user: null, isAuthenticating: false, isReady: true });
    router.replace("/auth/login");
  }, [router]);

  const refresh = useCallback(async () => {
    try {
      await fetchSession();
    } catch (error) {
      clearTokens();
      setState({ user: null, isAuthenticating: false, isReady: true });
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/auth/login");
      }
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refresh,
    }),
    [login, logout, refresh, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}

function applyTokens(response: AuthResponse, email: string) {
  setTokens({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    role: response.role,
    email,
  });
}
