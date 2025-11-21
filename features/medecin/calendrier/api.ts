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
        // Parse debut as local date to avoid timezone offset issues
        const debutDate = new Date(rdv.debut);
        const localDate = `${debutDate.getFullYear()}-${String(debutDate.getMonth() + 1).padStart(2, "0")}-${String(debutDate.getDate()).padStart(2, "0")}`;

        return {
            id: rdv.id,
            patientId: rdv.patientId,
            patientName: rdv.patient?.fullName || "Patient inconnu",
            medecinId: rdv.medecinId,
            date: localDate +1, // Format YYYY-MM-DD using local date
            heureDebut: rdv.debut,
            heureFin: rdv.fin,
            statut: rdv.statut as "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT",
            motif: rdv.motif,
            notes: "",
            createdAt: rdv.debut,
        };
    });
}
