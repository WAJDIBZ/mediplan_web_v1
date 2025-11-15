import { apiFetch } from "@/lib/api-client";

export interface Medicament {
    nom: string;
    dosage: string;
    frequence: string;
    duree: string;
}

export interface PrescriptionListItem {
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    medicaments: Medicament[];
    consultationId: string;
}

export interface CreatePrescriptionData {
    consultationId: string;
    patientId: string;
    medicaments: Medicament[];
}

export async function fetchMesPrescriptions(): Promise<PrescriptionListItem[]> {
    const response = await apiFetch<{
        content: Array<{
            id: string;
            patientId: string;
            consultationId: string;
            date: string;
            medicaments: Medicament[];
            patient?: {
                fullName: string;
            };
        }>;
    }>("/api/prescriptions", { authenticated: true });

    return response.content.map((prescription) => ({
        id: prescription.id,
        patientId: prescription.patientId,
        patientName: prescription.patient?.fullName || "Patient inconnu",
        date: prescription.date,
        medicaments: prescription.medicaments,
        consultationId: prescription.consultationId,
    }));
}

export async function createPrescription(data: CreatePrescriptionData): Promise<PrescriptionListItem> {
    const response = await apiFetch<{
        id: string;
        patientId: string;
        consultationId: string;
        date: string;
        medicaments: Medicament[];
        patient?: {
            fullName: string;
        };
    }>("/api/prescriptions", {
        method: "POST",
        authenticated: true,
        body: JSON.stringify(data),
    });

    return {
        id: response.id,
        patientId: response.patientId,
        patientName: response.patient?.fullName || "Patient inconnu",
        date: response.date,
        medicaments: response.medicaments,
        consultationId: response.consultationId,
    };
}
