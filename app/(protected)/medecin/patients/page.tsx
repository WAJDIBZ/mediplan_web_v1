"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/date";
import { patientsMock } from "@/features/medecin/patients/mock-data";

export default function MedecinPatientsPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    return patientsMock.filter((patient) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return patient.name.toLowerCase().includes(term) || patient.email.toLowerCase().includes(term);
    });
  }, [search]);

  const selectedPatient = patientsMock.find((patient) => patient.id === selectedId) ?? null;

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

      {filteredPatients.length === 0 ? (
        <EmptyState className="py-16">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f2fe] text-[#1d4ed8]">
            👤
          </span>
          <p className="text-sm font-medium text-[#1f2937]">Aucun patient ne correspond à votre recherche.</p>
          <p className="mt-2 text-xs text-[#64748b]">Invitez vos patients à rejoindre MediPlan pour suivre leurs dossiers.</p>
        </EmptyState>
      ) : (
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
                      <p className="font-semibold text-[#0f172a]">{patient.name}</p>
                      <p className="text-xs text-[#64748b]">{patient.email}</p>
                      <p className="text-xs text-[#64748b]">{patient.phone}</p>
                    </TableCell>
                    <TableCell className="text-sm text-[#334155]">
                      {formatDate(new Date(patient.lastVisit), { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-sm text-[#334155]">{patient.totalAppointments}</TableCell>
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
      )}

      {selectedPatient && (
        <Modal
          open={Boolean(selectedPatient)}
          onClose={() => setSelectedId(null)}
          title={`Dossier de ${selectedPatient.name}`}
          description="Synthèse rapide du parcours patient."
        >
          <div className="space-y-3 text-sm text-[#475569]">
            <p>
              <span className="font-semibold text-[#0f172a]">Contact :</span> {selectedPatient.email} – {selectedPatient.phone}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Dernière visite :</span> {formatDate(new Date(selectedPatient.lastVisit))}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Total de rendez-vous :</span> {selectedPatient.totalAppointments}
            </p>
            <p>
              <span className="font-semibold text-[#0f172a]">Notes :</span> {selectedPatient.notes}
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
