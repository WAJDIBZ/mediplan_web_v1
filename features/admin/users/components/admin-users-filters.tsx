"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { AdminUserFilters } from "../types";

interface AdminUsersFiltersProps {
  values: AdminUserFilters;
  onChange: (filters: AdminUserFilters) => void;
  onApply: (filters: AdminUserFilters) => void;
  onReset: () => void;
  onCreate: () => void;
  onExport: () => void;
  disabled?: boolean;
}

const roleOptions = [
  { value: "", label: "Tous les rôles" },
  { value: "ADMIN", label: "Administrateurs" },
  { value: "MEDECIN", label: "Médecins" },
  { value: "PATIENT", label: "Patients" },
];

const activeOptions = [
  { value: "", label: "Statut" },
  { value: "true", label: "Actifs" },
  { value: "false", label: "Désactivés" },
];

export function AdminUsersFilters({ values, onChange, onApply, onReset, onCreate, onExport, disabled }: AdminUsersFiltersProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply({ ...values, page: 0 });
  };

  const handleReset = () => {
    onReset();
  };

  const handleQuickFilter = (patch: Partial<AdminUserFilters>) => {
    if (disabled) return;
    const next = { ...values, ...patch, page: 0 };
    onChange(next);
    onApply(next);
  };

  return (
    <form
      className="space-y-6 overflow-hidden rounded-[28px] border border-[#e0e7ff] bg-white/95 p-6 shadow-lg shadow-indigo-950/5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <Label htmlFor="search">Recherche</Label>
          <Input
            id="search"
            placeholder="Nom, e-mail..."
            value={values.q ?? ""}
            onChange={(event) => onChange({ ...values, q: event.target.value })}
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select
            id="role"
            value={values.role ?? ""}
            onChange={(event) => onChange({ ...values, role: event.target.value as AdminUserFilters["role"] })}
            disabled={disabled}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="active">Statut</Label>
          <Select
            id="active"
            value={values.active ?? ""}
            onChange={(event) => onChange({ ...values, active: event.target.value as AdminUserFilters["active"] })}
            disabled={disabled}
          >
            {activeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="provider">Origine</Label>
          <Input
            id="provider"
            placeholder="LOCAL, GOOGLE..."
            value={values.provider ?? ""}
            onChange={(event) => onChange({ ...values, provider: event.target.value })}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Médecins actifs", patch: { role: "MEDECIN", active: "true" as AdminUserFilters["active"] } },
            { label: "Admins", patch: { role: "ADMIN", active: "" as AdminUserFilters["active"] } },
            { label: "Désactivés", patch: { active: "false" as AdminUserFilters["active"] } },
          ].map((chip) => {
            const isActive = Object.entries(chip.patch).every(([key, value]) => (values as Record<string, unknown>)[key] === value);
            return (
              <button
                key={chip.label}
                type="button"
                disabled={disabled}
                onClick={() => handleQuickFilter(chip.patch)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition duration-200",
                  isActive
                    ? "border-[#4338ca] bg-[#4338ca] text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
                    : "border-slate-200 bg-white text-[#4338ca] hover:border-[#a5b4fc] hover:bg-[#eef2ff]",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={disabled}>
            Appliquer les filtres
          </Button>
          <Button type="button" variant="secondary" disabled={disabled} onClick={handleReset}>
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200/70 pt-4">
        <div className="text-xs text-slate-500">
          Exportez les comptes pour partager vos rapports ou créez rapidement un nouvel accès.
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={disabled} onClick={onExport}>
            Export CSV
          </Button>
          <Button type="button" onClick={onCreate}>
            Nouvel utilisateur
          </Button>
        </div>
      </div>
    </form>
  );
}
