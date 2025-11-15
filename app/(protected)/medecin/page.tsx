"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";

import { CalendarIcon, ClockIcon, UsersIcon } from "@/components/icons/mediplan-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useMedecinDashboard } from "@/features/medecin/dashboard/use-medecin-dashboard";
import { quickActions } from "@/features/medecin/dashboard/mock-data";

const statusVariantMap: Record<
  "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT",
  "warning" | "success" | "danger" | "info" | "neutral"
> = {
  PLANIFIE: "warning",
  CONFIRME: "success",
  ANNULE: "danger",
  HONORE: "info",
  ABSENT: "neutral",
};

const statusLabelMap: Record<
  "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT",
  string
> = {
  PLANIFIE: "Planifié",
  CONFIRME: "Confirmé",
  ANNULE: "Annulé",
  HONORE: "Honoré",
  ABSENT: "Absent",
};

function formatTimeLabel(date: string) {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayLabel(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

const numberFormatter = new Intl.NumberFormat("fr-FR");

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in-up">
      <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-8 shadow-lg shadow-slate-900/10">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100/80 via-white to-indigo-100/60" aria-hidden />
        <div className="relative space-y-6">
          <div className="h-6 w-48 rounded-full bg-white/60" />
          <div className="h-10 w-72 rounded-full bg-white/60" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-[26px] bg-slate-200/60" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-2xl" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MedecinDashboardPage() {
  const { stats, rendezVousAujourdhui, prochains, isLoading, error } = useMedecinDashboard();

  const statCards = useMemo(
    () => [
      {
        title: "Patients suivis",
        value: stats?.totalPatients ?? 0,
        description: "Total patientèle",
        icon: UsersIcon,
        accent: "from-sky-400/20 via-sky-200/30 to-sky-100/40",
      },
      {
        title: "RDV aujourd’hui",
        value: stats?.rendezVousAujourdhui ?? 0,
        description: `${stats?.rendezVousSemaine ?? 0} cette semaine`,
        icon: CalendarIcon,
        accent: "from-emerald-400/25 via-emerald-200/30 to-emerald-100/40",
      },
      {
        title: "Taux de présence",
        value: `${stats?.tauxPresence ?? 0}%`,
        description: `${stats?.tempsMoyenConsultation ?? 0} min / consultation`,
        icon: ClockIcon,
        accent: "from-indigo-400/25 via-indigo-200/30 to-indigo-100/40",
      },
    ],
    [stats],
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <EmptyState className="animate-in-up rounded-[32px] border border-rose-200/80 bg-rose-50/60 p-16 text-center">
        <p className="text-sm font-semibold text-rose-700">❌ Erreur de chargement</p>
        <p className="mt-2 text-xs text-rose-600/80">
          Impossible de récupérer vos données. Veuillez réessayer dans quelques instants.
        </p>
      </EmptyState>
    );
  }

  const upcomingTimeline = prochains.slice(0, 5);

  return (
    <div className="space-y-10 animate-in-up">
      <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-900/10">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_rgba(14,165,233,0.12),_rgba(237,233,254,0.7))]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge variant="info" className="w-fit bg-white/70 text-sky-600">
              Tableau de bord quotidien
            </Badge>
            <h1 className="text-3xl font-semibold text-slate-900">
              Bonjour{stats?.totalPatients ? ", docteur" : ""} 👋
            </h1>
            <p className="max-w-xl text-sm text-slate-600">
              Visualisez vos indicateurs clés, vos prochains rendez-vous et accédez rapidement aux actions importantes pour votre
              cabinet.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
                <UsersIcon className="h-4 w-4 text-sky-500" />
                <span>{numberFormatter.format(stats?.totalPatients ?? 0)} patients actifs</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
                <ClockIcon className="h-4 w-4 text-indigo-500" />
                <span>Temps moyen {stats?.tempsMoyenConsultation ?? 0} min</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
                <CalendarIcon className="h-4 w-4 text-emerald-500" />
                <span>{stats?.rendezVousSemaine ?? 0} RDV cette semaine</span>
              </div>
            </div>
          </div>
          <div className="relative flex shrink-0 flex-col items-start gap-3 rounded-[28px] border border-white/60 bg-gradient-to-br from-white via-white/80 to-sky-50 px-6 py-5 shadow-lg shadow-slate-900/10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Focus</p>
            <p className="text-lg font-semibold text-slate-900">
              {stats?.prochainsRendezVous ?? 0} rendez-vous à préparer
            </p>
            <p className="text-sm text-slate-600">
              Consultez les dossiers patients avant leur arrivée pour gagner du temps.
            </p>
            <Link
              href="/medecin/calendrier"
              className="inline-flex items-center gap-2 rounded-2xl border border-sky-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:border-sky-400 hover:text-sky-700"
            >
              Ouvrir le calendrier
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ title, value, description, icon: Icon, accent }) => (
          <Card key={title} className="overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} aria-hidden />
            <div className="relative">
              <CardHeader className="flex-col items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-inner">
                  <Icon className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <CardTitle className="text-base text-slate-800">{title}</CardTitle>
                  <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
                  <CardDescription className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2.1fr_1fr]">
        <Card className="h-full">
          <CardHeader className="flex-col items-start gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="info">Aujourd’hui</Badge>
              <h2 className="text-xl font-semibold text-slate-900">Prochains rendez-vous</h2>
            </div>
            <CardDescription>Préparez vos consultations et anticipez les absences éventuelles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rendezVousAujourdhui.length > 0 ? (
              rendezVousAujourdhui.map((appointment) => {
                const heureDebut = formatTimeLabel(appointment.heureDebut);
                const heureFin = formatTimeLabel(appointment.heureFin);

                return (
                  <div
                    key={appointment.id}
                    className="group flex items-center gap-4 rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_25px_45px_-24px_rgba(14,116,144,0.3)]"
                  >
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-sky-50 text-sm font-semibold text-sky-600">
                      <span>{heureDebut}</span>
                      <span className="text-[10px] text-sky-400">{heureFin}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-900">{appointment.patientName}</p>
                      <p className="text-xs text-slate-500">{appointment.motif || "Consultation générale"}</p>
                    </div>
                    <Badge variant={statusVariantMap[appointment.statut]}>{statusLabelMap[appointment.statut]}</Badge>
                  </div>
                );
              })
            ) : (
              <EmptyState className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-12">
                <p className="text-sm font-semibold text-slate-600">Aucun rendez-vous prévu aujourd’hui.</p>
                <p className="mt-1 text-xs text-slate-500">Consultez votre calendrier pour planifier vos prochaines disponibilités.</p>
              </EmptyState>
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="flex-col items-start gap-1">
            <h2 className="text-xl font-semibold text-slate-900">Actions rapides</h2>
            <CardDescription>Pilotez votre activité en un clin d’œil.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-white/90 to-sky-50 px-4 py-4 text-left transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_20px_45px_-25px_rgba(2,132,199,0.45)]"
              >
                <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                <p className="mt-1 text-xs text-slate-500">{action.description}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex-col items-start gap-2">
            <h2 className="text-xl font-semibold text-slate-900">Timeline à surveiller</h2>
            <CardDescription>Gardez un temps d’avance sur vos prochains rendez-vous importants.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTimeline.length > 0 ? (
              upcomingTimeline.map((event) => (
                <Fragment key={event.id}>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm">
                    <div className="flex flex-col text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      <span>{formatDayLabel(event.heureDebut)}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-900">{event.patientName}</p>
                      <p className="text-xs text-slate-500">{event.motif || "Consultation"}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">{formatTimeLabel(event.heureDebut)}</p>
                      <p>{statusLabelMap[event.statut]}</p>
                    </div>
                  </div>
                </Fragment>
              ))
            ) : (
              <EmptyState className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-12">
                <p className="text-sm font-semibold text-slate-600">Vous êtes à jour.</p>
                <p className="mt-1 text-xs text-slate-500">Planifiez de nouveaux créneaux pour développer votre patientèle.</p>
              </EmptyState>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-emerald-500/10" aria-hidden />
          <div className="relative flex h-full flex-col justify-between gap-6 p-6">
            <div>
              <Badge variant="info" className="bg-white/60 text-sky-600">
                Préconisations du jour
              </Badge>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">Renforcez votre efficacité</h2>
            </div>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="rounded-2xl bg-white/70 px-4 py-3 shadow-sm shadow-slate-900/5">
                <span className="font-semibold text-slate-900">3 rappels SMS</span> en attente – envoyez-les avant midi pour limiter les absences.
              </li>
              <li className="rounded-2xl bg-white/70 px-4 py-3 shadow-sm shadow-slate-900/5">
                <span className="font-semibold text-slate-900">Temps moyen 23 min</span> – finalisez les comptes rendus dès la fin de consultation.
              </li>
              <li className="rounded-2xl bg-white/70 px-4 py-3 shadow-sm shadow-slate-900/5">
                <span className="font-semibold text-slate-900">1 annulation critique</span> – contactez votre liste d’attente pour optimiser votre agenda.
              </li>
            </ul>
            <Link
              href="/medecin/horaires"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              Ajuster mes horaires
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
