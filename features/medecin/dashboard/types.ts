export interface MedecinStats {
    totalPatients: number;
    rendezVousAujourdhui: number;
    rendezVousSemaine: number;
    tauxPresence: number;
    tempsMoyenConsultation: number;
    prochainsRendezVous: number;
}

export interface RendezVousListItem {
    id: string;
    patientId: string;
    patientName: string;
    medecinId: string;
    date: string; // ISO datetime
    heureDebut: string;
    heureFin: string;
    statut: "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT";
    motif?: string;
    notes?: string;
    createdAt: string;
}

export interface DashboardData {
    stats: MedecinStats;
    rendezVousAujourdhui: RendezVousListItem[];
    prochains: RendezVousListItem[];
}
