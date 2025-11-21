export interface CreateConsultationPayload {
    rendezVousId: string;
    patientId: string;
    date: string; // ISO 8601 date-time
    resume: string;
    diagnostic: string;
    planSuivi: string;
    recommandations: string[];
}

export interface Consultation {
    id: string;
    rendezVousId: string;
    patientId: string;
    medecinId: string;
    date: string;
    resume: string;
    diagnostic: string;
    planSuivi: string;
    recommandations: string;
}
