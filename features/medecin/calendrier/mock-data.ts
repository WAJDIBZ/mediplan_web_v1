export interface CalendarEvent {
  id: string;
  title: string;
  patient: string;
  date: string; // ISO date
  time: string;
  durationMinutes: number;
  status: "PLANIFIE" | "CONFIRME" | "ANNULE";
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Suivi diabète",
    patient: "Léa Dupont",
    date: new Date().toISOString().split("T")[0],
    time: "08:30",
    durationMinutes: 30,
    status: "CONFIRME",
  },
  {
    id: "evt-2",
    title: "Bilan cardiologique",
    patient: "Marc Martin",
    date: new Date().toISOString().split("T")[0],
    time: "11:00",
    durationMinutes: 45,
    status: "PLANIFIE",
  },
  {
    id: "evt-3",
    title: "Consultation de suivi",
    patient: "Sonia Diallo",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "09:00",
    durationMinutes: 30,
    status: "CONFIRME",
  },
  {
    id: "evt-4",
    title: "Téléconsultation",
    patient: "Paul Bernard",
    date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    time: "16:30",
    durationMinutes: 20,
    status: "PLANIFIE",
  },
];
