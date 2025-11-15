"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/features/admin/stats/use-admin-stats";
import { AdminStatsCards } from "@/features/admin/stats/components/admin-stats-cards";
import { AdminTrendsChart } from "@/features/admin/stats/components/admin-trends-chart";
import type { AdminStatsFilters } from "@/features/admin/stats/types";
import { ApiError } from "@/lib/errors";

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState<AdminStatsFilters>({});
  const { data, isLoading, error, reload } = useAdminStats(filters);

  const highlights = useMemo(() => {
    if (!data) {
      return [];
    }
    const total = Math.max(data.totalRendezVous, 1);
    return [
      {
        label: "Rendez-vous honorés",
        value: `${Math.round((data.rendezVousHonores / total) * 100)} %`,
        description: "Taux d’engagement des patients sur la période.",
      },
      {
        label: "Annulations",
        value: `${Math.round((data.rendezVousAnnules / total) * 100)} %`,
        description: "Part des rendez-vous annulés à surveiller.",
      },
      {
        label: "Patients actifs",
        value: data.patientsActifs.toString(),
        description: "Patients suivis activement par vos équipes.",
      },
    ];
  }, [data]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFilters({
      from: (formData.get("from") as string) || undefined,
      to: (formData.get("to") as string) || undefined,
    });
  };

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[32px] border border-[#bfdbfe]/60 bg-gradient-to-r from-[#1d4ed8] via-[#1e40af] to-[#0f172a] p-8 text-white shadow-lg">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
        </div>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              📊 Pilotage administratif
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Vue d’ensemble établissement</h1>
              <p className="mt-3 max-w-2xl text-sm/6 text-white/80">
                Surveillez vos indicateurs clés, détectez les frictions et déployez vos actions prioritaires en un coup d’œil.
              </p>
            </div>
            <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-white/80" htmlFor="from">
                  Du
                </Label>
                <Input id="from" name="from" type="date" defaultValue={filters.from ?? ""} className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white focus:ring-white/60" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-white/80" htmlFor="to">
                  Au
                </Label>
                <Input id="to" name="to" type="date" defaultValue={filters.to ?? ""} className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white focus:ring-white/60" />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full justify-center border-white/30 bg-white text-[#0f172a] hover:border-white hover:bg-white/90"
                >
                  Appliquer
                </Button>
              </div>
            </form>
          </div>
          <div className="grid gap-4">
            <Card className="bg-white/90 backdrop-blur">
              <CardHeader className="pb-0">
                <CardTitle className="text-base text-[#0f172a]">Indicateurs clés</CardTitle>
                <CardDescription>Suivi instantané des tendances principales.</CardDescription>
              </CardHeader>
              <CardContent className="mt-4 grid gap-3">
                {highlights.length === 0 && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-slate-200" />
                    <Skeleton className="h-3 w-2/4 bg-slate-200" />
                  </div>
                )}
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#e2e8f0] bg-white/60 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#1d4ed8]">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold text-[#0f172a]">{item.value}</p>
                    <p className="mt-1 text-xs text-[#475569]">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
        <div className="space-y-12">
          <AdminStatsCards stats={data} />

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <AdminTrendsChart stats={data} />
            <Card className="flex h-full flex-col justify-between">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Gagnez du temps sur les opérations quotidiennes et gardez la main sur vos équipes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    label: "Créer un utilisateur",
                    href: "/admin/utilisateurs",
                    tone: "border-[#2563eb] text-[#1d4ed8] hover:bg-[#dbeafe]",
                    icon: "→",
                  },
                  {
                    label: "Exporter les utilisateurs",
                    href: "/admin/utilisateurs",
                    tone: "border-transparent bg-[#f8fafc] text-[#0f172a] hover:bg-[#e2e8f0]",
                    icon: "↗",
                  },
                  {
                    label: "Consulter les rendez-vous",
                    href: "/admin/rendez-vous",
                    tone: "border-transparent bg-[#f8fafc] text-[#0f172a] hover:bg-[#e2e8f0]",
                    icon: "↗",
                  },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`group flex items-center justify-between rounded-2xl border px-5 py-4 text-sm font-semibold transition duration-200 ${action.tone}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#22d3ee]" />
                      {action.label}
                    </span>
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                      {action.icon}
                    </span>
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Focus qualité des rendez-vous</CardTitle>
              <CardDescription>
                Analysez la répartition entre rendez-vous honorés, confirmés et annulés pour ajuster vos rappels.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Taux d’honorés",
                  value: `${Math.round((data.rendezVousHonores / Math.max(data.totalRendezVous, 1)) * 100)} %`,
                  description: "Maintenez ce taux au-dessus de 80 % pour garantir la satisfaction patients.",
                },
                {
                  title: "Taux d’annulation",
                  value: `${Math.round((data.rendezVousAnnules / Math.max(data.totalRendezVous, 1)) * 100)} %`,
                  description: "Anticipez avec des rappels automatiques et des parcours de rebooking.",
                },
                {
                  title: "Engagement patients",
                  value: data.patientsActifs.toString(),
                  description: "Nombre de patients suivis activement par vos praticiens.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{item.value}</p>
                  <p className="mt-3 text-xs text-[#475569]">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
