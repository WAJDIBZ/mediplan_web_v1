"use client";

import { ReactNode } from "react";
import { SidebarLink } from "@/components/layout/sidebar-link";

interface AdminSidebarProps {
  children: ReactNode;
}

export function AdminSidebarLayout({ children }: AdminSidebarProps) {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <aside className="hidden w-72 flex-shrink-0 flex-col gap-6 bg-white px-6 py-10 shadow-lg lg:flex">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#2563eb]">MEDIPLAN</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">Administration</h2>
          <p className="mt-2 text-sm text-[#64748b]">
            Pilotez votre organisation et accompagnez vos équipes médicales.
          </p>
        </div>
        <nav className="mt-6 flex flex-col gap-2">
          <SidebarLink href="/admin" label="Tableau de bord" icon="📊" />
          <SidebarLink href="/admin/utilisateurs" label="Utilisateurs" icon="👥" />
          <SidebarLink href="/admin/rendez-vous" label="Rendez-vous" icon="📅" />
          <SidebarLink href="/admin/statistiques" label="Statistiques" icon="📈" />
        </nav>
        <div className="mt-auto rounded-2xl bg-[#2563eb] p-5 text-white shadow-xl">
          <h3 className="text-lg font-semibold">Support premium</h3>
          <p className="mt-2 text-sm text-[#e2e8f0]">
            Besoin d’aide ? Notre équipe vous accompagne 7j/7 par chat ou téléphone.
          </p>
          <a
            href="mailto:support@mediplan.fr"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1d4ed8]"
          >
            Contacter le support
          </a>
        </div>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
