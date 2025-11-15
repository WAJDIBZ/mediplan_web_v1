"use client";

import { useMemo, useState } from "react";
import { useSpecializations } from "@/features/admin/specializations/use-specializations";
import { SpecializationsTable } from "@/features/admin/specializations/components/specializations-table";
import { SpecializationFormModal } from "@/features/admin/specializations/components/specialization-form-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
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

  const heroMetrics = useMemo(() => {
    const active = specializations.filter((item) => item.active).length;
    const inactive = specializations.length - active;
    return {
      total: totalElements,
      active,
      inactive,
    };
  }, [specializations, totalElements]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-[#c7d2fe]/80 bg-gradient-to-br from-[#eef2ff] via-white to-[#f9fafb] p-8 shadow-inner">
        <div className="absolute inset-0 opacity-60" aria-hidden>
          <div className="absolute left-6 top-8 h-24 w-24 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-sky-200/30 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[#4338ca]">
              🏥 Référentiel médical
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-[#1e1b4b]">Spécialisations médicales</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#312e81]/80">
                Maintenez un catalogue à jour pour guider les praticiens, faciliter les recherches patient et structurer vos offres de soins.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e0e7ff] bg-white/80 px-5 py-4 text-sm text-[#312e81] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6366f1]">Total</p>
              <p className="mt-2 text-2xl font-semibold text-[#1e1b4b]">{heroMetrics.total}</p>
              <p className="mt-1 text-xs text-[#6366f1]/80">Spécialisations référencées</p>
            </div>
            <div className="rounded-2xl border border-[#e0e7ff] bg-white/80 px-5 py-4 text-sm text-[#0f766e] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">Actives</p>
              <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{heroMetrics.active}</p>
              <p className="mt-1 text-xs text-[#0f766e]/70">Disponibles pour assignation</p>
            </div>
            <div className="rounded-2xl border border-[#e0e7ff] bg-white/80 px-5 py-4 text-sm text-[#ea580c] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#ea580c]">À réactiver</p>
              <p className="mt-2 text-2xl font-semibold text-[#1e1b4b]">{heroMetrics.inactive}</p>
              <p className="mt-1 text-xs text-[#ea580c]/70">En pause actuellement</p>
            </div>
          </div>
          <Button onClick={handleOpenCreateModal} className="self-start lg:self-center">
            <span className="mr-2 text-lg">＋</span>
            Nouvelle spécialisation
          </Button>
        </div>
      </section>

      <Card className="border-[#e0e7ff]">
        <CardHeader className="pb-4">
          <CardTitle>Recherche ciblée</CardTitle>
          <CardDescription>Filtrez et maintenez votre catalogue sans perturber les équipes terrain.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <Input
            placeholder="Dermatologie, chirurgie, pédiatrie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="flex gap-3">
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
        </CardContent>
      </Card>

      <Card className="border-[#e0e7ff]">
        <CardHeader>
          <CardTitle>Vue d’ensemble</CardTitle>
          <CardDescription>
            {totalElements > 0 ? (
              <span>
                {totalElements} spécialisation{totalElements > 1 ? "s" : ""} disponibles dans MediPlan.
              </span>
            ) : (
              "Aucune spécialisation pour le moment."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e0e7ff] bg-[#eef2ff] px-4 py-3 text-xs text-[#312e81]">
            <p className="font-semibold uppercase tracking-wide">Gestion simplifiée</p>
            <p className="mt-1 text-[#6366f1]">Ajoutez, modifiez ou archivez en un clic.</p>
          </div>
          <div className="rounded-2xl border border-[#e0f2fe] bg-[#f0f9ff] px-4 py-3 text-xs text-[#0f766e]">
            <p className="font-semibold uppercase tracking-wide">Coordination</p>
            <p className="mt-1 text-[#0f766e]/80">Assignez les bons praticiens aux bons parcours.</p>
          </div>
          <div className="rounded-2xl border border-[#fee2e2] bg-[#fef2f2] px-4 py-3 text-xs text-[#b91c1c]">
            <p className="font-semibold uppercase tracking-wide">Qualité</p>
            <p className="mt-1 text-[#b91c1c]/80">Identifiez les spécialités à réactiver.</p>
          </div>
        </CardContent>
      </Card>

      <SpecializationsTable
        specializations={specializations}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {isLoading && (
        <div className="grid gap-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={`spec-skeleton-${index}`} className="h-16 w-full rounded-2xl bg-slate-200/70" />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={currentPage} pageCount={totalPages} onChange={handlePageChange} />
      )}

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
