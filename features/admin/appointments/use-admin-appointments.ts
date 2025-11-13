import { useSwrLite } from "@/lib/swr-lite";
import { listAdminAppointments } from "./api";
import type { AdminAppointmentsFilters, AdminAppointmentsResponse } from "./types";

function serializeFilters(filters: AdminAppointmentsFilters) {
  return JSON.stringify({
    ...filters,
    page: filters.page ?? 0,
    size: filters.size ?? 10,
    sort: filters.sort ?? "debut,asc",
  });
}

export function useAdminAppointments(filters: AdminAppointmentsFilters) {
  const key = `admin-appointments-${serializeFilters(filters)}`;
  return useSwrLite<AdminAppointmentsResponse>(key, () => listAdminAppointments(filters), {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
}
