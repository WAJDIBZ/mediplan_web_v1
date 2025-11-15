import { apiFetch } from "@/lib/api-client";
import type { DashboardData, MedecinStats, RendezVousListItem } from "./types";

export async function fetchMedecinStats(): Promise<MedecinStats> {
    // Utiliser le bon endpoint : /api/medecins/me/stats (avec 's' à medecins)
    const statsResponse = await apiFetch<{
        periodeDebut: string;
        periodeFin: string;
        totalRendezVous: number;
        rendezVousPlanifies: number;
        rendezVousConfirmes: number;
        rendezVousAnnules: number;
        rendezVousHonores: number;
        patientsActifs: number;
    }>("/api/medecins/me/stats", { authenticated: true });

    // Convertir au format attendu par le dashboard
    return {
        totalPatients: statsResponse.patientsActifs,
        rendezVousAujourdhui: 0, // Sera calculé depuis les RDV du jour
        rendezVousSemaine: statsResponse.totalRendezVous,
        tauxPresence: Math.round(
            (statsResponse.rendezVousHonores / statsResponse.totalRendezVous) * 100
        ),
        tempsMoyenConsultation: 25, // Valeur par défaut
        prochainsRendezVous: statsResponse.rendezVousPlanifies + statsResponse.rendezVousConfirmes,
    };
}

export async function fetchRendezVousAujourdhui(): Promise<RendezVousListItem[]> {
    // Récupérer les rendez-vous de la semaine en cours pour avoir plus de visibilité
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Début de semaine (dimanche)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Fin de semaine
    endOfWeek.setHours(23, 59, 59, 999);

    console.log("🔍 Fetching RDV from:", startOfWeek.toISOString(), "to:", endOfWeek.toISOString());

    // Utiliser le bon endpoint : /api/rdv avec filtres from et to
    const response = await apiFetch<{
        content: Array<{
            id: string;
            medecinId: string;
            patientId: string;
            debut: string;
            fin: string;
            statut: string;
            motif?: string;
            patient?: {
                fullName: string;
            };
        }>;
    }>(`/api/rdv?from=${startOfWeek.toISOString()}&to=${endOfWeek.toISOString()}`, { authenticated: true });

    console.log("✅ RDV reçus:", response.content.length);

    // Convertir au format attendu
    const rdvList = response.content.map((rdv) => ({
        id: rdv.id,
        patientId: rdv.patientId,
        patientName: rdv.patient?.fullName || "Patient inconnu",
        medecinId: rdv.medecinId,
        date: rdv.debut,
        heureDebut: rdv.debut,
        heureFin: rdv.fin,
        statut: rdv.statut as "PLANIFIE" | "CONFIRME" | "ANNULE" | "HONORE" | "ABSENT",
        motif: rdv.motif,
        notes: "",
        createdAt: rdv.debut,
    }));

    // Filtrer pour ne garder que les rendez-vous d'aujourd'hui et de demain
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(todayStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 2);

    const filteredRdv = rdvList.filter(rdv => {
        const rdvDate = new Date(rdv.heureDebut);
        return rdvDate >= todayStart && rdvDate < tomorrowEnd;
    });

    console.log("📅 RDV aujourd'hui et demain:", filteredRdv.length);

    return filteredRdv;
}

export async function fetchDashboardData(): Promise<DashboardData> {
    const [stats, rendezVousAujourdhui] = await Promise.all([
        fetchMedecinStats(),
        fetchRendezVousAujourdhui(),
    ]);

    // Mettre à jour le nombre de RDV aujourd'hui dans les stats
    stats.rendezVousAujourdhui = rendezVousAujourdhui.length;

    return {
        stats,
        rendezVousAujourdhui,
        prochains: rendezVousAujourdhui.filter(
            (rdv) => new Date(rdv.heureDebut) > new Date()
        ),
    };
}
