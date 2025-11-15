"use client";

import { useState } from "react";
import { useSwrLite } from "@/lib/swr-lite";
import { fetchMesPrescriptions, createPrescription, PrescriptionListItem, CreatePrescriptionData } from "./api";

export function useMesPrescriptions() {
    const { data, error, isLoading, reload } = useSwrLite<PrescriptionListItem[]>(
        "mes-prescriptions",
        fetchMesPrescriptions,
        {
            revalidateOnFocus: false,
            refreshInterval: 120000, // 2 minutes
        }
    );

    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const createNewPrescription = async (prescriptionData: CreatePrescriptionData) => {
        setIsCreating(true);
        setCreateError(null);
        try {
            await createPrescription(prescriptionData);
            await reload();
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : "Erreur lors de la création de l'ordonnance");
            throw err;
        } finally {
            setIsCreating(false);
        }
    };

    return {
        prescriptions: data || [],
        isLoading,
        error,
        reload,
        createNewPrescription,
        isCreating,
        createError,
    };
}
