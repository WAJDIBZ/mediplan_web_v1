# Intégration FullCalendar - Guide d'installation

## 📦 Installation

Pour remplacer le calendrier actuel par FullCalendar, installez les packages suivants:

```bash
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/list
```

## 🔧 Configuration

### 1. Créer le composant FullCalendar

Créez `features/medecin/calendrier/components/full-calendar-view.tsx`:

```tsx
"use client";

import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import frLocale from "@fullcalendar/core/locales/fr";

interface FullCalendarViewProps {
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
    borderColor?: string;
    extendedProps?: {
      patientName: string;
      motif?: string;
      statut: string;
    };
  }>;
  onEventClick?: (eventId: string) => void;
}

export function FullCalendarView({
  events,
  onEventClick,
}: FullCalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null);

  return (
    <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridWeek"
        locale={frLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        height="auto"
        events={events}
        eventClick={(info) => {
          if (onEventClick) {
            onEventClick(info.event.id);
          }
        }}
        eventContent={(eventInfo) => {
          return (
            <div className="p-1">
              <div className="font-semibold text-xs truncate">
                {eventInfo.event.extendedProps.patientName}
              </div>
              {eventInfo.event.extendedProps.motif && (
                <div className="text-[10px] truncate opacity-80">
                  {eventInfo.event.extendedProps.motif}
                </div>
              )}
            </div>
          );
        }}
        weekends={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: "09:00",
          endTime: "18:00",
        }}
      />
    </div>
  );
}
```

### 2. Mettre à jour la page calendrier

Modifiez `app/(protected)/medecin/calendrier/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/date";
import { useCalendrierRendezVous } from "@/features/medecin/calendrier/use-calendrier";
import {
  confirmerRendezVous,
  annulerRendezVous,
  marquerHonore,
  marquerAbsent,
} from "@/features/medecin/calendrier/rdv-api";
import { FullCalendarView } from "@/features/medecin/calendrier/components/full-calendar-view";

export default function MedecinCalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { events, isLoading, error, reload } = useCalendrierRendezVous(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Convertir les événements pour FullCalendar
  const fullCalendarEvents = events.map((event) => ({
    id: event.id,
    title: event.patientName,
    start: event.heureDebut,
    end: event.heureFin,
    backgroundColor:
      event.statut === "ANNULE"
        ? "#ef4444"
        : event.statut === "HONORE"
        ? "#22c55e"
        : event.statut === "CONFIRME"
        ? "#3b82f6"
        : "#f59e0b",
    borderColor:
      event.statut === "ANNULE"
        ? "#dc2626"
        : event.statut === "HONORE"
        ? "#16a34a"
        : event.statut === "CONFIRME"
        ? "#2563eb"
        : "#d97706",
    extendedProps: {
      patientName: event.patientName,
      motif: event.motif,
      statut: event.statut,
    },
  }));

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#0f172a]">
          Calendrier des rendez-vous
        </h1>
        <p className="text-sm text-[#64748b]">
          Visualisez vos consultations planifiées avec un calendrier interactif
        </p>
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
        <FullCalendarView
          events={fullCalendarEvents}
          onEventClick={(eventId) => setSelectedEventId(eventId)}
        />
      )}

      {/* Modale de détails - reste identique */}
      {/* ... */}
    </div>
  );
}
```

### 3. Styles CSS

Ajoutez dans `app/globals.css`:

```css
/* FullCalendar custom styles */
.fc {
  font-family: inherit;
}

.fc .fc-button {
  @apply rounded-lg bg-[#2563eb] text-white px-4 py-2 text-sm font-medium hover:bg-[#1d4ed8] transition;
  border: none;
  box-shadow: none;
  text-transform: capitalize;
}

.fc .fc-button:disabled {
  @apply bg-[#cbd5e1] cursor-not-allowed;
}

.fc .fc-button-primary:not(:disabled).fc-button-active {
  @apply bg-[#1e40af];
}

.fc-theme-standard td,
.fc-theme-standard th {
  @apply border-[#e2e8f0];
}

.fc .fc-daygrid-day-number {
  @apply text-[#0f172a] font-medium;
}

.fc .fc-col-header-cell {
  @apply bg-[#f8fafc] text-[#64748b] font-semibold uppercase text-xs;
}

.fc .fc-timegrid-slot {
  @apply border-[#f1f5f9];
}

.fc .fc-event {
  @apply cursor-pointer transition-all hover:opacity-80;
  border-radius: 6px;
}

.fc .fc-event-title {
  @apply font-medium;
}
```

## ✨ Fonctionnalités

Le nouveau calendrier FullCalendar offre:

- **Vues multiples**: Mois, Semaine, Jour, Liste
- **Drag & drop**: Déplacer les rendez-vous (à implémenter)
- **Responsive**: S'adapte aux mobiles
- **Couleurs par statut**: Visualisation rapide des statuts
- **Heures de travail**: Affichage des plages horaires
- **Cliquable**: Ouvrir les détails au clic
- **Localisation FR**: Langue française intégrée

## 🚀 Prochaines étapes

1. Ajouter la modification de date/heure par drag & drop
2. Implémenter la création de RDV directement depuis le calendrier
3. Ajouter des filtres (par statut, par patient)
4. Synchroniser avec Google Calendar (optionnel)

## 📝 Note

Cette intégration nécessite que le backend supporte:

- `PATCH /api/rdv/{id}` pour modifier les RDV
- Les champs `debut` et `fin` au format ISO 8601

## 🔗 Documentation

- [FullCalendar React](https://fullcalendar.io/docs/react)
- [FullCalendar API](https://fullcalendar.io/docs)
