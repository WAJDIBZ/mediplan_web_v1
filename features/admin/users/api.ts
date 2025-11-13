import { apiFetch } from "@/lib/api-client";
import type {
  AdminChangeRolePayload,
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  AdminUserDetails,
  AdminUserFilters,
  AdminUsersResponse,
} from "./types";

function buildQuery(params: AdminUserFilters) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.role) searchParams.set("role", params.role);
  if (params.active) searchParams.set("active", params.active);
  if (params.provider) searchParams.set("provider", params.provider);
  if (typeof params.page === "number") searchParams.set("page", params.page.toString());
  if (typeof params.size === "number") searchParams.set("size", params.size.toString());
  if (params.sort) searchParams.set("sort", params.sort);
  return searchParams.toString();
}

export async function listUsers(filters: AdminUserFilters) {
  const query = buildQuery(filters);
  const suffix = query ? `?${query}` : "";
  return apiFetch<AdminUsersResponse>(`/api/admin/users${suffix}`);
}

export async function getUserDetails(id: string) {
  return apiFetch<AdminUserDetails>(`/api/admin/users/${id}`);
}

export async function createUser(payload: AdminCreateUserPayload) {
  return apiFetch<AdminUserDetails>("/api/admin/users", {
    method: "POST",
    body: payload,
  });
}

export async function updateUser(id: string, payload: AdminUpdateUserPayload) {
  return apiFetch<AdminUserDetails>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function changeUserRole(id: string, payload: AdminChangeRolePayload) {
  return apiFetch<AdminUserDetails>(`/api/admin/users/${id}/role`, {
    method: "POST",
    body: payload,
  });
}

export async function deactivateUser(id: string) {
  await apiFetch(`/api/admin/users/${id}/deactivate`, { method: "POST" });
}

export async function reactivateUser(id: string) {
  await apiFetch(`/api/admin/users/${id}/reactivate`, { method: "POST" });
}

export async function exportUsers(filters: AdminUserFilters) {
  const query = buildQuery(filters);
  const suffix = query ? `?${query}` : "";
  return apiFetch<Blob>(`/api/admin/users/export${suffix}`, {
    method: "POST",
    responseType: "blob",
  });
}
