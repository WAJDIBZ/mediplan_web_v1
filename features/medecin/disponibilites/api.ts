import { apiFetch } from "@/lib/api-client";
import { getTokens } from "@/lib/token-storage";
import type {
    CreateDisponibilitePayload,
    Disponibilite,
    DisponibiliteFilters,
    DisponibilitesResponse,
    UpdateDisponibilitePayload,
} from "./types";

// Formater une date en LocalDate (YYYY-MM-DD) pour le backend Spring Boot
export function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Formater une date en LocalTime (HH:mm) pour le backend Spring Boot
export function formatTimeLocal(date: Date): string {
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
}

// Décoder le JWT pour extraire l'ID utilisateur
function decodeJwt(token: string): { sub?: string; userId?: string; id?: string } {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erreur décodage JWT:', error);
        return {};
    }
}

// Récupérer l'ID du médecin connecté depuis le JWT
async function getCurrentMedecinId(): Promise<string> {
    const tokens = getTokens();
    if (!tokens?.accessToken) {
        throw new Error('Token non disponible');
    }

    const decoded = decodeJwt(tokens.accessToken);
    // Le JWT peut contenir l'ID dans 'sub', 'userId', ou 'id'
    const userId = decoded.sub || decoded.userId || decoded.id;

    if (!userId) {
        // Si pas d'ID dans le token, utiliser "me" et laisser le backend gérer
        return "me";
    }

    return userId;
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
    const url = `/api/medecins/${medecinId}/disponibilites`;

    // Le backend exige medecinId dans le body
    const bodyWithMedecinId = {
        ...payload,
        medecinId,
    };

    return apiFetch<Disponibilite>(url, {
        method: "POST",
        body: bodyWithMedecinId,
        authenticated: true,
    });
} export async function updateDisponibilite(
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
