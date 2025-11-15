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
    date: string; // ISO DateTime string (full timestamp)
    heureDebut: string; // ISO DateTime string (full timestamp)
    heureFin: string; // ISO DateTime string (full timestamp)
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
    date: string; // ISO DateTime string (full timestamp like "2025-11-17T00:00:00.000Z")
    heureDebut: string; // ISO DateTime string (full timestamp like "2025-11-17T08:00:00.000Z")
    heureFin: string; // ISO DateTime string (full timestamp like "2025-11-17T16:00:00.000Z")
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
