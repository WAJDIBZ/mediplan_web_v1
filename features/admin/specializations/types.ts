import type { PaginatedResponse } from "@/types/common";

export interface Specialization {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface SpecializationListItem {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    doctorCount?: number; // Nombre de médecins avec cette spécialité
}

export type SpecializationsResponse = PaginatedResponse<SpecializationListItem>;

export interface SpecializationFilters {
    q?: string; // Recherche par nom
    active?: "true" | "false" | "";
    page?: number;
    size?: number;
    sort?: string;
}

export interface CreateSpecializationPayload {
    name: string;
    description?: string;
    active?: boolean;
}

export interface UpdateSpecializationPayload {
    name?: string;
    description?: string;
    active?: boolean;
}
