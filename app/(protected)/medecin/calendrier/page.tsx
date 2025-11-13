"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { buildMonthDays, formatDate } from "@/lib/date";
import { calendarEvents } from "@/features/medecin/calendrier/mock-data";

export default function MedecinCalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const monthDays = useMemo(() => buildMonthDays(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof calendarEvents>();
    for (const event of calendarEvents) {
      if (!map.has(event.date)) {
        map.set(event.date, []);
      }
      map.get(event.date)?.push(event);
    }
    return map;
  }, []);

  const selectedEvent = calendarEvents.find((event) => event.id === selectedEventId);

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
                {events.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedEventId(event.id)}
                    className="w-full rounded-xl border border-[#cbd5f5] bg-white px-2 py-2 text-left text-[#1f2937] hover:border-[#2563eb]"
                  >
                    <p className="font-semibold">{event.time}</p>
                    <p className="truncate text-[11px] text-[#64748b]">{event.patient}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <Modal
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEventId(null)}
          title={selectedEvent.title}
          description="Détails du rendez-vous"
        >
          <div className="space-y-3 text-sm text-[#475569]">
            <p>
              <span className="font-semibold text-[#0f172a]">Patient :</span> {selectedEvent.patient}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Date :</span> {formatDate(new Date(selectedEvent.date))} à {selectedEvent.time}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Durée :</span> {selectedEvent.durationMinutes} minutes
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Statut :</span>{" "}
              <Badge
                variant={
                  selectedEvent.status === "ANNULE"
                    ? "danger"
                    : selectedEvent.status === "PLANIFIE"
                    ? "warning"
                    : "success"
                }
              >
                {selectedEvent.status === "PLANIFIE" && "Planifié"}
                {selectedEvent.status === "CONFIRME" && "Confirmé"}
                {selectedEvent.status === "ANNULE" && "Annulé"}
              </Badge>
            </p>
            <p className="text-xs text-[#94a3b8]">
              Pensez à ajouter vos notes de consultation dans l’espace dossier patient après la visite.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
