import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import {
  clearTokens,
  getTokens,
  setTokens,
  subscribeToTokenChanges,
  type StoredTokens,
} from "../lib/token-storage";

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}

beforeEach(() => {
  const storage = new MemoryStorage();
  // @ts-expect-error: we polyfill window for testing purposes
  globalThis.window = { localStorage: storage };
  clearTokens();
});

afterEach(() => {
  // @ts-expect-error cleanup polyfill
  delete globalThis.window;
  clearTokens();
});

test("setTokens and getTokens store data in memory and localStorage", () => {
  const tokens: StoredTokens = {
    accessToken: "access",
    refreshToken: "refresh",
    role: "ADMIN",
    email: "admin@example.com",
  };
  setTokens(tokens);
  const retrieved = getTokens();
  assert.ok(retrieved);
  assert.equal(retrieved?.accessToken, "access");
  assert.equal(retrieved?.refreshToken, "refresh");
  assert.equal(retrieved?.role, "ADMIN");
  assert.equal(retrieved?.email, "admin@example.com");
});

test("subscribeToTokenChanges notifies listeners", () => {
  const notifications: Array<StoredTokens | null> = [];
  const unsubscribe = subscribeToTokenChanges((value) => notifications.push(value));
  const tokens: StoredTokens = {
    accessToken: "a",
    refreshToken: "b",
    role: "MEDECIN",
  };
  setTokens(tokens);
  clearTokens();
  unsubscribe();

  assert.equal(notifications.length, 2);
  assert.equal(notifications[0]?.role, "MEDECIN");
  assert.equal(notifications[1], null);
});

test("clearTokens removes data", () => {
  const tokens: StoredTokens = {
    accessToken: "a",
    refreshToken: "b",
    role: "PATIENT",
  };
  setTokens(tokens);
  clearTokens();
  const retrieved = getTokens();
  assert.equal(retrieved, null);
});
