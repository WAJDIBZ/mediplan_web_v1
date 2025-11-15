import { apiFetch } from "@/lib/api-client";

export interface PatientListItem {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    lastConsultation?: string;
    totalConsultations: number;
}

export async function fetchMesPatients(): Promise<PatientListItem[]> {
    try {
        // Récupérer les RDV du médecin qui contiennent les infos patient
        const rdvResponse = await apiFetch<{
            content: Array<{
                id: string;
                patientId: string;
                patient: {
                    id: string;
                    fullName: string;
                    email: string;
                    phone: string;
                };
                debut: string;
                statut: string;
            }>;
        }>("/api/rdv", { authenticated: true });

        console.log("📥 RDV reçus:", rdvResponse);

        const rdvList = rdvResponse.content || [];

        if (rdvList.length === 0) {
            return [];
        }

        // Regrouper par patient
        const patientsMap = new Map<string, PatientListItem>();

        rdvList.forEach((rdv) => {
            const existing = patientsMap.get(rdv.patientId);

            // Utiliser le fullName de l'objet patient
            const fullName = rdv.patient?.fullName || `Patient ${rdv.patientId.substring(0, 8)}`;

            if (existing) {
                // Compter seulement les RDV honorés comme consultations
                if (rdv.statut === "HONORE") {
                    existing.totalConsultations++;
                }
                const rdvDate = new Date(rdv.debut);
                const lastDate = new Date(existing.lastConsultation || 0);
                if (rdvDate > lastDate) {
                    existing.lastConsultation = rdv.debut;
                }
            } else {
                patientsMap.set(rdv.patientId, {
                    id: rdv.patientId,
                    fullName,
                    email: rdv.patient?.email || "",
                    phone: rdv.patient?.phone,
                    lastConsultation: rdv.debut,
                    totalConsultations: rdv.statut === "HONORE" ? 1 : 0,
                });
            }
        });

        return Array.from(patientsMap.values()).sort((a, b) => {
            const dateA = new Date(a.lastConsultation || 0);
            const dateB = new Date(b.lastConsultation || 0);
            return dateB.getTime() - dateA.getTime();
        });
    } catch (error) {
        console.error("Erreur récupération patients:", error);
        return [];
    }
}
