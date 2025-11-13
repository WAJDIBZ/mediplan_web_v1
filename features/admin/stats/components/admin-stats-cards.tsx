"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { AdminStatsResponse } from "../types";

interface AdminStatsCardsProps {
  stats: AdminStatsResponse;
}

const cardConfig = [
  {
    key: "totalRendezVous" as const,
    title: "Rendez-vous totaux",
    accent: "bg-[#2563eb]/10 text-[#1d4ed8]",
  },
  {
    key: "rendezVousConfirmes" as const,
    title: "Confirmés",
    accent: "bg-[#22c55e]/10 text-[#166534]",
  },
  {
    key: "rendezVousAnnules" as const,
    title: "Annulés",
    accent: "bg-[#f97316]/10 text-[#9a3412]",
  },
  {
    key: "patientsActifs" as const,
    title: "Patients actifs",
    accent: "bg-[#a855f7]/10 text-[#6b21a8]",
  },
  {
    key: "medecinsActifs" as const,
    title: "Médecins actifs",
    accent: "bg-[#0ea5e9]/10 text-[#0369a1]",
  },
];

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {cardConfig.map((card) => (
        <Card key={card.key} className="relative overflow-hidden">
          <div className={`absolute right-4 top-4 h-16 w-16 rounded-full ${card.accent} blur-xl`} aria-hidden />
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="mt-4 text-3xl">{formatNumber(stats[card.key])}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
