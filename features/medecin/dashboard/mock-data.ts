export interface MedecinStatCard {
  title: string;
  value: string;
  variation: string;
  positive?: boolean;
}

export interface MedecinAppointment {
  id: string;
  patient: string;
  horaire: string;
  motif: string;
  statut: "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE";
}

export interface MedecinQuickAction {
  label: string;
  description: string;
  href: string;
}

export const statCards: MedecinStatCard[] = [
  { title: "Rendez-vous de la semaine", value: "24", variation: "+8%", positive: true },
  { title: "Taux d’honorés", value: "92%", variation: "-3%" },
  { title: "Temps moyen de consultation", value: "23 min", variation: "Stable", positive: true },
];

export const todayAppointments: MedecinAppointment[] = [
  {
    id: "1",
    patient: "Léa Dupont",
    horaire: "08:30",
    motif: "Suivi diabète",
    statut: "CONFIRME",
  },
  {
    id: "2",
    patient: "Marc Martin",
    horaire: "09:15",
    motif: "Contrôle tension",
    statut: "PLANIFIE",
  },
  {
    id: "3",
    patient: "Sonia Diallo",
    horaire: "10:00",
    motif: "Résultats analyses",
    statut: "CONFIRME",
  },
  {
    id: "4",
    patient: "Thomas Morel",
    horaire: "11:30",
    motif: "Pré-opératoire",
    statut: "ANNULE",
  },
];

export const quickActions: MedecinQuickAction[] = [
  {
    label: "Ajouter une disponibilité",
    description: "Publiez vos créneaux de consultation en quelques secondes.",
    href: "/medecin/calendrier",
  },
  {
    label: "Envoyer une ordonnance",
    description: "Préparez et partagez une ordonnance sécurisée.",
    href: "/medecin/ordonnances",
  },
  {
    label: "Consulter un dossier patient",
    description: "Accédez à l’historique complet et aux recommandations.",
    href: "/medecin/patients",
  },
];
