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
    });
    setServerError(null);
    onClose();
  };

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    const payload: AdminCreateUserPayload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      role: values.role as AdminCreateUserPayload["role"],
      phone: values.phone || undefined,
      specialty: values.specialty || undefined,
      licenseNumber: values.licenseNumber || undefined,
    };
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
            value={formState.values.role as string}
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
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" placeholder="+33..." {...register("phone")} />
          </div>
          <div>
            <Label htmlFor="specialty">Spécialité (médecin)</Label>
            <Input id="specialty" placeholder="Cardiologie" {...register("specialty")} />
          </div>
          <div>
            <Label htmlFor="licenseNumber">Numéro RPPS</Label>
            <Input id="licenseNumber" placeholder="LIC-123456" {...register("licenseNumber")} />
          </div>
        </div>
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
