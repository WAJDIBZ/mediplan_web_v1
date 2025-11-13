"use client";

import type { ReactNode } from "react";
import { AdminSidebarLayout } from "@/components/layout/admin-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { useAuth } from "@/features/auth/auth-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute role="ADMIN">
      <AdminSidebarLayout>
        <div className="space-y-8 pb-12">
          <Topbar
            title="Espace Administration"
            subtitle="Pilotez vos équipes, supervisez les rendez-vous et analysez la performance en continu."
            userLabel={user?.email ?? "Administrateur"}
            onLogout={logout}
          />
          {children}
        </div>
      </AdminSidebarLayout>
    </ProtectedRoute>
  );
}
