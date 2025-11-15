"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/feedback/toast-provider";
import { AdminUsersFilters } from "@/features/admin/users/components/admin-users-filters";
import { AdminUsersTable } from "@/features/admin/users/components/admin-users-table";
import { AdminUserDetailsModal } from "@/features/admin/users/components/admin-user-details-modal";
import { AdminUserFormModal } from "@/features/admin/users/components/admin-user-form-modal";
import { AdminChangeRoleModal } from "@/features/admin/users/components/admin-change-role-modal";
import { useAdminUsers } from "@/features/admin/users/use-admin-users";
import {
  changeUserRole,
  createUser,
  deactivateUser,
  exportUsers,
  getUserDetails,
  reactivateUser,
} from "@/features/admin/users/api";
import type { AdminChangeRolePayload, AdminCreateUserPayload, AdminUserDetails, AdminUserFilters, AdminUserListItem } from "@/features/admin/users/types";
import { ApiError } from "@/lib/errors";
import { downloadBlob } from "@/lib/download";

const DEFAULT_FILTERS: AdminUserFilters = {
  page: 0,
  size: 10,
  sort: "createdAt,desc",
};

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<AdminUserFilters>(() => ({ ...DEFAULT_FILTERS }));
  const [draftFilters, setDraftFilters] = useState<AdminUserFilters>(() => ({ ...DEFAULT_FILTERS }));
  const [detailsUser, setDetailsUser] = useState<AdminUserDetails | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isRoleOpen, setRoleOpen] = useState(false);
  const [isExporting, setExporting] = useState(false);
  const { data, error, isLoading, reload } = useAdminUsers(filters);
  const { notify } = useToast();

  const summary = useMemo(() => {
    if (!data) {
      return null;
    }
    const pageActive = data.content.filter((user) => user.active).length;
    const pageInactive = data.content.length - pageActive;
    return {
      total: data.totalElements,
      activeShare:
        data.content.length > 0 ? Math.round((pageActive / data.content.length) * 100) : undefined,
      pageActive,
      pageInactive,
    };
  }, [data]);

  const applyFilters = (next: AdminUserFilters) => {
    const normalized = { ...DEFAULT_FILTERS, ...next };
    setFilters({ ...normalized });
    setDraftFilters({ ...normalized });
  };

  const resetFilters = () => {
    applyFilters({ ...DEFAULT_FILTERS });
  };

  const updatePage = (page: number) => {
    setFilters((current) => ({ ...current, page }));
    setDraftFilters((current) => ({ ...current, page }));
  };

  const handleView = async (user: AdminUserListItem) => {
    try {
      const details = await getUserDetails(user.id);
      setDetailsUser(details);
      setDetailsOpen(true);
    } catch (err) {
      notify({
        variant: "error",
        title: "Échec du chargement",
        description: err instanceof ApiError ? err.message : "Impossible d’afficher le profil.",
      });
    }
  };

  const handleToggleStatus = async (user: AdminUserListItem) => {
    try {
      if (user.active) {
        await deactivateUser(user.id);
        notify({ variant: "info", title: "Utilisateur désactivé", description: `${user.fullName} ne peut plus se connecter.` });
      } else {
        await reactivateUser(user.id);
        notify({ variant: "success", title: "Utilisateur réactivé", description: `${user.fullName} a de nouveau accès.` });
      }
      await reload();
    } catch (err) {
      notify({
        variant: "error",
        title: "Action impossible",
        description: err instanceof ApiError ? err.message : "Veuillez réessayer ultérieurement.",
      });
    }
  };

  const handleCreate = async (payload: AdminCreateUserPayload) => {
    try {
      await createUser(payload);
      notify({ variant: "success", title: "Utilisateur créé", description: "Les identifiants ont été générés." });
      await reload();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de créer l’utilisateur.";
      notify({ variant: "error", title: "Création échouée", description: message });
      throw new Error(message);
    }
  };

  const handleChangeRole = async (payload: AdminChangeRolePayload) => {
    if (!selectedUser) return;
    try {
      await changeUserRole(selectedUser.id, payload);
      notify({ variant: "success", title: "Rôle mis à jour", description: `${selectedUser.fullName} a un nouveau rôle.` });
      await reload();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de modifier le rôle.";
      notify({ variant: "error", title: "Modification impossible", description: message });
      throw new Error(message);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportUsers(filters);
      downloadBlob(blob, `utilisateurs-mediplan-${Date.now()}.csv`);
      notify({ variant: "success", title: "Export lancé", description: "Le fichier CSV a été téléchargé." });
    } catch (err) {
      notify({
        variant: "error",
        title: "Export impossible",
        description: err instanceof ApiError ? err.message : "Veuillez réessayer plus tard.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-[#c7d2fe]/60 bg-gradient-to-br from-[#eef2ff] via-white to-[#f0f9ff] p-8 shadow-inner">
        <div className="absolute inset-0 opacity-60" aria-hidden>
          <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-6 h-32 w-32 rounded-full bg-indigo-300/30 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[#4338ca]">
              👥 Administration des comptes
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-[#1e1b4b]">Utilisateurs & rôles</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#312e81]/80">
                Centralisez la gestion des accès, contrôlez les rôles et pilotez l’activation de vos équipes en temps réel.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {summary ? (
              <>
                <div className="rounded-2xl border border-[#e0e7ff] bg-white/80 px-5 py-4 text-sm text-[#312e81] shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6366f1]">Total référencé</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1e1b4b]">{summary.total}</p>
                  <p className="mt-1 text-xs text-[#6366f1]/80">Tous utilisateurs confondus</p>
                </div>
                <div className="rounded-2xl border border-[#e0e7ff] bg-white/80 px-5 py-4 text-sm text-[#312e81] shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6366f1]">Actifs (page)</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1e1b4b]">
                    {summary.pageActive}
                    {summary.activeShare !== undefined && (
                      <span className="ml-2 text-xs font-semibold text-[#818cf8]">{summary.activeShare}%</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-[#6366f1]/80">{summary.pageInactive} inactif(s) à requalifier</p>
                </div>
              </>
            ) : (
              <>
                <Skeleton className="h-28 w-56 rounded-2xl bg-slate-200/80" />
                <Skeleton className="h-28 w-56 rounded-2xl bg-slate-200/80" />
              </>
            )}
          </div>
        </div>
      </section>

      <AdminUsersFilters
        values={draftFilters}
        onChange={(next) => setDraftFilters(next)}
        onApply={applyFilters}
        onReset={resetFilters}
        onCreate={() => setCreateOpen(true)}
        onExport={handleExport}
        disabled={isLoading || isExporting}
      />

      {error && (
        <EmptyState className="rounded-[28px] border border-rose-200/70 bg-rose-50/80 py-16">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fee2e2] text-[#b91c1c]">
            ⚠️
          </span>
          <p className="text-sm font-medium text-[#b91c1c]">
            {error instanceof ApiError ? error.message : "Impossible de récupérer les utilisateurs."}
          </p>
          <Button className="mt-3" variant="secondary" onClick={() => reload()}>
            Réessayer
          </Button>
        </EmptyState>
      )}

      <AdminUsersTable
        data={data}
        isLoading={isLoading}
        onView={handleView}
        onToggleStatus={handleToggleStatus}
        onChangeRole={(user) => {
          setSelectedUser(user);
          setRoleOpen(true);
        }}
        onPageChange={updatePage}
      />

      <AdminUserDetailsModal
        open={isDetailsOpen}
        onClose={() => setDetailsOpen(false)}
        user={detailsUser}
      />

      <AdminUserFormModal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <AdminChangeRoleModal
        key={selectedUser?.id ?? "aucun"}
        open={isRoleOpen}
        onClose={() => {
          setRoleOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleChangeRole}
      />
    </div>
  );
}
