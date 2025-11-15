"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { useMesPatients } from "@/features/medecin/patients/use-patients";
import { formatDate } from "@/lib/date";

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

  const totalPatients = patients.length;
  const patientsWithConsultation = patients.filter((patient) => Boolean(patient.lastConsultation)).length;
  const recentlySeenPatients = patients.filter((patient) => {
    if (!patient.lastConsultation) return false;
    const last = new Date(patient.lastConsultation).getTime();
    const today = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return today - last <= sevenDays;
  }).length;

  return (
    <div className="space-y-10">
      <section className="rounded-4xl bg-gradient-to-br from-[#0ea5e9] via-[#38bdf8] to-[#6366f1] px-8 py-10 text-white shadow-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white shadow-sm">
              Patientèle
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Vos patients, au cœur de votre pratique</h1>
            <p className="text-sm text-white/80 md:text-base">
              Consultez rapidement vos dossiers, identifiez les patients à relancer et préparez vos consultations en toute
              sérénité.
            </p>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-4 text-right shadow-lg backdrop-blur">
            <p className="text-sm uppercase tracking-wide text-white/70">Patients suivis</p>
            <p className="text-4xl font-semibold">{totalPatients}</p>
            <p className="mt-1 text-xs text-white/70">
              {recentlySeenPatients} consultation(s) réalisée(s) cette semaine
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#cbd5f5] bg-white shadow-md shadow-sky-100/60">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide text-[#2563eb]">Activity</CardDescription>
            <CardTitle className="text-2xl text-[#0f172a]">{patientsWithConsultation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[#475569]">
            <p>patients ont déjà eu au moins une consultation suivie.</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94a3b8]">À relancer</span>
              <span className="font-semibold text-[#0f172a]">{totalPatients - patientsWithConsultation}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] shadow-md shadow-sky-100/60">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide text-[#0ea5e9]">Recents</CardDescription>
            <CardTitle className="text-2xl text-[#0f172a]">{recentlySeenPatients}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[#475569]">
            <p>consultations réalisées au cours des 7 derniers jours.</p>
            <p className="text-xs text-[#0f172a]/70">Gardez le contact pour assurer un suivi optimal.</p>
          </CardContent>
        </Card>
        <Card className="border-[#cbd5f5] bg-white shadow-md shadow-sky-100/60">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide text-[#0ea5e9]">Qualité de dossier</CardDescription>
            <CardTitle className="text-2xl text-[#0f172a]">
              {patients.filter((patient) => Boolean(patient.phone)).length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[#475569]">
            <p>patients disposent d&apos;un contact téléphonique enregistré.</p>
            <p className="text-xs text-[#0f172a]/70">Complétez les fiches pour améliorer vos rappels.</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-[#dbeafe]">
        <CardHeader className="pb-2">
          <CardTitle>Recherche intelligente</CardTitle>
          <CardDescription>Filtrez par nom, adresse e-mail ou numéro de téléphone.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-[minmax(0,420px)_1fr] md:items-end">
          <div>
            <Label htmlFor="patient-search" className="text-sm font-medium text-[#1f2937]">
              Rechercher un patient
            </Label>
            <Input
              id="patient-search"
              placeholder="Rechercher par nom ou e-mail"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="mt-2 h-12 rounded-2xl border-[#bfdbfe] bg-white shadow-inner shadow-sky-100/40 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#2563eb]/60"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#475569]">
            <div className="flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
              {recentlySeenPatients} vus récemment
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              {totalPatients - recentlySeenPatients} à relancer
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Chargement des patients</CardTitle>
            <CardDescription>Préparation de vos dossiers patients…</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_96px] items-center gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-44 rounded-full" />
                  <Skeleton className="h-3 w-28 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-9 w-full rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50/80">
          <CardHeader>
            <CardTitle className="text-red-900">Erreur de chargement</CardTitle>
            <CardDescription className="text-red-700">{error.message}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {!isLoading && !error && filteredPatients.length === 0 ? (
        <EmptyState className="py-16">
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2fe] text-lg text-[#1d4ed8] shadow-inner shadow-blue-200">
            👤
          </span>
          <p className="text-sm font-semibold text-[#1f2937]">Aucun patient ne correspond à votre recherche.</p>
          <p className="mt-2 text-xs text-[#64748b]">
            Invitez vos patients à rejoindre MediPlan pour suivre leurs dossiers et bénéficier des rappels automatiques.
          </p>
        </EmptyState>
      ) : null}

      {!isLoading && !error && filteredPatients.length > 0 && (
        <Card className="border-[#dbeafe]">
          <CardHeader className="pb-3">
            <CardTitle>Liste des patients</CardTitle>
            <CardDescription>Survolez un patient pour dévoiler les actions rapides.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Patient</TableHeaderCell>
                    <TableHeaderCell>Dernière visite</TableHeaderCell>
                    <TableHeaderCell>Consultations honorées</TableHeaderCell>
                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {filteredPatients.map((patient) => {
                    const isRecent = patient.lastConsultation
                      ? new Date().getTime() - new Date(patient.lastConsultation).getTime() < 3 * 24 * 60 * 60 * 1000
                      : false;

                    return (
                      <TableRow key={patient.id} className="group transition-all duration-200 hover:bg-[#f8fbff]">
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#0f172a]">{patient.fullName}</p>
                              {!patient.lastConsultation && (
                                <Badge variant="secondary" className="rounded-full bg-[#fef3c7] text-[#b45309]">
                                  Nouveau
                                </Badge>
                              )}
                              {isRecent && (
                                <Badge variant="secondary" className="rounded-full bg-[#dcfce7] text-[#166534]">
                                  Vu récemment
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-[#475569]">{patient.email}</p>
                            {patient.phone && <p className="text-xs text-[#94a3b8]">{patient.phone}</p>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-[#1e293b]">
                          {patient.lastConsultation
                            ? formatDate(new Date(patient.lastConsultation), {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "À planifier"}
                        </TableCell>
                        <TableCell className="text-sm text-[#1e293b]">{patient.totalConsultations}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full border border-transparent bg-white text-[#2563eb] shadow-sm hover:border-[#bfdbfe] hover:bg-[#eff6ff]"
                            >
                              Contacter
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="rounded-full bg-[#2563eb] text-white shadow hover:bg-[#1d4ed8]"
                              onClick={() => setSelectedId(patient.id)}
                            >
                              Dossier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedPatient && (
        <Modal
          open={Boolean(selectedPatient)}
          onClose={() => setSelectedId(null)}
          title={`Dossier de ${selectedPatient.fullName}`}
          description="Synthèse rapide du parcours patient"
        >
          <div className="space-y-6 text-sm text-[#1f2937]">
            <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[#64748b]">Contact</p>
                  <p className="font-semibold text-[#0f172a]">{selectedPatient.email}</p>
                  {selectedPatient.phone ? (
                    <p className="text-xs text-[#475569]">{selectedPatient.phone}</p>
                  ) : (
                    <p className="text-xs text-[#f97316]">Téléphone non renseigné</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[#64748b]">Dernière consultation</p>
                  <p className="font-semibold text-[#0f172a]">
                    {selectedPatient.lastConsultation
                      ? formatDate(new Date(selectedPatient.lastConsultation), {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Aucune consultation"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[#64748b]">Total visites</p>
                  <p className="text-lg font-semibold text-[#2563eb]">{selectedPatient.totalConsultations}</p>
                </div>
              </div>
            </div>

            {selectedPatient.dateOfBirth && (
              <div className="rounded-2xl border border-[#e2e8f0] p-4">
                <p className="text-xs uppercase tracking-wide text-[#64748b]">Informations personnelles</p>
                <p className="mt-2 text-sm text-[#1f2937]">
                  Date de naissance :{" "}
                  {formatDate(new Date(selectedPatient.dateOfBirth), {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-[#64748b]">Suivi recommandé</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] p-4 text-[#0f172a]">
                  <p className="text-sm font-semibold">Prochain contact</p>
                  <p className="mt-1 text-xs text-[#475569]">
                    {selectedPatient.lastConsultation
                      ? "Planifier une consultation de suivi dans les 30 prochains jours."
                      : "Premier rendez-vous à programmer pour établir le dossier médical."}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-4 text-[#0f172a]">
                  <p className="text-sm font-semibold">Notes internes</p>
                  <p className="mt-1 text-xs text-[#475569]">
                    Ajoutez vos observations dans MediPlan pour préparer les prochaines consultations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
