import type { PaginatedResponse } from "@/types/common";

export type RecurrenceType = "AUCUNE" | "HEBDOMADAIRE" | "MENSUELLE";

export type JourSemaine = "LUNDI" | "MARDI" | "MERCREDI" | "JEUDI" | "VENDREDI" | "SAMEDI" | "DIMANCHE";

export interface CreneauHoraire {
    jour: JourSemaine;
    heureDebut: string; // Format: "09:00"
    heureFin: string;   // Format: "17:00"
    actif: boolean;
}

export interface Disponibilite {
    id: string;
    medecinId: string;
    date: string; // LocalDate "YYYY-MM-DD" ou ISO timestamp (selon le backend)
    heureDebut: string; // LocalTime "HH:mm" ou ISO timestamp (selon le backend)
    heureFin: string; // LocalTime "HH:mm" ou ISO timestamp (selon le backend)
    actif: boolean;
    recurrence: RecurrenceType;
    commentaire?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DisponibiliteListItem {
    id: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    actif: boolean;
    recurrence: RecurrenceType;
    commentaire?: string;
}

export interface CreateDisponibilitePayload {
    medecinId?: string; // Ajouté automatiquement par l'API depuis le JWT
    date: string; // LocalDate format "YYYY-MM-DD" (ex: "2025-11-17")
    heureDebut: string; // LocalTime format "HH:mm" (ex: "08:00")
    heureFin: string; // LocalTime format "HH:mm" (ex: "16:00")
    recurrence?: RecurrenceType;
    commentaire?: string;
    actif?: boolean;
}

export interface UpdateDisponibilitePayload {
    date?: string;
    heureDebut?: string;
    heureFin?: string;
    actif?: boolean;
    recurrence?: RecurrenceType;
    commentaire?: string;
}

export interface DisponibiliteFilters {
    medecinId?: string;
    dateDebut?: string;
    dateFin?: string;
    actif?: boolean;
    page?: number;
    size?: number;
}

export interface HorairesSemaine {
    lundi: CreneauHoraire[];
    mardi: CreneauHoraire[];
    mercredi: CreneauHoraire[];
    jeudi: CreneauHoraire[];
    vendredi: CreneauHoraire[];
    samedi: CreneauHoraire[];
    dimanche: CreneauHoraire[];
}

export type DisponibilitesResponse = PaginatedResponse<DisponibiliteListItem>;
