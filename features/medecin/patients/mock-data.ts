export interface MedecinPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalAppointments: number;
  notes: string;
}

export const patientsMock: MedecinPatient[] = [
  {
    id: "p1",
    name: "Léa Dupont",
    email: "lea.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    lastVisit: "2024-10-02",
    totalAppointments: 8,
    notes: "Suivi régulier – diabète de type 2 stabilisé.",
  },
  {
    id: "p2",
    name: "Marc Martin",
    email: "marc.martin@example.com",
    phone: "+33 6 98 76 54 32",
    lastVisit: "2024-09-28",
    totalAppointments: 5,
    notes: "Hypertension – surveillance mensuelle recommandée.",
  },
  {
    id: "p3",
    name: "Sonia Diallo",
    email: "sonia.diallo@example.com",
    phone: "+33 7 45 21 98 63",
    lastVisit: "2024-09-15",
    totalAppointments: 6,
    notes: "Programme de rééducation respiratoire en cours.",
  },
];
