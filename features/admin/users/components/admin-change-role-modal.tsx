"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { createSchema, stringField } from "@/lib/validation";
import type { AdminChangeRolePayload, AdminUserListItem } from "../types";

interface AdminChangeRoleModalProps {
  open: boolean;
  onClose: () => void;
  user?: AdminUserListItem | null;
  onSubmit: (payload: AdminChangeRolePayload) => Promise<void>;
}

const changeRoleSchema = createSchema({
  role: stringField({ required: true, label: "Rôle" }),
  specialty: stringField({ label: "Spécialité" }),
  licenseNumber: stringField({ label: "Numéro de licence" }),
  clinicName: stringField({ label: "Cabinet" }),
});


export function AdminChangeRoleModal({ open, onClose, user, onSubmit }: AdminChangeRoleModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState, reset, setValue } = useForm({
    initialValues: {
      role: user?.role ?? "MEDECIN",
      specialty: "",
      licenseNumber: "",
      clinicName: "",
    },
    schema: changeRoleSchema,
  });

  useEffect(() => {
    if (!user || !open) {
      return;
    }
    reset({
      role: user.role ?? "MEDECIN",
      specialty: "",
      licenseNumber: "",
      clinicName: "",
    });
  }, [open, reset, user]);

  if (!user) {
    return null;
  }

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    const payload: AdminChangeRolePayload = {
      role: values.role as AdminChangeRolePayload["role"],
      specialty: values.specialty || undefined,
      licenseNumber: values.licenseNumber || undefined,
      clinicName: values.clinicName || undefined,
    };
    try {
      await onSubmit(payload);
      setServerError(null);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Une erreur inattendue est survenue.");
      }
    }
  });

  const requiresMedicalInfo = formState.values.role === "MEDECIN";

  return (
    <Modal
      open={open}
      onClose={() => {
        setServerError(null);
        if (user) {
          reset({
            role: user.role ?? "MEDECIN",
            specialty: "",
            licenseNumber: "",
            clinicName: "",
          });
        }
        onClose();
      }}
      title={`Changer le rôle de ${user.fullName}`}
      description="Attribuez un rôle adapté. Pour les médecins, renseignez la spécialité et la licence."
    >
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select id="role" value={formState.values.role as string} onChange={(event) => setValue("role", event.target.value)}>
            <option value="ADMIN">Administrateur</option>
            <option value="MEDECIN">Médecin</option>
            <option value="PATIENT">Patient</option>
          </Select>
        </div>
        {requiresMedicalInfo && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Label htmlFor="specialty">Spécialité</Label>
              <Input id="specialty" placeholder="Ex : Pédiatrie" {...register("specialty")} />
              {formState.errors.specialty && (
                <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.specialty}</p>
              )}
            </div>
            <div>
              <Label htmlFor="licenseNumber">Numéro RPPS</Label>
              <Input id="licenseNumber" placeholder="LIC-XXXX" {...register("licenseNumber")} />
              {formState.errors.licenseNumber && (
                <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.licenseNumber}</p>
              )}
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="clinicName">Nom du cabinet</Label>
              <Input id="clinicName" placeholder="Cabinet du Parc" {...register("clinicName")} />
            </div>
          </div>
        )}
        {serverError && (
          <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
            {serverError}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setServerError(null);
              if (user) {
                reset({
                  role: user.role ?? "MEDECIN",
                  specialty: "",
                  licenseNumber: "",
                  clinicName: "",
                });
              }
              onClose();
            }}
          >
            Annuler
          </Button>
          <Button type="submit">Valider</Button>
        </div>
      </form>
    </Modal>
  );
}
