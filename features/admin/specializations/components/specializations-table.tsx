"use client";

import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpecializationListItem } from "../types";

interface SpecializationsTableProps {
  specializations: SpecializationListItem[];
  isLoading: boolean;
  onEdit: (specialization: SpecializationListItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
}

export function SpecializationsTable({
  specializations,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: SpecializationsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette spécialisation ?")) {
      return;
    }
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-[#e0e7ff] bg-white/95">
        <CardHeader>
          <CardTitle className="text-base text-[#312e81]">Préparation du catalogue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={`specialization-skeleton-${index}`} className="h-14 w-full rounded-2xl bg-slate-200/70" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!specializations.length) {
    return (
      <EmptyState>
        <span className="text-5xl">🏥</span>
        <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">Aucune spécialisation</h3>
        <p className="mt-2 text-sm text-[#64748b]">
          Commencez par créer votre première spécialisation médicale.
        </p>
      </EmptyState>
    );
  }

  return (
    <Card className="overflow-hidden border border-[#e0e7ff] bg-white/95 shadow-lg shadow-indigo-950/5">
      <CardHeader className="pb-0">
        <CardTitle className="text-base text-[#1e1b4b]">Catalogue des spécialités</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Description</Th>
              <Th>Médecins</Th>
              <Th>Statut</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {specializations.map((specialization) => (
              <Tr
                key={specialization.id}
                className="group transition duration-200 hover:-translate-y-0.5 hover:bg-[#eef2ff]/70"
              >
                <Td>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#1e1b4b]">{specialization.name}</span>
                    <span className="text-xs text-[#818cf8]">ID : {specialization.id}</span>
                  </div>
                </Td>
                <Td>
                  <span className="text-sm text-[#64748b]">{specialization.description || "—"}</span>
                </Td>
                <Td>
                  <span className="text-sm text-[#0f172a]">
                    {specialization.doctorCount ?? 0} médecin{(specialization.doctorCount ?? 0) > 1 ? "s" : ""}
                  </span>
                </Td>
                <Td>
                  <Badge variant={specialization.active ? "success" : "neutral"}>
                    {specialization.active ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border-slate-200 bg-white text-slate-700 hover:border-[#818cf8] hover:text-[#4338ca]"
                      onClick={() => onEdit(specialization)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border-slate-200 bg-white text-slate-700 hover:border-[#818cf8] hover:text-[#4338ca]"
                      onClick={() => onToggleActive(specialization.id, specialization.active)}
                    >
                      {specialization.active ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(specialization.id)}
                      disabled={deletingId === specialization.id}
                    >
                      {deletingId === specialization.id ? "..." : "Supprimer"}
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
