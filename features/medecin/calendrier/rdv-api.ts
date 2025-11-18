import { apiFetch } from "@/lib/api-client";

export interface UpdateRdvPayload {
    statut?: "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT";
    notesPrivees?: string;
    motif?: string;
}

/**
 * Mettre à jour un rendez-vous (statut, notes, etc.)
 */
export async function updateRendezVous(rdvId: string, data: UpdateRdvPayload): Promise<void> {
    await apiFetch(`/api/rdv/${rdvId}/statut`, {
        method: "PATCH",
        authenticated: true,
        body: data,
    });
}

/**
 * Annuler un rendez-vous
 */
export async function annulerRendezVous(rdvId: string, motifAnnulation?: string): Promise<void> {
    await apiFetch(`/api/rdv/${rdvId}/statut`, {
        method: "PATCH",
        authenticated: true,
        body: {
            statut: "ANNULE",
            notesPrivees: motifAnnulation || "Annulé par le médecin",
        },
    });
}

/**
 * Confirmer un rendez-vous
 */
export async function confirmerRendezVous(rdvId: string): Promise<void> {
    await apiFetch(`/api/rdv/${rdvId}/statut`, {
        method: "PATCH",
        authenticated: true,
        body: {
            statut: "CONFIRME",
        },
    });
}

/**
 * Marquer un rendez-vous comme honoré (patient présent)
 */
export async function marquerHonore(rdvId: string, notes?: string): Promise<void> {
    await apiFetch(`/api/rdv/${rdvId}/statut`, {
        method: "PATCH",
        authenticated: true,
        body: {
            statut: "HONORE",
            notesPrivees: notes,
        },
    });
}

/**
 * Marquer un rendez-vous comme absent (patient absent)
 */
export async function marquerAbsent(rdvId: string): Promise<void> {
    await apiFetch(`/api/rdv/${rdvId}/statut`, {
        method: "PATCH",
        authenticated: true,
        body: {
            statut: "ABSENT",
        },
    });
}
