"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import type { AdminUserDetails } from "../types";

interface AdminUserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user?: AdminUserDetails | null;
}

export function AdminUserDetailsModal({ open, onClose, user }: AdminUserDetailsModalProps) {
  if (!user) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Profil de ${user.fullName || "Utilisateur"}`}
      description="Visualisez les informations principales pour assurer un suivi précis."
      size="lg"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3">
          <p className="text-sm text-[#475569]">
            <span className="font-semibold text-[#0f172a]">Adresse e-mail :</span> {user.email}
          </p>
          {user.phone && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Téléphone :</span> {user.phone}
            </p>
          )}
          <p className="text-sm text-[#475569]">
            <span className="font-semibold text-[#0f172a]">Rôle :</span> {user.role}
          </p>
          <p className="text-sm text-[#475569]">
            <span className="font-semibold text-[#0f172a]">Statut :</span>{" "}
            {user.active ? <Badge variant="success">Actif</Badge> : <Badge variant="danger">Inactif</Badge>}
          </p>
          <p className="text-sm text-[#475569]">
            <span className="font-semibold text-[#0f172a]">Origine :</span> {user.provider}
          </p>
        </section>
        <section className="space-y-3">
          {user.gender && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Genre :</span>{" "}
              {user.gender === "MALE" ? "Homme" : user.gender === "FEMALE" ? "Femme" : "Autre"}
            </p>
          )}
          {user.dateOfBirth && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Date de naissance :</span>{" "}
              {new Date(user.dateOfBirth).toLocaleDateString("fr-FR")}
            </p>
          )}
          {user.specialty && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Spécialité :</span> {user.specialty}
            </p>
          )}
          {user.licenseNumber && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Numéro RPPS :</span> {user.licenseNumber}
            </p>
          )}
          {user.clinicName && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Cabinet :</span> {user.clinicName}
            </p>
          )}
          {user.insuranceNumber && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Numéro d'assurance :</span> {user.insuranceNumber}
            </p>
          )}
          {user.address?.line1 && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Adresse :</span> {user.address.line1}
              {user.address.line2 && `, ${user.address.line2}`}
              {user.address.city && `, ${user.address.city}`}
              {user.address.zip && ` ${user.address.zip}`}
            </p>
          )}
          {user.emergencyContact?.name && (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Contact d’urgence :</span> {user.emergencyContact.name}
              {user.emergencyContact.phone && ` (${user.emergencyContact.phone})`}
            </p>
          )}
        </section>
      </div>
    </Modal>
  );
}
