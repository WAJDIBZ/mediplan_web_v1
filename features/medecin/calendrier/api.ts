import { apiFetch } from "@/lib/api-client";
import type { RendezVousListItem } from "../dashboard/types";

export interface CalendarEvent extends RendezVousListItem {
    date: string; // Format: YYYY-MM-DD pour le regroupement par date
}

export async function fetchRendezVousByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    // Calculer le premier et dernier jour du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59);

    const response = await apiFetch<{
        content: Array<{
            id: string;
            medecinId: string;
            patientId: string;
            debut: string;
            fin: string;
            statut: string;
            motif?: string;
            patient?: {
                fullName: string;
            };
        }>;
    }>(`/api/rdv?from=${firstDay.toISOString()}&to=${lastDay.toISOString()}`, { authenticated: true });

    return response.content.map((rdv) => {
        // Extract date directly from ISO string to avoid timezone shifts
        // rdv.debut is like "2025-11-21T14:30:00Z" or "2025-11-21T14:30:00"
        const dateOnly = rdv.debut.split("T")[0]; // Get YYYY-MM-DD

        return {
            id: rdv.id,
            patientId: rdv.patientId,
            patientName: rdv.patient?.fullName || "Patient inconnu",
            medecinId: rdv.medecinId,
            date: dateOnly, // Format YYYY-MM-DD directly from backend
            heureDebut: rdv.debut,
            heureFin: rdv.fin,
            statut: rdv.statut as "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT",
            motif: rdv.motif,
            notes: "",
            createdAt: rdv.debut,
        };
    });
}
