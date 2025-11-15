"use client";

import { ReactNode, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title: string;
  subtitle?: string;
  userLabel: string;
  onLogout: () => void;
  actions?: ReactNode;
}

export function Topbar({ title, subtitle, userLabel, onLogout, actions }: TopbarProps) {
  const formattedDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return formatter.format(new Date());
  }, []);

  const initials = useMemo(() => {
    if (!userLabel) {
      return "?";
    }
    const [name] = userLabel.split("@");
    return name?.charAt(0).toUpperCase() || userLabel.charAt(0).toUpperCase();
  }, [userLabel]);

  return (
    <header className="animate-in-up relative isolate overflow-hidden rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl shadow-sky-900/10 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-[-80px] h-48 w-48 rounded-full bg-sky-400/10 blur-[80px]" aria-hidden />
        <div className="absolute bottom-[-60px] left-1/3 h-40 w-40 rounded-full bg-indigo-400/10 blur-[90px]" aria-hidden />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-sky-600 shadow-inner shadow-sky-900/5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden />
            MediPlan
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-600">{subtitle}</p>}
          </div>
          <p className="text-sm font-medium text-slate-500">
            {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {actions && (
            <div className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium text-slate-600">{actions}</div>
          )}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-3 shadow-inner shadow-slate-900/5 backdrop-blur">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 text-lg font-semibold text-sky-700">
              {initials}
            </div>
            <div className="min-w-[160px] text-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Connecté</p>
              <p className="truncate font-semibold text-slate-700">{userLabel}</p>
            </div>
            <Button variant="ghost" onClick={onLogout} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
