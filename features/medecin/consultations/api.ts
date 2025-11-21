import { apiFetch } from "@/lib/api-client";
import type { Consultation, CreateConsultationPayload } from "./types";

/**
 * Create a new consultation after marking a patient as present
 */
export async function createConsultation(
    payload: CreateConsultationPayload
): Promise<Consultation> {
    return apiFetch<Consultation>("/api/consultations", {
        method: "POST",
        authenticated: true,
        body: payload,
    });
}
