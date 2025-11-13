export type AdminAppointmentStatus = "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE";

export interface AdminAppointmentParticipant {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  specialty?: string;
  avatarUrl?: string;
}

export interface AdminAppointmentListItem {
  id: string;
  debut: string;
  fin: string;
  motif: string;
  statut: AdminAppointmentStatus;
  commentaire?: string;
  medecin: AdminAppointmentParticipant;
  patient: AdminAppointmentParticipant;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminAppointmentsFilters {
  q?: string;
  statut?: AdminAppointmentStatus;
  medecinId?: string;
  patientId?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminAppointmentsResponse {
  content: AdminAppointmentListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
}
