import { ApiError } from "./errors";
import { clearTokens, getTokens, setTokens, StoredTokens } from "./token-storage";

const DEFAULT_BASE_URL = "https://mediplan-api-1b2c88de81dd.herokuapp.com";

export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  authenticated?: boolean;
  responseType?: "json" | "blob" | "text";
  signal?: AbortSignal;
  skipRefresh?: boolean;
}

let refreshPromise: Promise<StoredTokens | null> | null = null;

function getBaseUrl() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return DEFAULT_BASE_URL;
}

async function performRefresh(
  currentRefreshToken: string,
  currentEmail?: string,
  currentRole?: StoredTokens["role"],
): Promise<StoredTokens | null> {
  const url = `${getBaseUrl()}/api/auth/refresh?token=${encodeURIComponent(currentRefreshToken)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  const payload = (await response.json()) as StoredTokens;
  const merged: StoredTokens = {
    ...payload,
    email: currentEmail,
    role: payload.role ?? currentRole!,
  };
  setTokens(merged);
  return merged;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    authenticated = true,
    responseType = "json",
    signal,
    skipRefresh = false,
  } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (!authenticated) {
    delete finalHeaders["Authorization"];
  }

  let tokens = authenticated ? getTokens() : null;
  if (authenticated && !tokens) {
    throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
  }

  if (authenticated && tokens?.accessToken) {
    finalHeaders["Authorization"] = `Bearer ${tokens.accessToken}`;
  }

  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 401 && authenticated && !skipRefresh) {
    const currentTokens = getTokens();
    if (!currentTokens?.refreshToken) {
      clearTokens();
      throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
    }

    if (!refreshPromise) {
      refreshPromise = performRefresh(
        currentTokens.refreshToken,
        currentTokens.email,
        currentTokens.role,
      ).finally(() => {
        refreshPromise = null;
      });
    }

    tokens = await refreshPromise;
    if (!tokens) {
      clearTokens();
      throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
    }

    return apiFetch(path, {
      method,
      body,
      headers,
      authenticated,
      responseType,
      signal,
      skipRefresh: true,
    });
  }

  if (!response.ok) {
    let message = "Une erreur inattendue est survenue.";
    let details: Record<string, string> | undefined;
    try {
      const payload = await response.json();
      if (typeof payload?.message === "string") {
        message = payload.message;
      }
      if (payload?.erreurs && typeof payload.erreurs === "object") {
        details = payload.erreurs as Record<string, string>;
      }
    } catch {
      // ignore parsing errors
    }
    throw new ApiError(response.status, message, details);
  }

  if (responseType === "blob") {
    return (await response.blob()) as unknown as T;
  }

  if (responseType === "text") {
    return (await response.text()) as unknown as T;
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(response.status, "Réponse inattendue du serveur.");
  }
}
