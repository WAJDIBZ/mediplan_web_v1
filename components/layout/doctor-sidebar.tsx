"use client";

import { ReactNode } from "react";
import {
  AnalyticsIcon,
  CalendarIcon,
  ClockIcon,
  PillIcon,
  StethoscopeIcon,
  UsersIcon,
} from "@/components/icons/mediplan-icons";
import { SidebarLink } from "@/components/layout/sidebar-link";
import { MobileNav } from "@/components/layout/mobile-nav";

interface DoctorSidebarProps {
  children: ReactNode;
}

export function DoctorSidebarLayout({ children }: DoctorSidebarProps) {
  const navItems = [
    { href: "/medecin", label: "Tableau de bord", icon: <StethoscopeIcon className="h-5 w-5" /> },
    { href: "/medecin/calendrier", label: "Calendrier", icon: <CalendarIcon className="h-5 w-5" /> },
    { href: "/medecin/horaires", label: "Mes horaires", icon: <ClockIcon className="h-5 w-5" /> },
    { href: "/medecin/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5" /> },
    { href: "/medecin/ordonnances", label: "Ordonnances", icon: <PillIcon className="h-5 w-5" /> },
    { href: "/medecin/statistiques", label: "Statistiques", icon: <AnalyticsIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="relative flex min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_40%,_#f1f5f9_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-[-120px] h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />
        <div className="absolute bottom-10 left-32 h-64 w-64 rounded-full bg-emerald-200/40 blur-[110px]" aria-hidden />
        <div className="absolute right-[-120px] top-24 h-96 w-96 rounded-full bg-blue-200/50 blur-[120px]" aria-hidden />
      </div>
      <aside className="relative z-10 hidden w-[300px] flex-shrink-0 flex-col gap-8 border-r border-white/20 bg-white/75 px-7 py-10 shadow-xl shadow-sky-900/10 backdrop-blur-2xl lg:flex">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-lg shadow-sky-900/20">
              <StethoscopeIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-sky-500">MediPlan</p>
              <h2 className="text-xl font-semibold text-slate-900">Espace Médecin</h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Optimisez vos consultations, anticipez vos journées et proposez un suivi d’exception à chaque patient.
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <SidebarLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
        <div className="mt-auto overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-sky-500 via-indigo-500 to-blue-500 p-6 text-white shadow-xl shadow-indigo-900/20">
          <h3 className="text-lg font-semibold">Astuce du jour</h3>
          <p className="mt-2 text-sm text-sky-100">
            Activez les rappels automatiques pour les suivis post-consultation et réduisez les oublis de rendez-vous.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-white/70" aria-hidden />
            Médecine proactive
          </div>
        </div>
      </aside>
      <main className="relative z-10 flex-1 px-4 py-6 sm:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-14">
          <MobileNav
            brandLabel="MediPlan"
            description="Accédez rapidement à vos espaces rendez-vous, patients et ordonnances."
            items={navItems}
          />
          {children}
        </div>
      </main>
    </div>
  );
}
