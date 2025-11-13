import { apiFetch } from "@/lib/api-client";
import type { AdminStatsFilters, AdminStatsResponse } from "./types";

function buildQuery(filters: AdminStatsFilters = {}) {
  const query = new URLSearchParams();
  if (filters.from) {
    query.set("from", filters.from);
  }
  if (filters.to) {
    query.set("to", filters.to);
  }
  return query;
}

export async function getAdminStats(filters: AdminStatsFilters = {}) {
  const query = buildQuery(filters);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<AdminStatsResponse>(`/api/admin/stats${suffix}`);
}

export async function exportAdminStats(filters: AdminStatsFilters = {}) {
  const query = buildQuery(filters);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<Blob>(`/api/admin/stats/export${suffix}`, {
    responseType: "blob",
  });
}
