import { apiFetch } from "@/lib/api-client";
import { getTokens } from "@/lib/token-storage";

// Fonction pour décoder le JWT et extraire l'ID utilisateur
function decodeJwt(token: string): Record<string, unknown> {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join(""),
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Erreur décodage JWT:", error);
        return {};
    }
}

async function getCurrentMedecinId(): Promise<string> {
    const tokens = getTokens();
    if (!tokens?.accessToken) {
        throw new Error("Token non disponible");
    }

    const decoded = decodeJwt(tokens.accessToken);
    const userId = decoded.sub || decoded.userId || decoded.id;

    if (!userId) {
        return "me";
    }

    return userId as string;
}

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
    medecinId?: string; // Ajouté automatiquement
    medicaments: Medicament[];
    instructionsGenerales?: string; // Instructions générales optionnelles
}

export async function fetchMesPrescriptions(): Promise<PrescriptionListItem[]> {
    // Récupérer les prescriptions et les RDV en parallèle (avec une grande taille de page pour les RDV)
    const [prescriptionsResponse, rdvResponse] = await Promise.all([
        apiFetch<{
            content: Array<{
                id: string;
                patientId: string;
                consultationId: string;
                createdAt: string;
                medicaments: Medicament[];
            }>;
        }>("/api/prescriptions", { authenticated: true }),
        apiFetch<{
            content: Array<{
                patientId: string;
                patient: {
                    id: string;
                    fullName: string;
                };
            }>;
        }>("/api/rdv?size=1000", { authenticated: true }), // Augmenter la taille pour récupérer plus de patients
    ]);

    console.log("📥 Prescriptions reçues:", prescriptionsResponse);
    console.log("📥 RDV reçus pour noms patients:", rdvResponse);

    // Créer un map des patients par ID
    const patientsMap = new Map<string, string>();
    rdvResponse.content.forEach((rdv) => {
        if (rdv.patient?.fullName && !patientsMap.has(rdv.patientId)) {
            patientsMap.set(rdv.patientId, rdv.patient.fullName);
        }
    });

    return prescriptionsResponse.content.map((prescription) => ({
        id: prescription.id,
        patientId: prescription.patientId,
        patientName: patientsMap.get(prescription.patientId) || `Patient ${prescription.patientId.substring(0, 8)}`,
        date: prescription.createdAt,
        medicaments: prescription.medicaments,
        consultationId: prescription.consultationId,
    }));
}

export async function createPrescription(data: CreatePrescriptionData): Promise<PrescriptionListItem> {
    // Ajouter le medecinId au payload
    const medecinId = await getCurrentMedecinId();
    const payload = {
        ...data,
        medecinId,
    };
    
    console.log("📤 Données envoyées pour création prescription:", payload);
    
    const response = await apiFetch<{
        id: string;
        patientId: string;
        consultationId: string;
        createdAt: string; // Utiliser createdAt au lieu de date
        medicaments: Medicament[];
        patient?: {
            fullName: string;
        };
    }>("/api/prescriptions", {
        method: "POST",
        authenticated: true,
        body: payload, // apiFetch fait déjà JSON.stringify
    });

    return {
        id: response.id,
        patientId: response.patientId,
        patientName: response.patient?.fullName || "Patient inconnu",
        date: response.createdAt, // Mapper createdAt vers date
        medicaments: response.medicaments,
        consultationId: response.consultationId,
    };
}

// Récupérer la liste des patients pour le select
export async function fetchPatientsForSelect(): Promise<Array<{ id: string; label: string; email?: string }>> {
    try {
        // Récupérer depuis les RDV qui contiennent les infos patient
        const rdvResponse = await apiFetch<{
            content: Array<{
                patientId: string;
                patient: {
                    id: string;
                    fullName: string;
                    email: string;
                };
            }>;
        }>("/api/rdv", { authenticated: true });

        const rdvList = rdvResponse.content || [];

        const patientsMap = new Map<string, { id: string; label: string; email?: string }>();

        rdvList.forEach((rdv) => {
            if (!patientsMap.has(rdv.patientId)) {
                const label = rdv.patient?.fullName || `Patient ${rdv.patientId.substring(0, 8)}`;

                patientsMap.set(rdv.patientId, {
                    id: rdv.patientId,
                    label,
                    email: rdv.patient?.email,
                });
            }
        });

        return Array.from(patientsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
        console.error("Erreur récupération patients:", error);
        return [];
    }
}

// Récupérer la liste des consultations pour le select
export async function fetchConsultationsForSelect(patientId?: string): Promise<Array<{ id: string; label: string; date: string }>> {
    try {
        const consultations = await apiFetch<Array<{
            id: string;
            patientId: string;
            date: string;
            resume?: string;
        }> | {
            content: Array<{
                id: string;
                patientId: string;
                date: string;
                resume?: string;
            }>
        }>("/api/consultations", { authenticated: true });

        const consultationsList = Array.isArray(consultations) ? consultations : consultations.content || [];

        return consultationsList
            .filter((c) => !patientId || c.patientId === patientId)
            .map((c) => ({
                id: c.id,
                label: `${new Date(c.date).toLocaleDateString('fr-FR')} - ${c.resume || 'Consultation'}`,
                date: c.date,
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Erreur récupération consultations:", error);
        return [];
    }
}
