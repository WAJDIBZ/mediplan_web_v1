"use client";

import { useEffect, useMemo, useState } from "react";

import { CalendarIcon, ClockIcon } from "@/components/icons/mediplan-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { HorairesScheduleEditor } from "@/features/medecin/disponibilites/components/horaires-schedule-editor";
import { useDisponibilites } from "@/features/medecin/disponibilites/use-disponibilites";
import { formatDateLocal, formatTimeLocal } from "@/features/medecin/disponibilites/api";
import { ApiError } from "@/lib/errors";
import type { HorairesSemaine, JourSemaine } from "@/features/medecin/disponibilites/types";

export default function MedecinHorairesPage() {
  const { disponibilites, createDisponibilite, isLoading, reload } = useDisponibilites();
  const [horaires, setHoraires] = useState<HorairesSemaine>({
    lundi: [],
    mardi: [],
    mercredi: [],
    jeudi: [],
    vendredi: [],
    samedi: [],
    dimanche: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const normalizeTime = (time: string): string => {
    if (!time) return "00:00";

    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.substring(0, 5);
    }

    try {
      const date = new Date(time);
      if (!Number.isNaN(date.getTime())) {
        return formatTimeLocal(date);
      }
    } catch (error) {
      console.error("Erreur conversion heure:", time, error);
    }

    return time;
  };

  useEffect(() => {
    if (!disponibilites || disponibilites.length === 0 || isInitialized) return;

    const horairesByJour: HorairesSemaine = {
      lundi: [],
      mardi: [],
      mercredi: [],
      jeudi: [],
      vendredi: [],
      samedi: [],
      dimanche: [],
    };

    disponibilites.forEach((dispo) => {
      if (dispo.recurrence !== "HEBDOMADAIRE" || !dispo.actif) return;

      const date = new Date(dispo.date);
      const jourIndex = date.getDay();

      const joursMap: Record<number, keyof HorairesSemaine> = {
        0: "dimanche",
        1: "lundi",
        2: "mardi",
        3: "mercredi",
        4: "jeudi",
        5: "vendredi",
        6: "samedi",
      };

      const jour = joursMap[jourIndex];
      if (!jour) return;

      const heureDebutNormalized = normalizeTime(dispo.heureDebut);
      const heureFinNormalized = normalizeTime(dispo.heureFin);

      horairesByJour[jour].push({
        jour: jour.toUpperCase() as JourSemaine,
        heureDebut: heureDebutNormalized,
        heureFin: heureFinNormalized,
        actif: dispo.actif,
      });
    });

    setHoraires(horairesByJour);
    setIsInitialized(true);
  }, [disponibilites, isInitialized]);

  const activeSummary = useMemo(() => {
    const active = Object.entries(horaires)
      .map(([jour, creneaux]) => ({
        jour,
        creneauxActifs: creneaux.filter((creneau) => creneau.actif),
      }))
      .filter((item) => item.creneauxActifs.length > 0);

    const totalSlots = active.reduce((sum, item) => sum + item.creneauxActifs.length, 0);

    return {
      active,
      totalSlots,
    };
  }, [horaires]);

  const handleSave = async () => {
    const hasActiveSlot = Object.values(horaires).some((creneaux) => creneaux.some((c) => c.actif));

    if (!hasActiveSlot) {
      alert("⚠️ Veuillez définir au moins un créneau horaire actif");
      return;
    }

    let hasInvalidTime = false;
    Object.entries(horaires).forEach(([jour, creneaux]) => {
      creneaux.forEach((creneau) => {
        if (creneau.actif) {
          const [debutH, debutM] = creneau.heureDebut.split(":").map(Number);
          const [finH, finM] = creneau.heureFin.split(":").map(Number);
          const debutMinutes = debutH * 60 + debutM;
          const finMinutes = finH * 60 + finM;

          if (debutMinutes >= finMinutes) {
            alert(
              `⚠️ Erreur le ${jour}: l’heure de début (${creneau.heureDebut}) doit être avant l’heure de fin (${creneau.heureFin})`,
            );
            hasInvalidTime = true;
          }
        }
      });
    });

    if (hasInvalidTime) {
      return;
    }

    setIsSaving(true);
    try {
      const promises: Promise<unknown>[] = [];

      Object.entries(horaires).forEach(([jour, creneaux]) => {
        creneaux.forEach((creneau) => {
          if (creneau.actif) {
            const today = new Date();
            const currentDay = today.getDay();

            const jourIndex = {
              dimanche: 0,
              lundi: 1,
              mardi: 2,
              mercredi: 3,
              jeudi: 4,
              vendredi: 5,
              samedi: 6,
            }[jour] || 0;

            let daysUntilTarget = jourIndex - currentDay;
            if (daysUntilTarget <= 0) {
              daysUntilTarget += 7;
            }

            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + daysUntilTarget);

            const [heureDebutH, heureDebutM] = creneau.heureDebut.split(":");
            const [heureFinH, heureFinM] = creneau.heureFin.split(":");

            const heureDebut = new Date(targetDate);
            heureDebut.setHours(parseInt(heureDebutH, 10), parseInt(heureDebutM, 10), 0, 0);

            const heureFin = new Date(targetDate);
            heureFin.setHours(parseInt(heureFinH, 10), parseInt(heureFinM, 10), 0, 0);

            const payload = {
              date: formatDateLocal(targetDate),
              heureDebut: formatTimeLocal(heureDebut),
              heureFin: formatTimeLocal(heureFin),
              recurrence: "HEBDOMADAIRE" as const,
              commentaire: `Disponibilité ${jour}`,
              actif: true,
            };

            promises.push(createDisponibilite(payload));
          }
        });
      });

      await Promise.all(promises);

      await reload();
      setIsInitialized(false);

      alert("✅ Horaires enregistrés avec succès !");
    } catch (error) {
      if (error instanceof ApiError) {
        let errorMessage = error.message;

        if (error.details && Object.keys(error.details).length > 0) {
          const detailsList = Object.entries(error.details)
            .map(([field, msg]) => `- ${field}: ${msg}`)
            .join("\n");
          errorMessage += `\n\n${detailsList}`;
        }

        alert(`❌ Erreur (${error.status})\n\n${errorMessage}`);
      } else if (error instanceof Error) {
        alert(`❌ Erreur: ${error.message}`);
      } else {
        alert("❌ Erreur inconnue lors de l’enregistrement des horaires");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-in-up">
      <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-900/10">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_rgba(59,130,246,0.12),_rgba(224,242,254,0.7))]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge variant="info" className="w-fit bg-white/70 text-sky-600">
              Disponibilités récurrentes
            </Badge>
            <h1 className="text-3xl font-semibold text-slate-900">Organisez vos horaires de consultation</h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Activez les jours ouverts, ajoutez vos créneaux et enregistrez pour que vos patients puissent réserver en toute sérénité.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
                <CalendarIcon className="h-4 w-4 text-sky-500" />
                <span>{activeSummary.totalSlots} créneaux actifs</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
                <ClockIcon className="h-4 w-4 text-indigo-500" />
                <span>Synchronisé avec votre agenda en temps réel</span>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/60 bg-white/80 px-6 py-5 shadow-lg shadow-slate-900/10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Aperçu</p>
            {activeSummary.active.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {activeSummary.active.slice(0, 4).map((item) => (
                  <li key={item.jour} className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 capitalize">{item.jour}</span>
                    <span>{item.creneauxActifs.length} créneau(x)</span>
                  </li>
                ))}
                {activeSummary.active.length > 4 && (
                  <li className="text-xs text-slate-500">
                    + {activeSummary.active.length - 4} autres jours actifs
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Aucun jour actif pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
        <Card className="h-full">
          <CardHeader className="flex-col items-start gap-2">
            <CardTitle className="text-xl text-slate-900">Configurer mes disponibilités</CardTitle>
            <CardDescription>Ajoutez plusieurs créneaux par jour pour refléter vos temps de consultation réels.</CardDescription>
          </CardHeader>
          <CardContent>
            <HorairesScheduleEditor horaires={horaires} onChangeAction={setHoraires} />
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="flex-col items-start gap-2">
            <CardTitle className="text-lg text-slate-900">Résumé en direct</CardTitle>
            <CardDescription>
              Un récapitulatif des jours actifs et du nombre de créneaux disponibles pour vos patients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSummary.active.length > 0 ? (
              <ul className="space-y-3 text-sm text-slate-600">
                {activeSummary.active.map((item) => (
                  <li
                    key={item.jour}
                    className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3"
                  >
                    <span className="font-semibold text-slate-800 capitalize">{item.jour}</span>
                    <Badge variant="info" className="bg-sky-100/80 text-sky-600">
                      {item.creneauxActifs.length} créneau(x)
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-12 text-center">
                <p className="text-sm font-semibold text-slate-600">Aucun créneau défini pour l’instant.</p>
                <p className="mt-1 text-xs text-slate-500">Activez un jour pour commencer à recevoir des patients.</p>
              </EmptyState>
            )}
          </CardContent>
        </Card>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setHoraires({
              lundi: [],
              mardi: [],
              mercredi: [],
              jeudi: [],
              vendredi: [],
              samedi: [],
              dimanche: [],
            });
            setIsInitialized(false);
          }}
        >
          Réinitialiser
        </Button>
        <Button onClick={handleSave} disabled={isSaving || isLoading} loading={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer les horaires"}
        </Button>
      </div>

      <Card className="border border-amber-200/60 bg-amber-50/70">
        <CardHeader className="flex-col items-start gap-2">
          <CardTitle className="text-lg text-amber-800">📋 Conseils d’utilisation</CardTitle>
          <CardDescription className="text-sm text-amber-700">
            Optimisez votre présence en cabinet grâce à ces bonnes pratiques.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-amber-700">
            <li>Activez uniquement les jours où vous consultez réellement.</li>
            <li>Découpez vos journées (matin / après-midi) pour laisser respirer vos rendez-vous.</li>
            <li>Actualisez vos créneaux dès qu’un changement survient dans votre agenda.</li>
            <li>Combinez ces disponibilités avec les rappels SMS pour réduire les absences.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
