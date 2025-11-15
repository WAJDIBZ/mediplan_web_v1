"use client";

import { ReactNode } from "react";
import {
  AnalyticsIcon,
  BuildingIcon,
  CalendarIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/icons/mediplan-icons";
import { SidebarLink } from "@/components/layout/sidebar-link";
import { MobileNav } from "@/components/layout/mobile-nav";

interface AdminSidebarProps {
  children: ReactNode;
}

export function AdminSidebarLayout({ children }: AdminSidebarProps) {
  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: <AnalyticsIcon className="h-5 w-5" /> },
    { href: "/admin/utilisateurs", label: "Utilisateurs", icon: <UsersIcon className="h-5 w-5" /> },
    { href: "/admin/rendez-vous", label: "Rendez-vous", icon: <CalendarIcon className="h-5 w-5" /> },
    { href: "/admin/specialisations", label: "Spécialisations", icon: <BuildingIcon className="h-5 w-5" /> },
    { href: "/admin/statistiques", label: "Statistiques", icon: <AnalyticsIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="relative flex min-h-screen bg-[radial-gradient(circle_at_top,_#e2f5ff_0%,_#f8fafc_45%,_#eef2ff_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-[-140px] h-96 w-96 rounded-full bg-indigo-200/50 blur-[120px]" aria-hidden />
        <div className="absolute bottom-16 right-20 h-72 w-72 rounded-full bg-sky-200/40 blur-[100px]" aria-hidden />
        <div className="absolute left-[-120px] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-200/30 blur-[110px]" aria-hidden />
      </div>
      <aside className="relative z-10 hidden w-[300px] flex-shrink-0 flex-col gap-8 border-r border-white/20 bg-white/75 px-7 py-10 shadow-xl shadow-slate-900/10 backdrop-blur-2xl lg:flex">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-900/20">
              <ShieldIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-indigo-500">MediPlan</p>
              <h2 className="text-xl font-semibold text-slate-900">Administration</h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Pilotez vos équipes, sécurisez les opérations et offrez une vision temps réel de l’activité médicale.
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <SidebarLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
        <div className="mt-auto overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-6 shadow-lg shadow-indigo-900/10">
          <h3 className="text-lg font-semibold text-slate-900">Support premium</h3>
          <p className="mt-2 text-sm text-slate-600">
            Besoin d’assistance stratégique ? Notre équipe vous répond 7j/7 par chat sécurisé ou téléphone.
          </p>
          <a
            href="mailto:support@mediplan.fr"
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/10 transition hover:shadow-xl"
          >
            Contacter le support
          </a>
        </div>
      </aside>
      <main className="relative z-10 flex-1 px-4 py-6 sm:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-14">
          <MobileNav
            brandLabel="MediPlan"
            description="Pilotez l’administration, les équipes et la conformité en mobilité."
            items={navItems}
          />
          {children}
        </div>
      </main>
    </div>
  );
}
