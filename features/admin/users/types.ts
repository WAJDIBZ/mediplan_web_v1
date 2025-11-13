import type { PaginatedResponse, UserRole } from "@/types/common";

export type AuthProvider = "LOCAL" | "GOOGLE" | "FACEBOOK" | "APPLE" | "MICROSOFT" | string;

export interface AddressDTO {
  line1?: string;
  line2?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface EmergencyContactDTO {
  name?: string;
  phone?: string;
  relation?: string;
}

export interface AdminUserListItem {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
  provider: AuthProvider;
  createdAt: string;
}

export interface AdminUserDetails extends AdminUserListItem {
  phone?: string;
  gender?: string;
  specialty?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  clinicName?: string;
  clinicAddress?: AddressDTO;
  address?: AddressDTO;
  insuranceNumber?: string;
  emergencyContact?: EmergencyContactDTO;
  notes?: string;
}

export type AdminUsersResponse = PaginatedResponse<AdminUserListItem>;

export interface AdminUserFilters {
  q?: string;
  role?: UserRole | "";
  active?: "true" | "false" | "";
  provider?: AuthProvider | "";
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminCreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  active?: boolean;
  phone?: string;
  specialty?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  clinicName?: string;
  clinicAddress?: AddressDTO;
  address?: AddressDTO;
  insuranceNumber?: string;
  emergencyContact?: EmergencyContactDTO;
}

export interface AdminChangeRolePayload {
  role: UserRole;
  specialty?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  clinicName?: string;
  clinicAddress?: AddressDTO;
}

export type AdminUpdateUserPayload = Partial<AdminCreateUserPayload>;
