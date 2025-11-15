"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { AdminAppointmentsTable } from "@/features/admin/appointments/components/admin-appointments-table";
import { useAdminAppointments } from "@/features/admin/appointments/use-admin-appointments";
import type { AdminAppointmentsFilters, AdminAppointmentStatus } from "@/features/admin/appointments/types";
import { ApiError } from "@/lib/errors";

const STATUSES: { value: AdminAppointmentStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "PLANIFIE", label: "Planifié" },
  { value: "CONFIRME", label: "Confirmé" },
  { value: "HONORE", label: "Honoré" },
  { value: "ANNULE", label: "Annulé" },
];

const PAGE_SIZE = 10;

export default function AdminAppointmentsPage() {
  const [filters, setFilters] = useState<AdminAppointmentsFilters>({ page: 0, size: PAGE_SIZE });
  const { data, error, isLoading, reload } = useAdminAppointments(filters);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setFilters((current) => ({
      ...current,
      page: 0,
      q: (formData.get("q") as string) || undefined,
      medecinId: (formData.get("medecinId") as string) || undefined,
      patientId: (formData.get("patientId") as string) || undefined,
      from: (formData.get("from") as string) || undefined,
      to: (formData.get("to") as string) || undefined,
      statut: (formData.get("statut") as AdminAppointmentStatus) || undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((current) => ({ ...current, page }));
  };

  const subtitle = useMemo(() => {
    if (!data || data.totalElements === 0) {
      return "Aucun rendez-vous correspondant aux filtres en cours.";
    }
    return `${data.totalElements} rendez-vous trouvés`;
  }, [data]);

  return (
    <div className="space-y-8">
      <Card className="border-[#dbeafe] bg-[#f8fafc]">
        <CardHeader>
          <CardTitle className="text-xl">Rendez-vous</CardTitle>
          <CardDescription>
            Visualisez et filtrez l’ensemble des rendez-vous pour coordonner vos équipes en temps réel.
          </CardDescription>
        </CardHeader>
      </Card>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:grid-cols-6"
      >
        <div className="lg:col-span-2">
          <Label htmlFor="q">Recherche</Label>
          <Input
            id="q"
            name="q"
            placeholder="Patient, médecin, motif..."
            defaultValue={filters.q ?? ""}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select id="statut" name="statut" defaultValue={filters.statut ?? ""} disabled={isLoading}>
            {STATUSES.map((status) => (
              <option key={status.value || "all"} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="medecinId">Médecin</Label>
          <Input
            id="medecinId"
            name="medecinId"
            placeholder="ID médecin"
            defaultValue={filters.medecinId ?? ""}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="patientId">Patient</Label>
          <Input
            id="patientId"
            name="patientId"
            placeholder="ID patient"
            defaultValue={filters.patientId ?? ""}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="from">Du</Label>
          <Input id="from" name="from" type="date" defaultValue={filters.from ?? ""} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="to">Au</Label>
          <Input id="to" name="to" type="date" defaultValue={filters.to ?? ""} disabled={isLoading} />
        </div>
        <div className="lg:col-span-6">
          <Button type="submit" variant="primary" disabled={isLoading}>
            Filtrer
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="ml-3"
            disabled={isLoading}
            onClick={() => {
              setFilters({ page: 0, size: PAGE_SIZE });
              void reload();
            }}
          >
            Réinitialiser
          </Button>
        </div>
      </form>

      {isLoading && (
        <EmptyState className="py-20">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb]">
            ⏳
          </span>
          <p className="text-sm font-medium text-[#2563eb]">Chargement des rendez-vous...</p>
        </EmptyState>
      )}

      {error && !isLoading && (
        <div className="rounded-3xl border border-[#fecaca] bg-[#fef2f2] p-6 text-sm text-[#991b1b]">
          {error instanceof ApiError
            ? error.message
            : "Impossible de récupérer les rendez-vous pour le moment."}
        </div>
      )}

      {data && !isLoading && data.content.length === 0 && (
        <EmptyState className="py-16">
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#cbd5f5] text-[#1d4ed8]">
            📭
          </span>
          <p className="text-base font-semibold text-[#0f172a]">Aucun rendez-vous</p>
          <p className="text-sm text-[#475569]">
            Ajustez vos filtres ou créez un nouveau rendez-vous depuis le portail médecin.
          </p>
        </EmptyState>
      )}

      {data && data.content.length > 0 && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0f172a]">Agenda consolidé</h2>
              <p className="text-sm text-[#64748b]">{subtitle}</p>
            </div>
            <Button type="button" variant="secondary" onClick={() => void reload()} disabled={isLoading}>
              Actualiser
            </Button>
          </div>
          <AdminAppointmentsTable appointments={data.content} />
          <Pagination page={filters.page ?? 0} pageCount={Math.max(data.totalPages, 1)} onChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
