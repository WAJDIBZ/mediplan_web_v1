import { useSwrLite } from "@/lib/swr-lite";
import { fetchRendezVousByMonth, type CalendarEvent } from "./api";

export function useCalendrierRendezVous(year: number, month: number) {
    const key = `calendrier-${year}-${month}`;

    const { data, error, isLoading, reload } = useSwrLite<CalendarEvent[]>(
        key,
        () => fetchRendezVousByMonth(year, month),
        {
            revalidateOnFocus: false,
            refreshInterval: 60000, // Rafraîchir toutes les minutes
        }
    );

    return {
        events: data ?? [],
        isLoading,
        error,
        reload,
    };
}
