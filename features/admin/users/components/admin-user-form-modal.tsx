"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { createSchema, stringField } from "@/lib/validation";
import type { AdminCreateUserPayload } from "../types";

interface AdminUserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AdminCreateUserPayload) => Promise<void>;
}

const createUserSchema = createSchema({
  fullName: stringField({ required: true, label: "Nom complet" }),
  email: stringField({ required: true, email: true, label: "Adresse e-mail" }),
  role: stringField({ required: true, label: "Rôle" }),
  password: stringField({ required: true, minLength: 8, label: "Mot de passe" }),
  phone: stringField({ label: "Téléphone" }),
  specialty: stringField({ label: "Spécialité" }),
  licenseNumber: stringField({ label: "Numéro de licence" }),
  dateOfBirth: stringField({ label: "Date de naissance" }),
  gender: stringField({ label: "Genre" }),
  address: stringField({ label: "Adresse" }),
  insuranceNumber: stringField({ label: "Numéro d'assurance" }),
});

const roles = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "MEDECIN", label: "Médecin" },
  { value: "PATIENT", label: "Patient" },
];

export function AdminUserFormModal({ open, onClose, onSubmit }: AdminUserFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState, reset, setValue } = useForm({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      role: "MEDECIN",
      phone: "",
      specialty: "",
      licenseNumber: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      insuranceNumber: "",
    },
    schema: createUserSchema,
  });

  const handleClose = () => {
    reset({
      fullName: "",
      email: "",
      password: "",
      role: "MEDECIN",
      phone: "",
      specialty: "",
      licenseNumber: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      insuranceNumber: "",
    });
    setServerError(null);
    onClose();
  };

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    const role = (values.role as AdminCreateUserPayload["role"]) ?? "PATIENT";
    
    const payload: AdminCreateUserPayload = {
      fullName: values.fullName ?? "",
      email: values.email ?? "",
      password: values.password ?? "",
      role,
      phone: values.phone || undefined,
    };

    // Ajouter les champs spécifiques au médecin
    if (role === "MEDECIN") {
      payload.specialty = values.specialty || undefined;
      payload.licenseNumber = values.licenseNumber || undefined;
    }

    // Ajouter les champs spécifiques au patient
    if (role === "PATIENT") {
      payload.gender = values.gender || undefined;
      payload.dateOfBirth = values.dateOfBirth || undefined;
      payload.insuranceNumber = values.insuranceNumber || undefined;
      
      // Ajouter l'adresse si renseignée
      if (values.address) {
        payload.address = {
          line1: values.address,
        };
      }
    }

    try {
      await onSubmit(payload);
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Une erreur inattendue est survenue.");
      }
    }
  });

  const selectedRole = (formState.values.role as string) || "MEDECIN";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Créer un utilisateur"
      description="Renseignez les informations principales. Vous pourrez compléter le profil ensuite."
    >
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <Label htmlFor="fullName">Nom complet</Label>
          <Input id="fullName" placeholder="Prénom Nom" {...register("fullName")} />
          {formState.errors.fullName && (
            <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.fullName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" type="email" placeholder="medecin@clinique.fr" {...register("email")} />
          {formState.errors.email && <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="password">Mot de passe provisoire</Label>
          <Input id="password" type="password" placeholder="********" {...register("password")} />
          {formState.errors.password && (
            <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.password}</p>
          )}
        </div>
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select
            id="role"
            value={selectedRole}
            onChange={(event) => setValue("role", event.target.value)}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
          {formState.errors.role && <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.role}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" placeholder="+33 6 12 34 56 78" {...register("phone")} />
          {formState.errors.phone && <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.phone}</p>}
        </div>

        {selectedRole === "MEDECIN" && (
          <div className="space-y-4 rounded-lg bg-[#eff6ff] p-4">
            <p className="text-sm font-medium text-[#1e40af]">Informations médicales</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="specialty">Spécialité</Label>
                <Input id="specialty" placeholder="Cardiologie" {...register("specialty")} />
                {formState.errors.specialty && (
                  <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.specialty}</p>
                )}
              </div>
              <div>
                <Label htmlFor="licenseNumber">Numéro RPPS</Label>
                <Input id="licenseNumber" placeholder="12345678901" {...register("licenseNumber")} />
                {formState.errors.licenseNumber && (
                  <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.licenseNumber}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedRole === "PATIENT" && (
          <div className="space-y-4 rounded-lg bg-[#f0fdf4] p-4">
            <p className="text-sm font-medium text-[#15803d]">Informations personnelles</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="dateOfBirth">Date de naissance</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                {formState.errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.dateOfBirth}</p>
                )}
              </div>
              <div>
                <Label htmlFor="gender">Genre</Label>
                <Select
                  id="gender"
                  value={(formState.values.gender as string) || ""}
                  onChange={(event) => setValue("gender", event.target.value)}
                >
                  <option value="">Sélectionner</option>
                  <option value="MALE">Homme</option>
                  <option value="FEMALE">Femme</option>
                  <option value="OTHER">Autre</option>
                </Select>
                {formState.errors.gender && (
                  <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.gender}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="12 Rue de la Paix, 75001 Paris" {...register("address")} />
                {formState.errors.address && (
                  <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.address}</p>
                )}
              </div>
              <div>
                <Label htmlFor="insuranceNumber">Numéro de sécurité sociale</Label>
                <Input
                  id="insuranceNumber"
                  placeholder="1 23 45 67 890 123 45"
                  {...register("insuranceNumber")}
                />
                {formState.errors.insuranceNumber && (
                  <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.insuranceNumber}</p>
                )}
              </div>
            </div>
          </div>
        )}
        {serverError && (
          <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
            {serverError}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>
    </Modal>
  );
}
