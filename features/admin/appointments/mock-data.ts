import type { AdminAppointmentListItem } from "./types";

export const adminAppointmentsMock: AdminAppointmentListItem[] = [
  {
    id: "rdv-001",
    debut: "2024-07-03T08:30:00Z",
    fin: "2024-07-03T09:00:00Z",
    motif: "Consultation de suivi annuel",
    statut: "CONFIRME",
    medecin: {
      id: "med-001",
      fullName: "Dr Élodie Bernard",
      specialty: "Cardiologie",
      email: "elodie.bernard@mediplan.fr",
    },
    patient: {
      id: "pat-001",
      fullName: "Paul Dupont",
      email: "paul.dupont@example.com",
      phone: "+33611223344",
    },
    commentaire: "Patient fidèle, prévoir bilan sanguin.",
    createdAt: "2024-06-01T10:12:00Z",
    updatedAt: "2024-06-28T14:00:00Z",
  },
  {
    id: "rdv-002",
    debut: "2024-07-03T10:00:00Z",
    fin: "2024-07-03T10:30:00Z",
    motif: "Préparation pré-opératoire",
    statut: "PLANIFIE",
    medecin: {
      id: "med-002",
      fullName: "Dr Karim Saidi",
      specialty: "Chirurgie orthopédique",
      email: "karim.saidi@mediplan.fr",
    },
    patient: {
      id: "pat-002",
      fullName: "Lina Roux",
      email: "lina.roux@example.com",
      phone: "+33755667788",
    },
    commentaire: "Envoyer le protocole de préparation au bloc.",
    createdAt: "2024-06-05T09:42:00Z",
    updatedAt: "2024-06-29T07:45:00Z",
  },
  {
    id: "rdv-003",
    debut: "2024-07-04T13:30:00Z",
    fin: "2024-07-04T14:00:00Z",
    motif: "Suivi post-opératoire",
    statut: "ANNULE",
    medecin: {
      id: "med-001",
      fullName: "Dr Élodie Bernard",
      specialty: "Cardiologie",
      email: "elodie.bernard@mediplan.fr",
    },
    patient: {
      id: "pat-003",
      fullName: "Yanis Lefèvre",
      email: "yanis.lefevre@example.com",
    },
    commentaire: "Annulé par le patient - à reprogrammer.",
    createdAt: "2024-06-12T16:20:00Z",
    updatedAt: "2024-07-02T08:10:00Z",
  },
];
