"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
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
      <EmptyState className="py-16">
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb]">
          ⏳
        </span>
        <p className="text-sm font-medium text-[#2563eb]">Chargement des utilisateurs...</p>
      </EmptyState>
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
    <div className="rounded-3xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
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
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-semibold text-[#0f172a]">{user.fullName || "Utilisateur sans nom"}</div>
                  <div className="text-xs text-[#64748b]">{user.email}</div>
                </TableCell>
                <TableCell className="text-sm text-[#334155]">{user.role}</TableCell>
                <TableCell>
                  {user.active ? (
                    <Badge variant="success">Actif</Badge>
                  ) : (
                    <Badge variant="danger">Inactif</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-[#334155]">{user.provider}</TableCell>
                <TableCell className="text-sm text-[#334155]">
                  {formatDate(new Date(user.createdAt), { day: "2-digit", month: "short", year: "numeric" })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => onView(user)}>
                      Voir
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onChangeRole(user)}>
                      Rôle
                    </Button>
                    <Button
                      variant={user.active ? "danger" : "secondary"}
                      size="sm"
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
