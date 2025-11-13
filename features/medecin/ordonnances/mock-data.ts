export interface PrescriptionItem {
  id: string;
  patient: string;
  createdAt: string;
  medications: Array<{ name: string; dosage: string; frequency: string; duration: string }>;
  instructions: string;
}

export const prescriptionsMock: PrescriptionItem[] = [
  {
    id: "rx1",
    patient: "Léa Dupont",
    createdAt: "2024-09-20",
    medications: [
      { name: "Metformine", dosage: "850 mg", frequency: "2 fois / jour", duration: "6 mois" },
    ],
    instructions: "Hydratation quotidienne et activité physique adaptée.",
  },
  {
    id: "rx2",
    patient: "Marc Martin",
    createdAt: "2024-09-12",
    medications: [
      { name: "Ramipril", dosage: "5 mg", frequency: "1 fois / jour", duration: "3 mois" },
      { name: "Aspirine", dosage: "75 mg", frequency: "1 fois / jour", duration: "3 mois" },
    ],
    instructions: "Surveillance tensionnelle hebdomadaire.",
  },
];
