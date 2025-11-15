"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useMedecinDashboard } from "@/features/medecin/dashboard/use-medecin-dashboard";
import { formatDate } from "@/lib/date";

export default function MedecinStatistiquesPage() {
  const { stats, rendezVousAujourdhui, isLoading, error } = useMedecinDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto"></div>
          <p className="mt-4 text-[#64748b]">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState className="py-16">
        <p className="text-sm font-semibold text-[#b91c1c]">❌ Erreur de chargement</p>
        <p className="mt-2 text-xs text-[#64748b]">
          Impossible de récupérer les statistiques. Veuillez réessayer.
        </p>
      </EmptyState>
    );
  }

  // Calculer les statistiques avancées
  const rdvParStatut = rendezVousAujourdhui.reduce((acc, rdv) => {
    acc[rdv.statut] = (acc[rdv.statut] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRdvMois = stats?.rendezVousSemaine ? stats.rendezVousSemaine * 4 : 0;
  const moyenneRdvParJour = stats?.rendezVousSemaine ? (stats.rendezVousSemaine / 7).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#0f172a]">Statistiques et rapports</h1>
        <p className="text-sm text-[#64748b]">
          Vue d&apos;ensemble de votre activité et indicateurs de performance
        </p>
      </div>

      {/* Statistiques principales */}
      <section className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe]">
          <CardHeader>
            <CardDescription>Patients suivis</CardDescription>
            <CardTitle className="mt-3 text-3xl text-[#1e293b]">{stats?.totalPatients ?? 0}</CardTitle>
            <p className="text-xs font-semibold text-[#166534]">Total dans votre patientèle</p>
          </CardHeader>
        </Card>

        <Card className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#fef3c7]">
          <CardHeader>
            <CardDescription>RDV aujourd&apos;hui</CardDescription>
            <CardTitle className="mt-3 text-3xl text-[#1e293b]">{stats?.rendezVousAujourdhui ?? 0}</CardTitle>
            <p className="text-xs font-semibold text-[#92400e]">{stats?.rendezVousSemaine ?? 0} cette semaine</p>
          </CardHeader>
        </Card>

        <Card className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#dcfce7]">
          <CardHeader>
            <CardDescription>Taux de présence</CardDescription>
            <CardTitle className="mt-3 text-3xl text-[#1e293b]">{stats?.tauxPresence ?? 0}%</CardTitle>
            <p className="text-xs font-semibold text-[#166534]">
              Basé sur les derniers rendez-vous
            </p>
          </CardHeader>
        </Card>

        <Card className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0e7ff]">
          <CardHeader>
            <CardDescription>Temps moyen</CardDescription>
            <CardTitle className="mt-3 text-3xl text-[#1e293b]">{stats?.tempsMoyenConsultation ?? 0} min</CardTitle>
            <p className="text-xs font-semibold text-[#3730a3]">Par consultation</p>
          </CardHeader>
        </Card>
      </section>

      {/* Statistiques de la semaine */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Activité hebdomadaire</CardTitle>
            <CardDescription>Résumé de vos consultations cette semaine</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#e2e8f0]">
              <span className="text-sm font-medium text-[#475569]">Rendez-vous planifiés</span>
              <span className="text-lg font-semibold text-[#0f172a]">{stats?.rendezVousSemaine ?? 0}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#e2e8f0]">
              <span className="text-sm font-medium text-[#475569]">Moyenne par jour</span>
              <span className="text-lg font-semibold text-[#0f172a]">{moyenneRdvParJour}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#e2e8f0]">
              <span className="text-sm font-medium text-[#475569]">Estimation mensuelle</span>
              <span className="text-lg font-semibold text-[#0f172a]">~{totalRdvMois}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-[#475569]">Taux de remplissage</span>
              <span className="text-lg font-semibold text-[#166534]">{stats?.tauxPresence ?? 0}%</span>
            </div>
          </div>
        </Card>

        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Répartition des rendez-vous</CardTitle>
            <CardDescription>Statuts des consultations récentes</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                <span className="text-sm text-[#475569]">Honorés</span>
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">{rdvParStatut.HONORE || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                <span className="text-sm text-[#475569]">Confirmés</span>
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">{rdvParStatut.CONFIRME || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                <span className="text-sm text-[#475569]">Planifiés</span>
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">{rdvParStatut.PLANIFIE || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                <span className="text-sm text-[#475569]">Annulés</span>
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">{rdvParStatut.ANNULE || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#94a3b8]"></div>
                <span className="text-sm text-[#475569]">Absents</span>
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">{rdvParStatut.ABSENT || 0}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Rendez-vous récents */}
      <Card className="border-[#dbeafe]">
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
          <CardDescription>Vos derniers rendez-vous</CardDescription>
        </CardHeader>
        <div className="divide-y divide-[#e2e8f0]">
          {rendezVousAujourdhui.length > 0 ? (
            rendezVousAujourdhui.map((rdv) => {
              const heureDebut = new Date(rdv.heureDebut).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const date = formatDate(new Date(rdv.heureDebut), { 
                day: "2-digit", 
                month: "short", 
                year: "numeric" 
              });

              return (
                <div key={rdv.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0f172a]">{rdv.patientName}</p>
                    <p className="text-xs text-[#64748b]">{rdv.motif || "Consultation générale"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#0f172a]">{date}</p>
                      <p className="text-xs text-[#64748b]">{heureDebut}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      rdv.statut === "HONORE" 
                        ? "bg-green-100 text-green-800" 
                        : rdv.statut === "CONFIRME"
                        ? "bg-blue-100 text-blue-800"
                        : rdv.statut === "PLANIFIE"
                        ? "bg-yellow-100 text-yellow-800"
                        : rdv.statut === "ANNULE"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {rdv.statut}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-[#64748b]">Aucun rendez-vous récent</p>
            </div>
          )}
        </div>
      </Card>

      {/* Recommandations */}
      <Card className="border-[#e0f2fe] bg-gradient-to-br from-[#eff6ff] to-white">
        <CardHeader>
          <CardTitle>📊 Recommandations</CardTitle>
          <CardDescription>Améliorez votre pratique avec ces conseils</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 space-y-3">
          {stats && stats.tauxPresence < 80 && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-sm font-semibold text-amber-900">
                💡 Taux de présence faible ({stats.tauxPresence}%)
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Activez les rappels SMS 24h avant le rendez-vous pour réduire les absences.
              </p>
            </div>
          )}
          
          {stats && stats.tempsMoyenConsultation > 30 && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">
                ⏱️ Consultations longues ({stats.tempsMoyenConsultation} min)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Optimisez votre temps en préparant les dossiers patients avant la consultation.
              </p>
            </div>
          )}
          
          {stats && stats.rendezVousSemaine < 10 && (
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-sm font-semibold text-purple-900">
                📅 Peu de rendez-vous cette semaine ({stats.rendezVousSemaine})
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Augmentez votre visibilité en ajoutant plus de créneaux disponibles.
              </p>
            </div>
          )}
          
          {stats && stats.tauxPresence >= 80 && stats.tempsMoyenConsultation <= 30 && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-semibold text-green-900">
                ✨ Excellente performance !
              </p>
              <p className="text-xs text-green-700 mt-1">
                Votre pratique est bien optimisée. Continuez ce rythme !
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
