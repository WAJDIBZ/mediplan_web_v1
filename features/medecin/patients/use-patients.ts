"use client";

import { useSwrLite } from "@/lib/swr-lite";
import { fetchMesPatients, PatientListItem } from "./api";

export function useMesPatients() {
    const { data, error, isLoading, reload } = useSwrLite<PatientListItem[]>(
        "mes-patients",
        fetchMesPatients,
        {
            revalidateOnFocus: false,
            refreshInterval: 120000, // 2 minutes
        }
    );

    return {
        patients: data || [],
        isLoading,
        error,
        reload,
    };
}
