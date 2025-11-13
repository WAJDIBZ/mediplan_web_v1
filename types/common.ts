export type UserRole = "ADMIN" | "MEDECIN" | "PATIENT";

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
