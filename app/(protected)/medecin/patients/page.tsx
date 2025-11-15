"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/date";
import { useMesPatients } from "@/features/medecin/patients/use-patients";

export default function MedecinPatientsPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { patients, isLoading, error } = useMesPatients();

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return patient.fullName.toLowerCase().includes(term) || patient.email.toLowerCase().includes(term);
    });
  }, [patients, search]);

  const selectedPatient = patients.find((patient) => patient.id === selectedId) ?? null;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <Label htmlFor="patient-search">Rechercher un patient</Label>
        <Input
          id="patient-search"
          placeholder="Nom ou adresse e-mail"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mt-2"
        />
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center shadow-sm">
          <p className="text-[#64748b]">Chargement des patients...</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-800">Erreur : {error.message}</p>
        </div>
      )}

      {!isLoading && !error && filteredPatients.length === 0 ? (
        <EmptyState className="py-16">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f2fe] text-[#1d4ed8]">
            👤
          </span>
          <p className="text-sm font-medium text-[#1f2937]">Aucun patient ne correspond à votre recherche.</p>
          <p className="mt-2 text-xs text-[#64748b]">Invitez vos patients à rejoindre MediPlan pour suivre leurs dossiers.</p>
        </EmptyState>
      ) : !isLoading && !error ? (
        <div className="rounded-3xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Patient</TableHeaderCell>
                  <TableHeaderCell>Dernière visite</TableHeaderCell>
                  <TableHeaderCell>Nombre de RDV</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <p className="font-semibold text-[#0f172a]">{patient.fullName}</p>
                      <p className="text-xs text-[#64748b]">{patient.email}</p>
                      {patient.phone && <p className="text-xs text-[#64748b]">{patient.phone}</p>}
                    </TableCell>
                    <TableCell className="text-sm text-[#334155]">
                      {patient.lastConsultation 
                        ? formatDate(new Date(patient.lastConsultation), { day: "2-digit", month: "short", year: "numeric" })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-[#334155]">{patient.totalConsultations}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedId(patient.id)}>
                        Ouvrir le dossier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      ) : null}

      {selectedPatient && (
        <Modal
          open={Boolean(selectedPatient)}
          onClose={() => setSelectedId(null)}
          title={`Dossier de ${selectedPatient.fullName}`}
          description="Synthèse rapide du parcours patient."
        >
          <div className="space-y-3 text-sm text-[#475569]">
            <p>
              <span className="font-semibold text-[#0f172a]">Email :</span> {selectedPatient.email}
            </p>
            {selectedPatient.phone && (
              <p>
                <span className="font-semibold text-[#0f172a]">Téléphone :</span> {selectedPatient.phone}
              </p>
            )}
            {selectedPatient.dateOfBirth && (
              <p>
                <span className="font-semibold text-[#0f172a]">Date de naissance :</span>{" "}
                {formatDate(new Date(selectedPatient.dateOfBirth), { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            )}
            <p>
              <span className="font-semibold text-[#0f172a]">Dernière consultation :</span>{" "}
              {selectedPatient.lastConsultation 
                ? formatDate(new Date(selectedPatient.lastConsultation), { day: "2-digit", month: "long", year: "numeric" })
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Total de consultations :</span> {selectedPatient.totalConsultations}
            </p>
            <p className="text-xs text-[#94a3b8]">
              Connectez-vous à MediPlan mobile pour partager ces informations avec le patient et ajouter des documents.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
