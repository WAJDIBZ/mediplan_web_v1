"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatsCards } from "@/features/admin/stats/components/admin-stats-cards";
import { AdminTrendsChart } from "@/features/admin/stats/components/admin-trends-chart";
import { useAdminStats } from "@/features/admin/stats/use-admin-stats";
import type { AdminStatsFilters } from "@/features/admin/stats/types";
import { exportAdminStats } from "@/features/admin/stats/api";
import { ApiError } from "@/lib/errors";
import { downloadBlob } from "@/lib/download";
import { useToast } from "@/components/feedback/toast-provider";

export default function AdminStatisticsPage() {
  const [filters, setFilters] = useState<AdminStatsFilters>({});
  const [isExporting, setIsExporting] = useState(false);
  const { notify } = useToast();
  const { data, error, isLoading, reload } = useAdminStats(filters);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFilters({
      from: (formData.get("from") as string) || undefined,
      to: (formData.get("to") as string) || undefined,
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportAdminStats(filters);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadBlob(blob, `statistiques-mediplan-${timestamp}.csv`);
      notify({
        variant: "success",
        title: "Export lancé",
        description: "Le fichier CSV des statistiques a été téléchargé.",
      });
    } catch (exportError) {
      notify({
        variant: "error",
        title: "Export impossible",
        description:
          exportError instanceof ApiError
            ? exportError.message
            : "Nous n’avons pas pu exporter les statistiques. Réessayez plus tard.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const insights = useMemo(() => {
    if (!data) {
      return [];
    }
    const total = Math.max(data.totalRendezVous, 1);
    return [
      {
        title: "Taux de confirmation",
        value: `${Math.round((data.rendezVousConfirmes / total) * 100)} %`,
        description:
          "Mesurez la fiabilité des engagements et identifiez les spécialités à renforcer côté rappel patient.",
      },
      {
        title: "Taux d’annulation",
        value: `${Math.round((data.rendezVousAnnules / total) * 100)} %`,
        description:
          "Concentrez vos efforts sur les créneaux les plus volatils pour optimiser le planning du personnel.",
      },
      {
        title: "Patients actifs",
        value: `${data.patientsActifs}`,
        description:
          "Un patient actif correspond à un rendez-vous honoré sur les 6 derniers mois : surveillez cette tendance.",
      },
      {
        title: "Médecins actifs",
        value: `${data.medecinsActifs}`,
        description:
          "Identifiez les praticiens nécessitant un accompagnement pour maximiser l’adoption de MediPlan.",
      },
    ];
  }, [data]);

  const statusBreakdown = useMemo(() => {
    if (!data) {
      return [];
    }
    const items = [
      { label: "Planifiés", value: data.rendezVousPlanifies, tone: "text-[#2563eb]" },
      { label: "Confirmés", value: data.rendezVousConfirmes, tone: "text-[#16a34a]" },
      { label: "Annulés", value: data.rendezVousAnnules, tone: "text-[#f97316]" },
      { label: "Honorés", value: data.rendezVousHonores, tone: "text-[#0f172a]" },
    ];
    const total = Math.max(data.totalRendezVous, 1);
    return items.map((item) => ({
      ...item,
      ratio: Math.round((item.value / total) * 100),
    }));
  }, [data]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-[#c7d2fe]/80 bg-gradient-to-br from-[#eef2ff] via-white to-[#f9fafb] p-8 shadow-inner">
        <div className="absolute inset-0 opacity-60" aria-hidden>
          <div className="absolute left-4 top-6 h-24 w-24 rounded-full bg-indigo-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[#4338ca]">
              📈 Intelligence opérationnelle
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-[#1e1b4b]">Statistiques avancées</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#312e81]/80">
                Analysez vos tendances clés, mesurez l’engagement patient/médecin et exportez un reporting prêt pour vos comités de pilotage.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => reload()} disabled={isLoading}>
              Actualiser
            </Button>
            <Button variant="primary" onClick={handleExport} disabled={isExporting || isLoading}>
              {isExporting ? "Export en cours..." : "Exporter en CSV"}
            </Button>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-[28px] border border-[#e0e7ff] bg-white/95 p-6 shadow-lg shadow-indigo-950/5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <Label htmlFor="from">Du</Label>
          <Input id="from" name="from" type="date" defaultValue={filters.from ?? ""} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="to">Au</Label>
          <Input id="to" name="to" type="date" defaultValue={filters.to ?? ""} disabled={isLoading} />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <Button type="submit" variant="primary" disabled={isLoading} className="w-full sm:w-auto">
            Appliquer les filtres
          </Button>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            className="w-full sm:w-auto"
            onClick={() => {
              setFilters({});
              reload();
            }}
          >
            Réinitialiser
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="rounded-[28px] border border-[#e0e7ff] bg-[#eef2ff]/60 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#4338ca]">Chargement</p>
              <p className="text-xs text-[#4338ca]/80">Récupération des métriques consolidées...</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4338ca]">⏳</span>
          </div>
          <div className="mt-6 grid gap-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={`stats-skeleton-${index}`} className="h-16 w-full rounded-2xl bg-white/80" />
            ))}
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-[28px] border border-[#fecaca] bg-[#fef2f2] p-6 text-sm text-[#991b1b]">
          {error instanceof ApiError
            ? error.message
            : "Impossible de charger les statistiques avancées pour le moment."}
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-8">
          <AdminStatsCards stats={data} />

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <AdminTrendsChart stats={data} />
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
                <CardDescription>
                  Comprenez la ventilation des rendez-vous sur la période sélectionnée.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {statusBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div>
                      <p className={`font-semibold ${item.tone}`}>{item.label}</p>
                      <p className="text-xs text-[#94a3b8]">{item.value} rendez-vous</p>
                    </div>
                    <span className="text-sm font-medium text-[#0f172a]">{item.ratio} %</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Insights opérationnels</CardTitle>
              <CardDescription>
                Appuyez-vous sur ces indicateurs pour préparer vos comités de pilotage et actions correctives.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {insights.map((insight) => (
                <div key={insight.title} className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">{insight.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{insight.value}</p>
                  <p className="mt-3 text-sm text-[#475569]">{insight.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
