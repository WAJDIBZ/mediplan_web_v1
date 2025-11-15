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
    // Récupérer toutes les consultations du médecin
    const consultationsResponse = await apiFetch<{
        content: Array<{
            id: string;
            patientId: string;
            date: string;
            patient?: {
                id: string;
                fullName: string;
                email: string;
                phone?: string;
                dateOfBirth?: string;
            };
        }>;
    }>("/api/consultations", { authenticated: true });

    // Regrouper par patient
    const patientsMap = new Map<string, PatientListItem>();

    consultationsResponse.content.forEach((consultation) => {
        if (consultation.patient) {
            const existing = patientsMap.get(consultation.patientId);

            if (existing) {
                existing.totalConsultations++;
                const consultationDate = new Date(consultation.date);
                const lastDate = new Date(existing.lastConsultation || 0);
                if (consultationDate > lastDate) {
                    existing.lastConsultation = consultation.date;
                }
            } else {
                patientsMap.set(consultation.patientId, {
                    id: consultation.patient.id,
                    fullName: consultation.patient.fullName,
                    email: consultation.patient.email,
                    phone: consultation.patient.phone,
                    dateOfBirth: consultation.patient.dateOfBirth,
                    lastConsultation: consultation.date,
                    totalConsultations: 1,
                });
            }
        }
    });

    return Array.from(patientsMap.values()).sort((a, b) => {
        const dateA = new Date(a.lastConsultation || 0);
        const dateB = new Date(b.lastConsultation || 0);
        return dateB.getTime() - dateA.getTime();
    });
}
