"use client";

import { useMemo, useState } from "react";

import { CalendarIcon, ClockIcon } from "@/components/icons/mediplan-icons";
import { useToast } from "@/components/feedback/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMonthDays, formatDate } from "@/lib/date";
import { ApiError } from "@/lib/errors";
import { useCalendrierRendezVous } from "@/features/medecin/calendrier/use-calendrier";
import {
  confirmerRendezVous,
  annulerRendezVous,
  marquerHonore,
  marquerAbsent,
} from "@/features/medecin/calendrier/rdv-api";
import { ConsultationFormModal } from "@/features/medecin/consultations/components/consultation-form-modal";

const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

const statusBadge: Record<
  "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT",
  { label: string; variant: "warning" | "success" | "danger" | "info" | "neutral" }
> = {
  PLANIFIE: { label: "Planifié", variant: "warning" },
  CONFIRME: { label: "Confirmé", variant: "success" },
  ANNULE: { label: "Annulé", variant: "danger" },
  HONORE: { label: "Honoré", variant: "info" },
  ABSENT: { label: "Absent", variant: "neutral" },
};

function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3">
        {dayNames.map((day) => (
          <div key={day} className="h-6 rounded-full bg-slate-200/80" />
        ))}
        {Array.from({ length: 35 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default function MedecinCalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [consultationRdvData, setConsultationRdvData] = useState<{ id: string; patientId: string; patientName: string } | null>(null);
  const { notify } = useToast();

  const { events, isLoading, error, reload } = useCalendrierRendezVous(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  const monthDays = useMemo(
    () => buildMonthDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const event of events) {
      if (!map.has(event.date)) {
        map.set(event.date, []);
      }
      map.get(event.date)?.push(event);
    }
    return map;
  }, [events]);

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const handleActionError = (title: string, error: unknown) => {
    console.error(title, error);
    const description =
      error instanceof ApiError ? error.message : "Une erreur inattendue est survenue. Veuillez réessayer.";
    notify({ variant: "error", title, description });
  };

  const handleActionSuccess = (title: string, description?: string) => {
    notify({ variant: "success", title, description });
  };

  const canMarkPresenceForEvent = (event: typeof selectedEvent): boolean => {
    if (!event) return false;
    const now = new Date();
    const rdvStart = new Date(event.heureDebut);
    // Allow marking present/absent only if the RDV start time has passed
    return now >= rdvStart;
  };

  const handleNavigate = (offset: number) => {
    setCurrentDate((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-10 animate-in-up">
      <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-900/10">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_rgba(79,70,229,0.12),_rgba(224,242,254,0.65))]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge variant="info" className="w-fit bg-white/70 text-sky-600">
              Calendrier dynamique
            </Badge>
            <h1 className="text-3xl font-semibold text-slate-900">Votre agenda médical</h1>
            <p className="max-w-xl text-sm text-slate-600">
              Naviguez entre vos créneaux, anticipez les absences et confirmez vos rendez-vous en un instant.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
                <CalendarIcon className="h-4 w-4 text-sky-500" />
                <span>{events.length} rendez-vous ce mois-ci</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2">
                <ClockIcon className="h-4 w-4 text-indigo-500" />
                <span>{formatDate(currentDate, { month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => handleNavigate(-1)}>
              Mois précédent
            </Button>
            <Button variant="secondary" onClick={() => setCurrentDate(new Date())}>
              Aujourd’hui
            </Button>
            <Button variant="secondary" onClick={() => handleNavigate(1)}>
              Mois suivant
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_1fr]">
        <Card className="h-full">
          <CardHeader className="flex-col items-start gap-2">
            <CardTitle className="text-xl text-slate-900">Vue mensuelle</CardTitle>
            <CardDescription>Survolez vos créneaux pour accéder aux détails et ouvrir les actions de suivi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && <CalendarSkeleton />}

            {error && (
              <EmptyState className="rounded-2xl border border-rose-200/80 bg-rose-50/70 py-12">
                <p className="text-sm font-semibold text-rose-600">Erreur : {error.message}</p>
                <p className="mt-1 text-xs text-rose-500">Veuillez actualiser la page ou réessayer plus tard.</p>
              </EmptyState>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-7 gap-3">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
                  >
                    {day}
                  </div>
                ))}

                {monthDays.map((day) => {
                  const iso = day.date.toISOString().split("T")[0];
                  const dayEvents = eventsByDate.get(iso) ?? [];
                  const isToday = day.isToday;

                  return (
                    <div
                      key={iso}
                      className={`flex min-h-[140px] flex-col gap-2 rounded-3xl border bg-white/75 p-3 transition-all duration-200 ${
                        day.isCurrentMonth
                          ? "border-white/70 shadow-sm hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_20px_45px_-28px_rgba(3,105,161,0.5)]"
                          : "border-transparent bg-white/30 text-slate-400"
                      } ${isToday ? "ring-2 ring-offset-2 ring-sky-400" : ""}`}
                    >
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>{day.date.getDate()}</span>
                        {dayEvents.length > 0 && (
                          <span className="rounded-full bg-sky-100/90 px-2 text-xs font-semibold text-sky-600">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-xs">
                        {dayEvents.length === 0 && (
                          <p className="text-[11px] text-slate-400">Aucun rendez-vous</p>
                        )}

                        {dayEvents.map((event) => {
                          const time = new Date(event.heureDebut).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <button
                              key={event.id}
                              type="button"
                              onClick={() => setSelectedEventId(event.id)}
                              className="group w-full rounded-2xl border border-slate-200/70 bg-white/90 px-2 py-2 text-left text-slate-700 transition hover:border-sky-300 hover:bg-sky-50/80"
                            >
                              <p className="font-semibold text-slate-900">{time}</p>
                              <p className="truncate text-[11px] text-slate-500">{event.patientName}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="flex-col items-start gap-2">
            <CardTitle className="text-lg text-slate-900">Légende & statut</CardTitle>
            <CardDescription>Comprenez d’un coup d’œil l’état de vos rendez-vous.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {Object.entries(statusBadge).map(([status, { label, variant }]) => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-slate-700">{label}</span>
                  <Badge variant={variant}>{label}</Badge>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-dashed border-sky-200/70 bg-sky-50/70 p-4 text-xs text-sky-700">
              Astuce : cliquez sur un créneau pour gérer confirmation, annulation ou présence en un geste.
            </div>
          </CardContent>
        </Card>
      </section>

      {selectedEvent && (
        <Modal
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEventId(null)}
          title={`Rendez-vous - ${selectedEvent.patientName}`}
          description="Détails du rendez-vous"
        >
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Patient :</span> {selectedEvent.patientName}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Date :</span>{" "}
              {formatDate(new Date(selectedEvent.heureDebut), { day: "2-digit", month: "long", year: "numeric" })} à{" "}
              {new Date(selectedEvent.heureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Durée :</span>{" "}
              {Math.round(
                (new Date(selectedEvent.heureFin).getTime() - new Date(selectedEvent.heureDebut).getTime()) / 60000,
              )} minutes
            </p>
            {selectedEvent.motif && (
              <p>
                <span className="font-semibold text-slate-900">Motif :</span> {selectedEvent.motif}
              </p>
            )}
            <p className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Statut :</span>
              <Badge variant={statusBadge[selectedEvent.statut].variant}>{statusBadge[selectedEvent.statut].label}</Badge>
            </p>
            {selectedEvent.notes && (
              <p>
                <span className="font-semibold text-slate-900">Notes :</span> {selectedEvent.notes}
              </p>
            )}
            <p className="text-xs text-slate-400">
              Pensez à ajouter vos notes de consultation dans l’espace dossier patient après la visite.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {selectedEvent.statut === "PLANIFIE" && (
              <>
                <Button
                  variant="primary"
                  onClick={async () => {
                    if (confirm("Confirmer ce rendez-vous ?")) {
                      setIsUpdating(true);
                      try {
                        await confirmerRendezVous(selectedEvent.id);
                        await reload();
                        setSelectedEventId(null);
                        handleActionSuccess("Rendez-vous confirmé", "Le patient a été informé.");
                      } catch (error) {
                        handleActionError("Impossible de confirmer le rendez-vous", error);
                      } finally {
                        setIsUpdating(false);
                      }
                    }
                  }}
                  disabled={isUpdating}
                >
                  ✓ Confirmer
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    const motif = prompt("Motif d’annulation (optionnel):");
                    if (motif !== null) {
                      setIsUpdating(true);
                      try {
                        await annulerRendezVous(selectedEvent.id, motif || undefined);
                        await reload();
                        setSelectedEventId(null);
                        handleActionSuccess("Rendez-vous annulé", "Le créneau est libéré.");
                      } catch (error) {
                        handleActionError("Impossible d'annuler le rendez-vous", error);
                      } finally {
                        setIsUpdating(false);
                      }
                    }
                  }}
                  disabled={isUpdating}
                >
                  ✕ Annuler
                </Button>
              </>
            )}

            {selectedEvent.statut === "CONFIRME" && (
              <>
                {canMarkPresenceForEvent(selectedEvent) ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={async () => {
                        setIsUpdating(true);
                        try {
                          await marquerHonore(selectedEvent.id);
                          await reload();
                          // Open consultation form after marking present
                          setConsultationRdvData({
                            id: selectedEvent.id,
                            patientId: selectedEvent.patientId,
                            patientName: selectedEvent.patientName,
                          });
                          setSelectedEventId(null);
                          setConsultationModalOpen(true);
                          handleActionSuccess("Patient présent", "Vous pouvez maintenant créer la consultation.");
                        } catch (error) {
                          handleActionError("Impossible de marquer le rendez-vous comme honoré", error);
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                      disabled={isUpdating}
                    >
                      ✓ Patient présent
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (confirm("Marquer le patient comme absent ?")) {
                          setIsUpdating(true);
                          try {
                            await marquerAbsent(selectedEvent.id);
                            await reload();
                            setSelectedEventId(null);
                            handleActionSuccess("Patient absent", "Statut mis à jour en ABSENT.");
                          } catch (error) {
                            handleActionError("Impossible de marquer le patient absent", error);
                          } finally {
                            setIsUpdating(false);
                          }
                        }
                      }}
                      disabled={isUpdating}
                    >
                      ✕ Absent
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-amber-600 bg-amber-50/80 px-4 py-2 rounded-lg">
                    ⏰ Les actions de présence/absence seront disponibles à partir de l&apos;heure du rendez-vous.
                  </p>
                )}
              </>
            )}

            {(selectedEvent.statut === "ANNULE" ||
              selectedEvent.statut === "HONORE" ||
              selectedEvent.statut === "ABSENT") && (
              <p className="text-sm text-slate-500">
                Ce rendez-vous est terminé ou annulé. Aucune action disponible.
              </p>
            )}
          </div>
        </Modal>
      )}

      {consultationRdvData && (
        <ConsultationFormModal
          open={consultationModalOpen}
          onClose={() => {
            setConsultationModalOpen(false);
            setConsultationRdvData(null);
          }}
          rendezVousId={consultationRdvData.id}
          patientId={consultationRdvData.patientId}
          patientName={consultationRdvData.patientName}
          onSuccess={() => {
            handleActionSuccess("Consultation créée", "La consultation a été enregistrée avec succès.");
            setConsultationModalOpen(false);
            setConsultationRdvData(null);
          }}
          onError={(error) => {
            handleActionError("Impossible de créer la consultation", error);
          }}
        />
      )}
    </div>
  );
}
