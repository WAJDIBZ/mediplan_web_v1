import { apiFetch } from "@/lib/api-client";
import { adminAppointmentsMock } from "./mock-data";
import type { AdminAppointmentsFilters, AdminAppointmentsResponse, AdminAppointmentListItem } from "./types";

type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number?: number;
};

function buildQuery(params: AdminAppointmentsFilters) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.statut) searchParams.set("statut", params.statut);
  if (params.medecinId) searchParams.set("medecinId", params.medecinId);
  if (params.patientId) searchParams.set("patientId", params.patientId);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (typeof params.page === "number") searchParams.set("page", params.page.toString());
  if (typeof params.size === "number") searchParams.set("size", params.size.toString());
  if (params.sort) searchParams.set("sort", params.sort);
  return searchParams.toString();
}

function toResponse(page: SpringPage<AdminAppointmentListItem>, fallbackPage: number): AdminAppointmentsResponse {
  return {
    content: page.content,
    totalElements: page.totalElements,
    totalPages: page.totalPages,
    page: typeof page.number === "number" ? page.number : fallbackPage,
  };
}

export async function listAdminAppointments(
  filters: AdminAppointmentsFilters,
): Promise<AdminAppointmentsResponse> {
  const query = buildQuery(filters);
  const suffix = query ? `?${query}` : "";

  try {
    const page = await apiFetch<SpringPage<AdminAppointmentListItem>>(`/api/rdv${suffix}`);
    return toResponse(page, filters.page ?? 0);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return {
        content: adminAppointmentsMock,
        page: filters.page ?? 0,
        totalElements: adminAppointmentsMock.length,
        totalPages: 1,
      };
    }
    throw error;
  }
}
