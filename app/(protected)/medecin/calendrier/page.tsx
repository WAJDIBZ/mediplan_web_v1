"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { buildMonthDays, formatDate } from "@/lib/date";
import { useCalendrierRendezVous } from "@/features/medecin/calendrier/use-calendrier";

export default function MedecinCalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { events, isLoading, error } = useCalendrierRendezVous(currentDate.getFullYear(), currentDate.getMonth());

  const monthDays = useMemo(() => buildMonthDays(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);

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

  const handleNavigate = (offset: number) => {
    setCurrentDate((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0f172a]">Calendrier des rendez-vous</h1>
          <p className="text-sm text-[#64748b]">Visualisez vos consultations planifiées et anticipez les ajustements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => handleNavigate(-1)}>
            Mois précédent
          </Button>
          <div className="rounded-xl bg-[#eff6ff] px-4 py-2 text-sm font-semibold text-[#1d4ed8]">
            {formatDate(currentDate, { month: "long", year: "numeric" })}
          </div>
          <Button variant="secondary" onClick={() => handleNavigate(1)}>
            Mois suivant
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center shadow-sm">
          <p className="text-[#64748b]">Chargement du calendrier...</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-800">Erreur : {error.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-7 gap-3 rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">
              {day}
            </div>
          ))}
          {monthDays.map((day) => {
            const iso = day.date.toISOString().split("T")[0];
            const events = eventsByDate.get(iso) ?? [];
            const isToday = day.isToday;
            return (
              <div
                key={iso}
                className={`min-h-[120px] rounded-2xl border p-3 transition ${
                  day.isCurrentMonth ? "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#2563eb]" : "border-transparent bg-transparent text-[#94a3b8]"
                } ${isToday ? "ring-2 ring-[#2563eb]" : ""}`}
              >
                <div className="flex items-center justify-between text-sm font-semibold text-[#0f172a]">
                  <span>{day.date.getDate()}</span>
                  {events.length > 0 && (
                    <span className="rounded-full bg-[#2563eb]/10 px-2 text-xs font-semibold text-[#1d4ed8]">
                      {events.length}
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  {events.map((event) => {
                    const time = new Date(event.heureDebut).toLocaleTimeString("fr-FR", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    });
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        className="w-full rounded-xl border border-[#cbd5f5] bg-white px-2 py-2 text-left text-[#1f2937] hover:border-[#2563eb]"
                      >
                        <p className="font-semibold">{time}</p>
                        <p className="truncate text-[11px] text-[#64748b]">{event.patientName}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedEvent && (
        <Modal
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEventId(null)}
          title={`Rendez-vous - ${selectedEvent.patientName}`}
          description="Détails du rendez-vous"
        >
          <div className="space-y-3 text-sm text-[#475569]">
            <p>
              <span className="font-semibold text-[#0f172a]">Patient :</span> {selectedEvent.patientName}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Date :</span>{" "}
              {formatDate(new Date(selectedEvent.heureDebut), { day: "2-digit", month: "long", year: "numeric" })} à{" "}
              {new Date(selectedEvent.heureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Durée :</span>{" "}
              {Math.round((new Date(selectedEvent.heureFin).getTime() - new Date(selectedEvent.heureDebut).getTime()) / 60000)} minutes
            </p>
            {selectedEvent.motif && (
              <p>
                <span className="font-semibold text-[#0f172a]">Motif :</span> {selectedEvent.motif}
              </p>
            )}
            <p>
              <span className="font-semibold text-[#0f172a]">Statut :</span>{" "}
              <Badge
                variant={
                  selectedEvent.statut === "ANNULE"
                    ? "danger"
                    : selectedEvent.statut === "PLANIFIE"
                    ? "warning"
                    : "success"
                }
              >
                {selectedEvent.statut === "PLANIFIE" && "Planifié"}
                {selectedEvent.statut === "CONFIRME" && "Confirmé"}
                {selectedEvent.statut === "ANNULE" && "Annulé"}
                {selectedEvent.statut === "HONORE" && "Honoré"}
                {selectedEvent.statut === "ABSENT" && "Absent"}
              </Badge>
            </p>
            {selectedEvent.notes && (
              <p>
                <span className="font-semibold text-[#0f172a]">Notes :</span> {selectedEvent.notes}
              </p>
            )}
            <p className="text-xs text-[#94a3b8]">
              Pensez à ajouter vos notes de consultation dans l'espace dossier patient après la visite.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
