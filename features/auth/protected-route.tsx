"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import type { UserRole } from "@/types/common";

interface ProtectedRouteProps {
  role?: UserRole;
  children: ReactNode;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3 text-center text-[#2563eb]">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#93c5fd] border-t-[#2563eb]" />
        <p className="text-sm font-medium">Vérification de votre session...</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, isReady, isAuthenticating } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (role && user.role !== role) {
      router.replace("/auth/login");
    }
  }, [isReady, role, router, user]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted || !isReady || isAuthenticating) {
    return <LoadingScreen />;
  }

  if (!user || (role && user.role !== role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="rounded-2xl bg-white px-6 py-8 text-center shadow">
          <p className="text-sm text-[#64748b]">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
