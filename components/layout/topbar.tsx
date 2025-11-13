"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title: string;
  subtitle?: string;
  userLabel: string;
  onLogout: () => void;
  actions?: ReactNode;
}

export function Topbar({ title, subtitle, userLabel, onLogout, actions }: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-[#1e3a8a0d] lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-[#2563eb]">MediPlan</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-[#64748b]">{subtitle}</p>}
      </div>
      <div className="flex flex-col-reverse items-stretch gap-3 lg:flex-row lg:items-center">
        {actions}
        <div className="flex items-center gap-4 rounded-2xl bg-[#f8fafc] px-4 py-2">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Connecté</p>
            <p className="text-sm font-semibold text-[#1f2937]">{userLabel}</p>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            Se déconnecter
          </Button>
        </div>
      </div>
    </header>
  );
}
