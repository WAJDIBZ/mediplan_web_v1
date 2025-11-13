import { apiFetch } from "@/lib/api-client";
import type { AdminStatsFilters, AdminStatsResponse } from "./types";

export async function getAdminStats(filters: AdminStatsFilters = {}) {
  const query = new URLSearchParams();
  if (filters.from) {
    query.set("from", filters.from);
  }
  if (filters.to) {
    query.set("to", filters.to);
  }
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<AdminStatsResponse>(`/api/admin/stats${suffix}`);
}
