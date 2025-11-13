"use client";

import { ReactNode } from "react";
import { SidebarLink } from "@/components/layout/sidebar-link";

interface DoctorSidebarProps {
  children: ReactNode;
}

export function DoctorSidebarLayout({ children }: DoctorSidebarProps) {
  return (
    <div className="flex min-h-screen bg-[#eef2ff]">
      <aside className="hidden w-72 flex-shrink-0 flex-col gap-6 bg-white px-6 py-10 shadow-lg lg:flex">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6366f1]">MEDIPLAN</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#312e81]">Espace Médecin</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Optimisez vos consultations et offrez un suivi personnalisé à vos patients.
          </p>
        </div>
        <nav className="mt-6 flex flex-col gap-2">
          <SidebarLink href="/medecin" label="Tableau de bord" icon="🩺" />
          <SidebarLink href="/medecin/calendrier" label="Calendrier" icon="🗓️" />
          <SidebarLink href="/medecin/patients" label="Patients" icon="👤" />
          <SidebarLink href="/medecin/ordonnances" label="Ordonnances" icon="💊" />
        </nav>
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#2563eb] p-5 text-white shadow-xl">
          <h3 className="text-lg font-semibold">Astuces de productivité</h3>
          <p className="mt-2 text-sm text-[#e0e7ff]">
            Planifiez vos rappels automatiques et proposez la téléconsultation en un clic.
          </p>
        </div>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
