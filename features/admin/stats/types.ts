export interface AdminStatsResponse {
  periodeDebut: string;
  periodeFin: string;
  totalRendezVous: number;
  rendezVousPlanifies: number;
  rendezVousConfirmes: number;
  rendezVousAnnules: number;
  rendezVousHonores: number;
  patientsActifs: number;
  medecinsActifs: number;
}

export interface AdminStatsFilters {
  from?: string;
  to?: string;
}
