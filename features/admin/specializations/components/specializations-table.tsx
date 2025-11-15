"use client";

import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
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
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center">
        <p className="text-[#64748b]">Chargement des spécialisations...</p>
      </div>
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
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
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
            <Tr key={specialization.id}>
              <Td>
                <span className="font-semibold text-[#0f172a]">{specialization.name}</span>
              </Td>
              <Td>
                <span className="text-sm text-[#64748b]">
                  {specialization.description || "—"}
                </span>
              </Td>
              <Td>
                <span className="text-sm text-[#64748b]">
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
                    onClick={() => onEdit(specialization)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
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
    </div>
  );
}
