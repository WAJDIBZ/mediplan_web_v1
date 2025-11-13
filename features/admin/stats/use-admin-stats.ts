import { useSwrLite } from "@/lib/swr-lite";
import { getAdminStats } from "./api";
import type { AdminStatsFilters, AdminStatsResponse } from "./types";

export function useAdminStats(filters: AdminStatsFilters) {
  const key = `admin-stats-${filters.from ?? "all"}-${filters.to ?? "all"}`;
  return useSwrLite<AdminStatsResponse>(key, () => getAdminStats(filters), {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
}
