import { useSwrLite } from "@/lib/swr-lite";
import { listUsers } from "./api";
import type { AdminUserFilters, AdminUsersResponse } from "./types";

function serializeFilters(filters: AdminUserFilters) {
  return JSON.stringify({
    ...filters,
    page: filters.page ?? 0,
    size: filters.size ?? 10,
  });
}

export function useAdminUsers(filters: AdminUserFilters) {
  const key = `admin-users-${serializeFilters(filters)}`;
  return useSwrLite<AdminUsersResponse>(key, () => listUsers(filters), {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
}
