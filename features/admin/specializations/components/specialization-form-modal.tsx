"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/useForm";
import { createSchema, stringField } from "@/lib/validation";
import type { CreateSpecializationPayload } from "../types";

interface SpecializationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSpecializationPayload) => Promise<void>;
  mode: "create" | "edit";
  initialData?: CreateSpecializationPayload & { id?: string };
}

const schema = createSchema<CreateSpecializationPayload>({
  name: stringField({ required: true, minLength: 2, maxLength: 100 }),
  description: stringField({ required: false, maxLength: 500 }),
});

export function SpecializationFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}: SpecializationFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm<CreateSpecializationPayload>({
    initialValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      active: initialData?.active ?? true,
    },
    schema,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Modal open={isOpen} onClose={handleClose} title={mode === "create" ? "Nouvelle spécialisation" : "Modifier la spécialisation"}>
      <form onSubmit={onFormSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Nom de la spécialité *</Label>
          <Input
            {...register("name")}
            id="name"
            placeholder="Ex: Cardiologie"
            className={formState.errors.name ? "border-red-500" : ""}
          />
          {formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">{formState.errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register("description")}
            id="description"
            placeholder="Décrivez cette spécialité médicale..."
            rows={4}
            className={formState.errors.description ? "border-red-500" : ""}
          />
          {formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">{formState.errors.description}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Enregistrement..." : mode === "create" ? "Créer" : "Modifier"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
