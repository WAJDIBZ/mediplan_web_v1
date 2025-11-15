"use client";

import { useState } from "react";
import { useSpecializations } from "@/features/admin/specializations/use-specializations";
import { SpecializationsTable } from "@/features/admin/specializations/components/specializations-table";
import { SpecializationFormModal } from "@/features/admin/specializations/components/specialization-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import type { CreateSpecializationPayload, SpecializationListItem, UpdateSpecializationPayload } from "@/features/admin/specializations/types";

export default function SpecializationsPage() {
  const {
    specializations,
    totalElements,
    totalPages,
    currentPage,
    isLoading,
    filters,
    setFilters,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    deactivateSpecialization,
    reactivateSpecialization,
  } = useSpecializations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationListItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setFilters({ ...filters, q: searchQuery, page: 0 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedSpecialization(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (specialization: SpecializationListItem) => {
    setModalMode("edit");
    setSelectedSpecialization(specialization);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateSpecializationPayload) => {
    if (modalMode === "create") {
      await createSpecialization(data);
    } else if (selectedSpecialization) {
      await updateSpecialization(selectedSpecialization.id, data as UpdateSpecializationPayload);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSpecialization(id, false);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    if (currentActive) {
      await deactivateSpecialization(id);
    } else {
      await reactivateSpecialization(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Spécialisations médicales</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Gérez les spécialités médicales disponibles dans votre système
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <span className="mr-2">+</span>
          Nouvelle spécialisation
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une spécialisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Rechercher
          </Button>
          {filters.q && (
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilters({ ...filters, q: "", page: 0 });
              }}
              variant="secondary"
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#64748b]">
          <span className="font-semibold text-[#0f172a]">{totalElements}</span> spécialisation{totalElements > 1 ? "s" : ""} trouvée{totalElements > 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <SpecializationsTable
        specializations={specializations}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          pageCount={totalPages}
          onChange={handlePageChange}
        />
      )}

      {/* Modal */}
      <SpecializationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        mode={modalMode}
        initialData={selectedSpecialization || undefined}
      />
    </div>
  );
}
