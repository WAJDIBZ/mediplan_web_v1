import { apiFetch } from "@/lib/api-client";
import type {
    CreateSpecializationPayload,
    SpecializationFilters,
    SpecializationListItem,
    SpecializationsResponse,
    UpdateSpecializationPayload,
} from "./types";

const BASE_URL = "/api/admin/specialisations";

// Fonction pour récupérer les spécialités depuis les médecins
export async function fetchSpecializations(
    filters: SpecializationFilters = {},
): Promise<SpecializationsResponse> {
    // On récupère tous les utilisateurs avec le rôle MEDECIN
    // Note: On récupère une grande taille pour avoir tous les médecins d'un coup
    const params = new URLSearchParams();
    params.append("role", "MEDECIN");
    params.append("size", "1000"); // Récupérer tous les médecins

    const usersUrl = `/api/admin/users?${params.toString()}`;

    try {
        console.log("🔍 Fetching doctors from:", usersUrl);

        // Récupérer la liste des médecins (sans specialty dans la liste)
        const usersResponse = await apiFetch<{
            content: Array<{
                id: string;
                fullName: string;
                email: string;
                active: boolean;
            }>;
            totalElements: number;
        }>(usersUrl, { authenticated: true });

        console.log("✅ Doctors list received:", usersResponse.content.length, "doctors");

        // Récupérer les détails de chaque médecin pour obtenir leur spécialité
        // Note: Cette approche n'est pas optimale mais nécessaire car l'API liste ne renvoie pas specialty
        const doctorDetailsPromises = usersResponse.content.map(doctor =>
            apiFetch<{
                id: string;
                fullName: string;
                specialty?: string;
                active: boolean;
            }>(`/api/admin/users/${doctor.id}`, { authenticated: true })
                .catch(err => {
                    console.warn(`⚠️ Failed to fetch details for doctor ${doctor.id}:`, err);
                    return { ...doctor, specialty: undefined };
                })
        );

        const doctorsWithDetails = await Promise.all(doctorDetailsPromises);
        console.log("✅ Doctors details received:", doctorsWithDetails.length);

        // Extraire et compter les spécialités uniques
        const specialtyMap = new Map<string, { name: string; count: number; active: boolean }>();

        doctorsWithDetails.forEach(doctor => {
            console.log("👨‍⚕️ Doctor:", doctor.fullName, "- Specialty:", doctor.specialty, "- Active:", doctor.active);
            if (doctor.specialty) {
                const existing = specialtyMap.get(doctor.specialty.toLowerCase());
                if (existing) {
                    existing.count++;
                    // Si au moins un médecin est actif, la spécialité est considérée active
                    if (doctor.active) existing.active = true;
                } else {
                    specialtyMap.set(doctor.specialty.toLowerCase(), {
                        name: doctor.specialty,
                        count: 1,
                        active: doctor.active,
                    });
                }
            }
        });

        console.log("📊 Specialty map:", Array.from(specialtyMap.entries()));

        // Convertir en tableau et filtrer si nécessaire
        let specializations = Array.from(specialtyMap.entries()).map(([key, value]) => ({
            id: key,
            name: value.name,
            description: `Spécialité médicale - ${value.name}`,
            active: value.active,
            doctorCount: value.count,
        }));

        // Filtrer par recherche
        if (filters.q) {
            const query = filters.q.toLowerCase();
            specializations = specializations.filter(spec =>
                spec.name.toLowerCase().includes(query)
            );
        }

        // Filtrer par statut actif
        if (filters.active === "true") {
            specializations = specializations.filter(spec => spec.active);
        } else if (filters.active === "false") {
            specializations = specializations.filter(spec => !spec.active);
        }

        // Pagination manuelle
        const page = filters.page ?? 0;
        const size = filters.size ?? 20;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedSpecializations = specializations.slice(startIndex, endIndex);

        console.log("📄 Final specializations:", paginatedSpecializations);
        console.log("📊 Total:", specializations.length, "Pages:", Math.ceil(specializations.length / size));

        return {
            content: paginatedSpecializations,
            totalElements: specializations.length,
            totalPages: Math.ceil(specializations.length / size),
            size: size,
            number: page,
        };
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des spécialisations:", error);
        // Retourner une réponse vide en cas d'erreur
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: filters.size ?? 20,
            number: filters.page ?? 0,
        };
    }
}

export async function fetchSpecializationById(id: string): Promise<SpecializationListItem> {
    return apiFetch<SpecializationListItem>(`${BASE_URL}/${id}`, { authenticated: true });
}

export async function createSpecialization(
    payload: CreateSpecializationPayload,
): Promise<SpecializationListItem> {
    return apiFetch<SpecializationListItem>(BASE_URL, {
        method: "POST",
        body: payload,
        authenticated: true,
    });
}

export async function updateSpecialization(
    id: string,
    payload: UpdateSpecializationPayload,
): Promise<SpecializationListItem> {
    return apiFetch<SpecializationListItem>(`${BASE_URL}/${id}`, {
        method: "PATCH",
        body: payload,
        authenticated: true,
    });
}

export async function deleteSpecialization(id: string, hard = false): Promise<void> {
    const url = hard ? `${BASE_URL}/${id}?hard=true` : `${BASE_URL}/${id}`;
    return apiFetch<void>(url, { method: "DELETE", authenticated: true });
}

export async function deactivateSpecialization(id: string): Promise<void> {
    return apiFetch<void>(`${BASE_URL}/${id}/deactivate`, {
        method: "POST",
        body: {},
        authenticated: true,
    });
}

export async function reactivateSpecialization(id: string): Promise<void> {
    return apiFetch<void>(`${BASE_URL}/${id}/reactivate`, {
        method: "POST",
        body: {},
        authenticated: true,
    });
}

export async function bulkDeleteSpecializations(ids: string[]): Promise<void> {
    return apiFetch<void>(`${BASE_URL}/bulk/delete`, {
        method: "POST",
        body: { ids },
        authenticated: true,
    });
}
