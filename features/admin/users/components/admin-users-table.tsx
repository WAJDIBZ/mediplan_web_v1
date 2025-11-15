"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import type { AdminUserListItem, AdminUsersResponse } from "../types";

interface AdminUsersTableProps {
  data?: AdminUsersResponse;
  isLoading?: boolean;
  onView: (user: AdminUserListItem) => void;
  onToggleStatus: (user: AdminUserListItem) => void;
  onChangeRole: (user: AdminUserListItem) => void;
  onPageChange: (page: number) => void;
}

export function AdminUsersTable({ data, isLoading, onView, onToggleStatus, onChangeRole, onPageChange }: AdminUsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-[#e0e7ff] bg-white/90 p-6 shadow-inner">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4338ca]">Chargement en cours</p>
            <p className="text-xs text-slate-500">Préparation de la liste des utilisateurs...</p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#4338ca]">⏳</span>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={`user-skeleton-${index}`}
              className="grid items-center gap-4 rounded-2xl border border-slate-100/80 bg-slate-50/80 px-4 py-4 md:grid-cols-[2fr_repeat(3,1fr)_auto]"
            >
              <Skeleton className="h-4 w-48 bg-slate-200" />
              <Skeleton className="h-3 w-24 bg-slate-200" />
              <Skeleton className="h-3 w-16 bg-slate-200" />
              <Skeleton className="h-3 w-20 bg-slate-200" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-16 rounded-xl bg-slate-200" />
                <Skeleton className="h-8 w-20 rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <EmptyState className="py-16">
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f2fe] text-[#1d4ed8]">
          👥
        </span>
        <p className="text-sm font-medium text-[#1f2937]">Aucun utilisateur ne correspond à vos filtres.</p>
        <p className="mt-2 text-xs text-[#64748b]">Ajustez vos critères de recherche ou créez un nouveau compte.</p>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6 rounded-[28px] border border-[#e0e7ff] bg-white/95 p-4 shadow-lg shadow-indigo-950/5">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Utilisateur</TableHeaderCell>
              <TableHeaderCell>Rôle</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
              <TableHeaderCell>Origine</TableHeaderCell>
              <TableHeaderCell>Créé le</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {data.content.map((user) => (
              <TableRow key={user.id} className="group transition duration-200 hover:-translate-y-0.5 hover:bg-[#eef2ff]/80">
                <TableCell>
                  <div className="font-semibold text-[#0f172a]">{user.fullName || "Utilisateur sans nom"}</div>
                  <div className="text-xs text-[#64748b]">{user.email}</div>
                </TableCell>
                <TableCell className="text-sm text-[#334155]">{user.role}</TableCell>
                <TableCell>
                  {user.active ? <Badge variant="success">Actif</Badge> : <Badge variant="danger">Inactif</Badge>}
                </TableCell>
                <TableCell className="text-sm text-[#334155]">{user.provider}</TableCell>
                <TableCell className="text-sm text-[#334155]">
                  {formatDate(new Date(user.createdAt), { day: "2-digit", month: "short", year: "numeric" })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border-slate-200 bg-white text-slate-700 hover:border-[#818cf8] hover:text-[#4338ca]"
                      onClick={() => onView(user)}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border-slate-200 bg-white text-slate-700 hover:border-[#818cf8] hover:text-[#4338ca]"
                      onClick={() => onChangeRole(user)}
                    >
                      Rôle
                    </Button>
                    <Button
                      variant={user.active ? "danger" : "secondary"}
                      size="sm"
                      className={user.active ? undefined : "border-slate-200 bg-white text-slate-700 hover:border-rose-200"}
                      onClick={() => onToggleStatus(user)}
                    >
                      {user.active ? "Désactiver" : "Réactiver"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
      <Pagination page={data.number} pageCount={data.totalPages} onChange={onPageChange} />
    </div>
  );
}
