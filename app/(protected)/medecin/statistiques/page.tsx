"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useMedecinDashboard } from "@/features/medecin/dashboard/use-medecin-dashboard";
import { formatDate } from "@/lib/date";

export default function MedecinStatistiquesPage() {
  const { stats, rendezVousAujourdhui, isLoading, error } = useMedecinDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="rounded-4xl bg-gradient-to-br from-[#0ea5e9] via-[#38bdf8] to-[#6366f1] px-8 py-10 shadow-lg">
          <div className="space-y-6">
            <Skeleton className="h-6 w-32 rounded-full bg-white/30" />
            <Skeleton className="h-12 w-80 rounded-2xl bg-white/30" />
            <Skeleton className="h-4 w-64 rounded-full bg-white/20" />
          </div>
        </section>
        <Card className="border-[#dbeafe]">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-40 rounded-full" />
            <Skeleton className="h-3 w-64 rounded-full" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-36 rounded-full" />
                <Skeleton className="h-3 w-48 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState className="py-16">
        <p className="text-sm font-semibold text-[#b91c1c]">❌ Erreur de chargement</p>
        <p className="mt-2 text-xs text-[#64748b]">Impossible de récupérer les statistiques. Veuillez réessayer.</p>
      </EmptyState>
    );
  }

  const rdvParStatut = rendezVousAujourdhui.reduce((acc, rdv) => {
    acc[rdv.statut] = (acc[rdv.statut] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRdvMois = stats?.rendezVousSemaine ? stats.rendezVousSemaine * 4 : 0;
  const moyenneRdvParJour = stats?.rendezVousSemaine ? (stats.rendezVousSemaine / 7).toFixed(1) : 0;

  const insights: Array<{ title: string; description: string; tone: "warn" | "info" | "success" | "tip" }> = [];

  if (stats && stats.tauxPresence < 80) {
    insights.push({
      title: `💡 Taux de présence faible (${stats.tauxPresence}%)`,
      description: "Activez les rappels SMS 24h avant le rendez-vous pour réduire les absences.",
      tone: "warn",
    });
  }
  if (stats && stats.tempsMoyenConsultation > 30) {
    insights.push({
      title: `⏱️ Consultations longues (${stats.tempsMoyenConsultation} min)`,
      description: "Préparez les dossiers en amont et ajoutez des notes structurées pour fluidifier la rencontre.",
      tone: "info",
    });
  }
  if (stats && stats.rendezVousSemaine < 10) {
    insights.push({
      title: `📅 Peu de rendez-vous cette semaine (${stats.rendezVousSemaine})`,
      description: "Proposez de nouveaux créneaux ou envoyez une campagne e-mail à vos patients.",
      tone: "tip",
    });
  }
  if (insights.length === 0 && stats) {
    insights.push({
      title: "✨ Excellente performance !",
      description: "Votre organisation est optimale. Continuez sur cette lancée !",
      tone: "success",
    });
  }

  const statutColorMap: Record<string, string> = {
    HONORE: "bg-[#dcfce7] text-[#166534]",
    CONFIRME: "bg-[#dbeafe] text-[#1d4ed8]",
    PLANIFIE: "bg-[#fef3c7] text-[#b45309]",
    ANNULE: "bg-[#fee2e2] text-[#b91c1c]",
    ABSENT: "bg-[#e2e8f0] text-[#475569]",
  };

  return (
    <div className="space-y-10">
      <section className="rounded-4xl bg-gradient-to-br from-[#0ea5e9] via-[#38bdf8] to-[#6366f1] px-8 py-10 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
              Statistiques
            </Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold md:text-4xl">Pilotez votre activité en un coup d&apos;œil</h1>
              <p className="text-sm text-white/80 md:text-base">
                Suivez vos rendez-vous, identifiez les tendances et transformez vos données en actions concrètes.
              </p>
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-white/60">RDV aujourd&apos;hui</p>
              <p className="text-4xl font-semibold">{stats?.rendezVousAujourdhui ?? 0}</p>
              <p className="text-xs text-white/70">{stats?.rendezVousSemaine ?? 0} cette semaine</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-white/60">Taux de présence</p>
              <p className="text-3xl font-semibold">{stats?.tauxPresence ?? 0}%</p>
              <p className="text-xs text-white/70">Comparé à la semaine dernière</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#cbd5f5] bg-white shadow-sm shadow-sky-100/60">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-wide text-[#2563eb]">Patients suivis</CardDescription>
            <CardTitle className="text-3xl text-[#0f172a]">{stats?.totalPatients ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#64748b]">Total des patients actifs dans votre patientèle.</CardContent>
        </Card>
        <Card className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] shadow-sm shadow-sky-100/60">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-wide text-[#0ea5e9]">RDV hebdomadaires</CardDescription>
            <CardTitle className="text-3xl text-[#0f172a]">{stats?.rendezVousSemaine ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#64748b]">Soit {moyenneRdvParJour} en moyenne par jour.</CardContent>
        </Card>
        <Card className="border-[#cbd5f5] bg-white shadow-sm shadow-sky-100/60">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-wide text-[#2563eb]">Estimation mensuelle</CardDescription>
            <CardTitle className="text-3xl text-[#0f172a]">~{totalRdvMois}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#64748b]">Projection basée sur votre activité actuelle.</CardContent>
        </Card>
        <Card className="border-[#cbd5f5] bg-white shadow-sm shadow-sky-100/60">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-wide text-[#2563eb]">Temps moyen</CardDescription>
            <CardTitle className="text-3xl text-[#0f172a]">{stats?.tempsMoyenConsultation ?? 0} min</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#64748b]">Durée moyenne d&apos;une consultation honorée.</CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Activité hebdomadaire</CardTitle>
            <CardDescription>Visualisez vos chiffres clés sur la période courante.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#475569]">
            <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
              <span>Rendez-vous planifiés</span>
              <span className="text-lg font-semibold text-[#0f172a]">{stats?.rendezVousSemaine ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] px-4 py-3">
              <span>Moyenne par jour</span>
              <span className="text-lg font-semibold text-[#0f172a]">{moyenneRdvParJour}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] px-4 py-3">
              <span>Estimation mensuelle</span>
              <span className="text-lg font-semibold text-[#0f172a]">~{totalRdvMois}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] px-4 py-3">
              <span>Taux de remplissage</span>
              <span className="text-lg font-semibold text-[#166534]">{stats?.tauxPresence ?? 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Répartition des statuts</CardTitle>
            <CardDescription>Statut des consultations du jour.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#0f172a]">
            {[
              { label: "Honorés", key: "HONORE" },
              { label: "Confirmés", key: "CONFIRME" },
              { label: "Planifiés", key: "PLANIFIE" },
              { label: "Annulés", key: "ANNULE" },
              { label: "Absents", key: "ABSENT" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] px-4 py-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statutColorMap[key]?.split(" ")[0] ?? "bg-[#e2e8f0]"}`} />
                  <span className="text-[#475569]">{label}</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statutColorMap[key] ?? "bg-[#f8fafc] text-[#475569]"}`}>
                  {rdvParStatut[key] || 0}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="border-[#dbeafe]">
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
          <CardDescription>Vos consultations les plus proches.</CardDescription>
        </CardHeader>
        <CardContent>
          {rendezVousAujourdhui.length > 0 ? (
            <div className="space-y-4">
              {rendezVousAujourdhui.map((rdv) => {
                const heureDebut = new Date(rdv.heureDebut).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const date = formatDate(new Date(rdv.heureDebut), {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });

                return (
                  <div
                    key={rdv.id}
                    className="flex flex-col gap-4 rounded-3xl border border-[#e2e8f0] bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#0f172a]">{rdv.patientName}</p>
                      <p className="text-xs text-[#64748b]">{rdv.motif || "Consultation générale"}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#1f2937]">
                      <div className="text-right">
                        <p className="font-semibold">{date}</p>
                        <p className="text-xs text-[#64748b]">{heureDebut}</p>
                      </div>
                      <span className={`rounded-full px-4 py-1 text-xs font-semibold ${statutColorMap[rdv.statut] ?? "bg-[#f8fafc] text-[#475569]"}`}>
                        {rdv.statut}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-10 text-center text-sm text-[#64748b]">
              Aucun rendez-vous récent.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#e0f2fe] bg-gradient-to-br from-[#eff6ff] to-white">
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
          <CardDescription>Transformez vos indicateurs en plans d&apos;actions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`rounded-3xl border px-4 py-4 text-sm text-[#1f2937] ${
                insight.tone === "warn"
                  ? "border-amber-200 bg-amber-50"
                  : insight.tone === "info"
                  ? "border-blue-200 bg-blue-50"
                  : insight.tone === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-purple-200 bg-purple-50"
              }`}
            >
              <p className="font-semibold">{insight.title}</p>
              <p className="mt-1 text-xs text-[#475569]">{insight.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
