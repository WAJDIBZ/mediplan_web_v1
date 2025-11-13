"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
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

  return (
    <form className="grid gap-4 rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Button type="submit" disabled={disabled}>
            Appliquer les filtres
          </Button>
          <Button type="button" variant="secondary" disabled={disabled} onClick={handleReset}>
            Réinitialiser
          </Button>
        </div>
        <div className="flex gap-3">
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
