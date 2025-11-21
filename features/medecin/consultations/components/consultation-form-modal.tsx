"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { createConsultation } from "../api";
import type { CreateConsultationPayload } from "../types";

interface ConsultationFormModalProps {
  open: boolean;
  onClose: () => void;
  rendezVousId: string;
  patientId: string;
  patientName: string;
  onSuccess: () => void;
  onError: (error: unknown) => void;
}

export function ConsultationFormModal({
  open,
  onClose,
  rendezVousId,
  patientId,
  patientName,
  onSuccess,
  onError,
}: ConsultationFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format for datetime-local input
    resume: "",
    diagnostic: "",
    planSuivi: "",
    recommandations: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CreateConsultationPayload = {
        rendezVousId,
        patientId,
        date: new Date(formData.date).toISOString(), // Convert to full ISO string
        resume: formData.resume,
        diagnostic: formData.diagnostic,
        planSuivi: formData.planSuivi,
        recommandations: formData.recommandations.split('\n').filter(line => line.trim() !== ''),
      };

      await createConsultation(payload);
      onSuccess();
      onClose();
    } catch (error) {
      onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Créer une consultation"
      description={`Patient : ${patientName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Date et heure de la consultation</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="resume">Résumé / Motif de consultation *</Label>
          <Textarea
            id="resume"
            value={formData.resume}
            onChange={(e) => handleChange("resume", e.target.value)}
            placeholder="Ex: Consultation de suivi, contrôle annuel..."
            rows={2}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="diagnostic">Diagnostic *</Label>
          <Textarea
            id="diagnostic"
            value={formData.diagnostic}
            onChange={(e) => handleChange("diagnostic", e.target.value)}
            placeholder="Diagnostic posé lors de la consultation..."
            rows={3}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="planSuivi">Plan de suivi *</Label>
          <Textarea
            id="planSuivi"
            value={formData.planSuivi}
            onChange={(e) => handleChange("planSuivi", e.target.value)}
            placeholder="Plan de traitement et suivi préconisé..."
            rows={3}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="recommandations">Recommandations * (une par ligne)</Label>
          <Textarea
            id="recommandations"
            value={formData.recommandations}
            onChange={(e) => handleChange("recommandations", e.target.value)}
            placeholder="Une recommandation par ligne&#10;Ex: Repos pendant 48h&#10;Prendre les médicaments prescrits&#10;Revenir dans 2 semaines"
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer la consultation"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
}
