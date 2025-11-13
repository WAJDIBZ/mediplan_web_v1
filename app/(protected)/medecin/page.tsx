"use client";

import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { statCards, todayAppointments, quickActions } from "@/features/medecin/dashboard/mock-data";

export default function MedecinDashboardPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title} className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe]">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="mt-3 text-3xl text-[#1e293b]">{card.value}</CardTitle>
              <p className={`text-xs font-semibold ${card.positive === false ? "text-[#b91c1c]" : "text-[#166534]"}`}>
                {card.variation}
              </p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
            <CardDescription>Préparez vos consultations et anticipez les points clés.</CardDescription>
          </CardHeader>
          <div className="divide-y divide-[#e2e8f0]">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{appointment.patient}</p>
                  <p className="text-xs text-[#64748b]">{appointment.motif}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-xl bg-[#eff6ff] px-3 py-1 text-sm font-semibold text-[#1d4ed8]">
                    {appointment.horaire}
                  </span>
                  <Badge
                    variant={appointment.statut === "ANNULE" ? "danger" : appointment.statut === "PLANIFIE" ? "warning" : "success"}
                  >
                    {appointment.statut === "PLANIFIE" && "Planifié"}
                    {appointment.statut === "CONFIRME" && "Confirmé"}
                    {appointment.statut === "ANNULE" && "Annulé"}
                    {appointment.statut === "HONORE" && "Honoré"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accédez en un clic aux fonctions essentielles.</CardDescription>
          </CardHeader>
          <div className="space-y-4 px-6 pb-6">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block rounded-2xl border border-[#cbd5f5] bg-[#f8fafc] px-4 py-4 transition hover:border-[#2563eb] hover:bg-white"
              >
                <p className="text-sm font-semibold text-[#1f2937]">{action.label}</p>
                <p className="mt-1 text-xs text-[#64748b]">{action.description}</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-[#0f172a]">Préconisations du jour</h2>
        <p className="mt-2 text-sm text-[#475569]">
          Activez les rappels SMS pour réduire les absences de dernière minute et proposez la téléconsultation pour les patients éloignés.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#eff6ff] p-4 text-sm text-[#1d4ed8]">
            <p className="font-semibold">3 rappels en attente</p>
            <p className="mt-1 text-[#1d4ed8]/80">Planifiez leur envoi avant 12h pour maximiser la confirmation.</p>
          </div>
          <div className="rounded-2xl bg-[#dcfce7] p-4 text-sm text-[#166534]">
            <p className="font-semibold">Temps moyen</p>
            <p className="mt-1 text-[#166534]/80">23 minutes – continuez à synchroniser les comptes rendus dès la fin de séance.</p>
          </div>
          <div className="rounded-2xl bg-[#fee2e2] p-4 text-sm text-[#b91c1c]">
            <p className="font-semibold">1 annulation critique</p>
            <p className="mt-1 text-[#b91c1c]/80">Reprogrammez avec la liste d’attente pour éviter un créneau perdu.</p>
          </div>
        </div>
      </section>

      {todayAppointments.length === 0 && (
        <EmptyState className="py-16">
          <p className="text-sm font-semibold text-[#1f2937]">Aucun rendez-vous prévu aujourd’hui.</p>
          <p className="mt-2 text-xs text-[#64748b]">Ajoutez des disponibilités pour recevoir de nouvelles réservations.</p>
        </EmptyState>
      )}
    </div>
  );
}
