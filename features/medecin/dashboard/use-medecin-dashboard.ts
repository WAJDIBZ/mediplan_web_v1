import { useSwrLite } from "@/lib/swr-lite";
import { fetchDashboardData } from "./api";
import type { DashboardData } from "./types";

export function useMedecinDashboard() {
    const { data, error, isLoading, reload } = useSwrLite<DashboardData>(
        "medecin-dashboard",
        fetchDashboardData,
        {
            revalidateOnFocus: true,
            refreshInterval: 60000, // Rafraîchir toutes les minutes
        }
    );

    return {
        stats: data?.stats,
        rendezVousAujourdhui: data?.rendezVousAujourdhui ?? [],
        prochains: data?.prochains ?? [],
        isLoading,
        error,
        reload,
    };
}
