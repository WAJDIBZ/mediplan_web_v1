"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-[#bae6fd]/80 bg-gradient-to-br from-[#ecfeff] via-white to-[#eff6ff] p-8 shadow-inner">
        <div className="absolute inset-0 opacity-70" aria-hidden>
          <div className="absolute left-6 top-8 h-24 w-24 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-cyan-200/40 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[#0f766e]">
              📅 Supervision agenda
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-[#0f172a]">Rendez-vous consolidés</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#0f172a]/70">
                Filtrez l’activité multi-cabinets, identifiez les pics de volume et assurez une coordination fluide entre les équipes.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {data ? (
              [
                {
                  title: "Rendez-vous listés",
                  value: data.totalElements,
                  caption: "Sur la période filtrée",
                },
                {
                  title: "Durée moyenne (page)",
                  value:
                    data.content.length > 0
                      ? `${Math.round(
                          data.content.reduce((acc, item) => {
                            const start = new Date(item.debut).getTime();
                            const end = new Date(item.fin).getTime();
                            return acc + Math.max((end - start) / (1000 * 60), 0);
                          }, 0) / data.content.length,
                        )} min`
                      : "—",
                  caption: "Pour les rendez-vous affichés",
                },
              ].map((metric) => (
                <div key={metric.title} className="rounded-2xl border border-sky-100 bg-white/80 px-5 py-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">{metric.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{metric.value}</p>
                  <p className="mt-1 text-xs text-[#0f172a]/60">{metric.caption}</p>
                </div>
              ))
            ) : (
              <>
                <Skeleton className="h-24 w-48 rounded-2xl bg-slate-200/80" />
                <Skeleton className="h-24 w-48 rounded-2xl bg-slate-200/80" />
              </>
            )}
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-[28px] border border-[#bae6fd] bg-white/95 p-6 shadow-lg shadow-sky-900/5 lg:grid-cols-6"
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
        <div className="lg:col-span-6 flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" disabled={isLoading}>
            Filtrer
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={() => {
              setFilters({ page: 0, size: PAGE_SIZE });
              void reload();
            }}
          >
            Réinitialiser
          </Button>
          <div className="ml-auto flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">
              {subtitle}
            </span>
          </div>
        </div>
      </form>

      {isLoading && (
        <div className="rounded-[28px] border border-sky-100 bg-sky-50/60 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">Chargement</p>
              <p className="text-xs text-sky-700/70">Actualisation de la vue agenda...</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-600">⏳</span>
          </div>
          <div className="mt-6 grid gap-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={`rdv-skeleton-${index}`} className="h-16 w-full rounded-2xl bg-white/80" />
            ))}
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-[28px] border border-[#fecaca] bg-[#fef2f2] p-6 text-sm text-[#991b1b]">
          {error instanceof ApiError
            ? error.message
            : "Impossible de récupérer les rendez-vous pour le moment."}
        </div>
      )}

      {data && !isLoading && data.content.length === 0 && (
        <EmptyState className="rounded-[28px] border border-sky-100 bg-white/80 py-16">
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
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0f172a]">Agenda consolidé</h2>
              <p className="text-sm text-[#64748b]">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => void reload()} disabled={isLoading}>
                Actualiser
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-base text-[#0f172a]">Suivi des statuts (page)</CardTitle>
              <CardDescription>
                Aperçu immédiat de la répartition sur les rendez-vous affichés.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(
                data.content.reduce(
                  (acc, item) => {
                    acc[item.statut] = (acc[item.statut] ?? 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>,
                ),
              ).map(([status, count]) => (
                <div key={status} className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-[#0369a1]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0891b2]">{status}</p>
                  <p className="mt-1 text-xl font-semibold text-[#0f172a]">{count}</p>
                  <p className="text-xs text-[#0f172a]/60">Rendez-vous correspondants</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <AdminAppointmentsTable appointments={data.content} />
          <Pagination page={filters.page ?? 0} pageCount={Math.max(data.totalPages, 1)} onChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
