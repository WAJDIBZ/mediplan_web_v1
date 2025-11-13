"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/lib/format";
import type { AdminStatsResponse } from "../types";

interface AdminTrendsChartProps {
  stats: AdminStatsResponse;
}

export function AdminTrendsChart({ stats }: AdminTrendsChartProps) {
  const total = Math.max(stats.totalRendezVous, 1);
  const dataset = [
    {
      label: "Planifiés",
      value: stats.rendezVousPlanifies,
      color: "bg-[#bfdbfe]",
    },
    {
      label: "Confirmés",
      value: stats.rendezVousConfirmes,
      color: "bg-[#60a5fa]",
    },
    {
      label: "Honorés",
      value: stats.rendezVousHonores,
      color: "bg-[#22c55e]",
    },
    {
      label: "Annulés",
      value: stats.rendezVousAnnules,
      color: "bg-[#f97316]",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Répartition des rendez-vous</CardTitle>
        <CardDescription>
          Période analysée du {new Date(stats.periodeDebut).toLocaleDateString("fr-FR")} au
          {" "}
          {new Date(stats.periodeFin).toLocaleDateString("fr-FR")}.
        </CardDescription>
      </CardHeader>
      <div className="space-y-6 px-6 pb-8">
        <div className="space-y-4">
          {dataset.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm font-medium text-[#1f2937]">
                <span>{item.label}</span>
                <span>
                  {formatNumber(item.value)} ({formatPercentage((item.value / total) * 100)})
                </span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-[#e2e8f0]">
                <div
                  className={`h-3 rounded-full transition-all ${item.color}`}
                  style={{ width: `${(item.value / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-sm text-[#475569]">
          <p className="font-semibold text-[#1f2937]">Tendance générale</p>
          <p className="mt-2">
            {stats.rendezVousConfirmes >= stats.rendezVousAnnules
              ? "Les confirmations dépassent largement les annulations : la dynamique est favorable."
              : "Les annulations se rapprochent des confirmations : une attention particulière est recommandée."}
          </p>
        </div>
      </div>
    </Card>
  );
}
