import { apiFetch } from "@/lib/api-client";
import type {
    CreateDisponibilitePayload,
    Disponibilite,
    DisponibiliteFilters,
    DisponibilitesResponse,
    UpdateDisponibilitePayload,
} from "./types";

// Récupérer l'ID du médecin connecté
async function getCurrentMedecinId(): Promise<string> {
    // TODO: Récupérer depuis le contexte auth ou token JWT
    // Pour l'instant, on utilisera "me" qui sera résolu côté backend
    return "me";
}

export async function fetchDisponibilites(
    filters: DisponibiliteFilters = {},
): Promise<DisponibilitesResponse> {
    const medecinId = await getCurrentMedecinId();
    const params = new URLSearchParams();

    // Utiliser les paramètres from/to selon la documentation
    if (filters.dateDebut) params.append("from", filters.dateDebut);
    if (filters.dateFin) params.append("to", filters.dateFin);
    if (filters.page !== undefined) params.append("page", String(filters.page));
    if (filters.size !== undefined) params.append("size", String(filters.size));

    // Endpoint correct : /api/medecins/{id}/disponibilites
    const url = `/api/medecins/${medecinId}/disponibilites${params.toString() ? `?${params.toString()}` : ""}`;

    // L'API retourne directement un tableau, on doit le convertir en format paginé
    const disponibilites = await apiFetch<Disponibilite[]>(url, { authenticated: true });

    return {
        content: disponibilites.map(d => ({
            id: d.id,
            date: d.date,
            heureDebut: d.heureDebut,
            heureFin: d.heureFin,
            actif: d.actif,
            recurrence: d.recurrence,
            commentaire: d.commentaire,
        })),
        totalElements: disponibilites.length,
        totalPages: 1,
        size: disponibilites.length,
        number: 0,
    };
}

export async function fetchDisponibiliteById(id: string): Promise<Disponibilite> {
    const medecinId = await getCurrentMedecinId();
    return apiFetch<Disponibilite>(`/api/medecins/${medecinId}/disponibilites/${id}`, { authenticated: true });
}

export async function createDisponibilite(
    payload: CreateDisponibilitePayload,
): Promise<Disponibilite> {
    const medecinId = await getCurrentMedecinId();
    console.log("API createDisponibilite - medecinId:", medecinId);
    console.log("API createDisponibilite - payload:", JSON.stringify(payload, null, 2));
    const url = `/api/medecins/${medecinId}/disponibilites`;
    console.log("API createDisponibilite - URL:", url);

    try {
        const result = await apiFetch<Disponibilite>(url, {
            method: "POST",
            body: payload,
            authenticated: true,
        });
        console.log("API createDisponibilite - Succès:", result);
        return result;
    } catch (error) {
        console.error("API createDisponibilite - Erreur:", error);
        throw error;
    }
}

export async function updateDisponibilite(
    id: string,
    payload: UpdateDisponibilitePayload,
): Promise<Disponibilite> {
    const medecinId = await getCurrentMedecinId();
    return apiFetch<Disponibilite>(`/api/medecins/${medecinId}/disponibilites/${id}`, {
        method: "PUT", // Selon la doc, c'est PUT pas PATCH
        body: payload,
        authenticated: true,
    });
}

export async function deleteDisponibilite(id: string): Promise<void> {
    const medecinId = await getCurrentMedecinId();
    return apiFetch<void>(`/api/medecins/${medecinId}/disponibilites/${id}`, {
        method: "DELETE",
        authenticated: true,
    });
}

export async function activateDisponibilite(id: string): Promise<void> {
    // Activation = mise à jour avec actif: true
    const medecinId = await getCurrentMedecinId();
    await apiFetch<Disponibilite>(`/api/medecins/${medecinId}/disponibilites/${id}`, {
        method: "PUT",
        body: { actif: true },
        authenticated: true,
    });
}

export async function deactivateDisponibilite(id: string): Promise<void> {
    // Désactivation = mise à jour avec actif: false
    const medecinId = await getCurrentMedecinId();
    await apiFetch<Disponibilite>(`/api/medecins/${medecinId}/disponibilites/${id}`, {
        method: "PUT",
        body: { actif: false },
        authenticated: true,
    });
}
