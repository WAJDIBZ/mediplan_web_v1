"use client";

import type { ReactNode } from "react";
import { DoctorSidebarLayout } from "@/components/layout/doctor-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { useAuth } from "@/features/auth/auth-context";

export default function MedecinLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute role="MEDECIN">
      <DoctorSidebarLayout>
        <div className="space-y-8 pb-12">
          <Topbar
            title="Espace Médecin"
            subtitle="Suivez vos rendez-vous, vos patients et vos prescriptions en toute sérénité."
            userLabel={user?.email ?? "Médecin"}
            onLogout={logout}
          />
          {children}
        </div>
      </DoctorSidebarLayout>
    </ProtectedRoute>
  );
}
