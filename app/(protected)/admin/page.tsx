"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { useAdminStats } from "@/features/admin/stats/use-admin-stats";
import { AdminStatsCards } from "@/features/admin/stats/components/admin-stats-cards";
import { AdminTrendsChart } from "@/features/admin/stats/components/admin-trends-chart";
import type { AdminStatsFilters } from "@/features/admin/stats/types";
import { ApiError } from "@/lib/errors";

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState<AdminStatsFilters>({});
  const { data, isLoading, error, reload } = useAdminStats(filters);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFilters({
      from: (formData.get("from") as string) || undefined,
      to: (formData.get("to") as string) || undefined,
    });
  };

  return (
    <div className="space-y-10">
      <Card className="border-[#dbeafe] bg-[#f8fafc]">
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-xl">Vue d’ensemble</CardTitle>
            <CardDescription>
              Filtrez vos indicateurs par période pour obtenir une vision précise de l’activité médicale.
            </CardDescription>
          </div>
          <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="from">Du</Label>
              <Input id="from" name="from" type="date" defaultValue={filters.from ?? ""} />
            </div>
            <div>
              <Label htmlFor="to">Au</Label>
              <Input id="to" name="to" type="date" defaultValue={filters.to ?? ""} />
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="primary" className="w-full">
                Appliquer
              </Button>
            </div>
          </form>
        </CardHeader>
      </Card>

      {isLoading && (
        <EmptyState className="py-20">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb]">
            ⏳
          </span>
          <p className="text-sm font-medium text-[#2563eb]">Chargement des statistiques...</p>
        </EmptyState>
      )}

      {error && !isLoading && (
        <div className="rounded-3xl border border-[#fecaca] bg-[#fef2f2] p-6 text-sm text-[#991b1b]">
          {error instanceof ApiError ? error.message : "Impossible de récupérer les statistiques."}
          <Button variant="secondary" className="mt-4" onClick={() => reload()}>
            Réessayer
          </Button>
        </div>
      )}

      {data && !error && !isLoading && (
        <div className="space-y-10">
          <AdminStatsCards stats={data} />
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <AdminTrendsChart stats={data} />
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Optimisez votre journée en accédant rapidement aux opérations fréquentes.
                </CardDescription>
              </CardHeader>
              <div className="space-y-3 px-6 pb-6 text-sm text-[#475569]">
                <a
                  href="/admin/utilisateurs"
                  className="inline-flex w-full items-center justify-between rounded-xl border border-[#2563eb] px-4 py-3 font-semibold text-[#1d4ed8] transition hover:bg-[#e0f2fe]"
                >
                  Créer un utilisateur <span aria-hidden>→</span>
                </a>
                <a
                  href="/admin/utilisateurs"
                  className="inline-flex w-full items-center justify-between rounded-xl border border-[#94a3b8] px-4 py-3 font-semibold text-[#475569] transition hover:bg-[#f1f5f9]"
                >
                  Exporter les utilisateurs <span aria-hidden>↗</span>
                </a>
                <a
                  href="/admin/rendez-vous"
                  className="inline-flex w-full items-center justify-between rounded-xl border border-[#94a3b8] px-4 py-3 font-semibold text-[#475569] transition hover:bg-[#f1f5f9]"
                >
                  Consulter les rendez-vous <span aria-hidden>↗</span>
                </a>
              </div>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Focus qualité des rendez-vous</CardTitle>
              <CardDescription>
                Analysez la répartition entre rendez-vous honorés, confirmés et annulés pour ajuster vos rappels.
              </CardDescription>
            </CardHeader>
            <div className="grid gap-4 px-6 pb-8 text-sm text-[#475569] md:grid-cols-3">
              <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">Taux d’honorés</p>
                <p className="mt-2 text-2xl font-semibold text-[#0f172a]">
                  {Math.round((data.rendezVousHonores / Math.max(data.totalRendezVous, 1)) * 100)}%
                </p>
                <p className="mt-3 text-xs text-[#94a3b8]">
                  Objectif : maintenir au-dessus de 80 % pour un engagement optimal des patients.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">Taux d’annulation</p>
                <p className="mt-2 text-2xl font-semibold text-[#0f172a]">
                  {Math.round((data.rendezVousAnnules / Math.max(data.totalRendezVous, 1)) * 100)}%
                </p>
                <p className="mt-3 text-xs text-[#94a3b8]">
                  Lancez des rappels automatiques la veille et proposez la téléconsultation en alternative.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">Engagement patients</p>
                <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{data.patientsActifs}</p>
                <p className="mt-3 text-xs text-[#94a3b8]">
                  Invitez vos patients à activer les notifications SMS et e-mail pour réduire les absences.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
