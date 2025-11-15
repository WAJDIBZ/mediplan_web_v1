"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { fetchConsultationsForSelect, fetchPatientsForSelect } from "@/features/medecin/ordonnances/api";
import { useMesPrescriptions } from "@/features/medecin/ordonnances/use-ordonnances";
import { formatDate } from "@/lib/date";

interface MedicationForm {
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
}

export default function MedecinPrescriptionsPage() {
  const { prescriptions, isLoading, error, createNewPrescription, isCreating } = useMesPrescriptions();

  const [patientId, setPatientId] = useState("");
  const [consultationId, setConsultationId] = useState("");
  const [medications, setMedications] = useState<MedicationForm[]>([
    { nom: "", dosage: "", frequence: "", duree: "" },
  ]);
  const [errors, setErrors] = useState<{
    patientId?: string;
    consultationId?: string;
    medications?: string;
  }>({});
  const [patients, setPatients] = useState<Array<{ id: string; label: string; email?: string }>>([]);
  const [consultations, setConsultations] = useState<Array<{ id: string; label: string; date: string }>>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      setLoadingPatients(true);
      try {
        const data = await fetchPatientsForSelect();
        setPatients(data);
      } catch (err) {
        console.error("Erreur chargement patients:", err);
      } finally {
        setLoadingPatients(false);
      }
    };
    loadPatients();
  }, []);

  useEffect(() => {
    if (!patientId) {
      setConsultations([]);
      setConsultationId("");
      return;
    }

    const loadConsultations = async () => {
      setLoadingConsultations(true);
      try {
        const data = await fetchConsultationsForSelect(patientId);
        setConsultations(data);
      } catch (err) {
        console.error("Erreur chargement consultations:", err);
      } finally {
        setLoadingConsultations(false);
      }
    };

    loadConsultations();
  }, [patientId]);

  const addMedicationLine = () => {
    setMedications((current) => [...current, { nom: "", dosage: "", frequence: "", duree: "" }]);
  };

  const updateMedication = (index: number, field: keyof MedicationForm, value: string) => {
    setMedications((current) =>
      current.map((medication, idx) => (idx === index ? { ...medication, [field]: value } : medication)),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: typeof errors = {};

    if (!patientId.trim()) {
      newErrors.patientId = "Veuillez sélectionner un patient";
    }

    if (!consultationId.trim()) {
      newErrors.consultationId = "Veuillez sélectionner une consultation";
    }

    const cleanedMedications = medications.filter((item) => item.nom.trim().length > 0);
    if (cleanedMedications.length === 0) {
      newErrors.medications = "Veuillez ajouter au moins un médicament";
    }

    const incompleteMeds = cleanedMedications.filter(
      (med) => !med.nom.trim() || !med.dosage.trim() || !med.frequence.trim() || !med.duree.trim(),
    );
    if (incompleteMeds.length > 0) {
      newErrors.medications = "Tous les champs des médicaments doivent être remplis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await createNewPrescription({
        patientId: patientId.trim(),
        consultationId: consultationId.trim(),
        medicaments: cleanedMedications,
      });

      setPatientId("");
      setConsultationId("");
      setMedications([{ nom: "", dosage: "", frequence: "", duree: "" }]);
    } catch (err) {
      console.error("Erreur lors de la création de l'ordonnance:", err);
      setErrors({ medications: err instanceof Error ? err.message : "Erreur lors de la création" });
    }
  };

  const lastFivePrescriptions = useMemo(() => prescriptions.slice(0, 5), [prescriptions]);

  return (
    <div className="space-y-10">
      <section className="rounded-4xl bg-gradient-to-br from-[#0ea5e9] via-[#38bdf8] to-[#2563eb] px-8 py-10 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
              Ordonnances
            </Badge>
            <h1 className="text-3xl font-semibold md:text-4xl">Créez et partagez vos prescriptions en quelques instants</h1>
            <p className="text-sm text-white/80 md:text-base">
              Pré-remplissez vos traitements, associez-les à la bonne consultation et envoyez-les en toute sécurité à vos patients.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl border border-white/25 bg-white/10 p-6 text-sm backdrop-blur">
            <div className="flex items-center justify-between text-white/70">
              <span>Ordonnances totales</span>
              <span className="text-3xl font-semibold text-white">{prescriptions.length}</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>5 dernières</span>
              <span className="text-white">{lastFivePrescriptions.length}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="border-[#dbeafe]">
          <CardHeader className="pb-3">
            <CardTitle>Nouvelle ordonnance</CardTitle>
            <CardDescription>
              Sélectionnez un patient, liez la bonne consultation puis ajoutez les traitements nécessaires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-xs text-[#0f172a]">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                Étape 1 · Patient
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#cbd5f5] bg-white px-4 py-3 text-xs text-[#1e293b]">
                <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                Étape 2 · Consultation
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#cbd5f5] bg-white px-4 py-3 text-xs text-[#1e293b]">
                <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                Étape 3 · Médicaments
              </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="patientId">Patient *</Label>
                  <select
                    id="patientId"
                    value={patientId}
                    onChange={(event) => {
                      setPatientId(event.target.value);
                      setErrors((prev) => ({ ...prev, patientId: undefined }));
                    }}
                    disabled={loadingPatients}
                    aria-label="Sélectionner un patient"
                    className={`mt-2 flex h-12 w-full rounded-2xl border ${
                      errors.patientId ? "border-red-500" : "border-[#bfdbfe]"
                    } bg-white px-4 text-sm shadow-sm shadow-sky-100/40 ring-offset-white placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">{loadingPatients ? "Chargement..." : "Sélectionner un patient"}</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.label} {patient.email ? `(${patient.email})` : ""}
                      </option>
                    ))}
                  </select>
                  {errors.patientId && <p className="mt-1 text-xs text-red-600">{errors.patientId}</p>}
                </div>

                <div>
                  <Label htmlFor="consultationId">Consultation *</Label>
                  <select
                    id="consultationId"
                    value={consultationId}
                    onChange={(event) => {
                      setConsultationId(event.target.value);
                      setErrors((prev) => ({ ...prev, consultationId: undefined }));
                    }}
                    disabled={!patientId || loadingConsultations}
                    aria-label="Sélectionner une consultation"
                    className={`mt-2 flex h-12 w-full rounded-2xl border ${
                      errors.consultationId ? "border-red-500" : "border-[#bfdbfe]"
                    } bg-white px-4 text-sm shadow-sm shadow-sky-100/40 ring-offset-white placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">
                      {!patientId
                        ? "Sélectionner d'abord un patient"
                        : loadingConsultations
                        ? "Chargement..."
                        : consultations.length === 0
                        ? "Aucune consultation disponible"
                        : "Sélectionner une consultation"}
                    </option>
                    {consultations.map((consultation) => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.label}
                      </option>
                    ))}
                  </select>
                  {errors.consultationId && <p className="mt-1 text-xs text-red-600">{errors.consultationId}</p>}
                </div>
              </div>

              {errors.medications && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors.medications}
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Médicaments</p>
                    <p className="text-xs text-[#64748b]">Précisez nom, dosage, fréquence et durée du traitement.</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full border border-[#bfdbfe] bg-white text-[#2563eb] hover:bg-[#eff6ff]"
                    onClick={addMedicationLine}
                  >
                    Ajouter un médicament
                  </Button>
                </div>

                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-3xl border border-[#e2e8f0] bg-white/70 p-4 shadow-sm md:grid-cols-4"
                    >
                      <Input
                        placeholder="Nom"
                        value={medication.nom}
                        onChange={(event) => updateMedication(index, "nom", event.target.value)}
                        className="h-11 rounded-2xl border-[#dbeafe] focus-visible:ring-[#2563eb]/60"
                      />
                      <Input
                        placeholder="Dosage"
                        value={medication.dosage}
                        onChange={(event) => updateMedication(index, "dosage", event.target.value)}
                        className="h-11 rounded-2xl border-[#dbeafe] focus-visible:ring-[#2563eb]/60"
                      />
                      <Input
                        placeholder="Fréquence"
                        value={medication.frequence}
                        onChange={(event) => updateMedication(index, "frequence", event.target.value)}
                        className="h-11 rounded-2xl border-[#dbeafe] focus-visible:ring-[#2563eb]/60"
                      />
                      <Input
                        placeholder="Durée"
                        value={medication.duree}
                        onChange={(event) => updateMedication(index, "duree", event.target.value)}
                        className="h-11 rounded-2xl border-[#dbeafe] focus-visible:ring-[#2563eb]/60"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-[#cbd5f5] bg-[#f8fbff] p-4 text-xs text-[#475569] md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2563eb] shadow">
                    ℹ️
                  </span>
                  <p>Les ordonnances sont automatiquement envoyées dans l&apos;espace patient MediPlan.</p>
                </div>
                <p className="font-medium text-[#2563eb]">Assurez-vous de valider toutes les informations.</p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="h-11 rounded-full bg-[#2563eb] px-6 text-white shadow-lg shadow-blue-200/60 hover:bg-[#1d4ed8] disabled:cursor-wait disabled:bg-[#94a3b8]"
                >
                  {isCreating ? "Enregistrement..." : "Enregistrer l'ordonnance"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-[#dbeafe]">
            <CardHeader className="pb-2">
              <CardTitle>Résumé rapide</CardTitle>
              <CardDescription>Vos 5 dernières prescriptions actives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-[#475569]">
              {lastFivePrescriptions.length === 0 && !isLoading ? (
                <p className="text-xs text-[#94a3b8]">Aucune ordonnance enregistrée pour le moment.</p>
              ) : (
                lastFivePrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#0f172a]">{prescription.patientName}</p>
                      <p className="text-xs text-[#94a3b8]">
                        {formatDate(new Date(prescription.date), { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="rounded-full bg-[#eff6ff] text-[#2563eb]">
                      {prescription.medicaments.length} médicament(s)
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-[#cbd5f5] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe]">
            <CardHeader className="pb-2">
              <CardTitle>Bonnes pratiques</CardTitle>
              <CardDescription>Assurez une délivrance sans erreur.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-[#1f2937]">
              <div className="rounded-2xl border border-white/60 bg-white/60 p-3">
                <p className="font-semibold">Clarté des posologies</p>
                <p className="text-[#475569]">Vérifiez le dosage et la fréquence pour limiter les confusions.</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-3">
                <p className="font-semibold">Historique patient</p>
                <p className="text-[#475569]">Consultez l&apos;historique du patient avant de finaliser la prescription.</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-3">
                <p className="font-semibold">Communication sécurisée</p>
                <p className="text-[#475569]">Informez le patient que l&apos;ordonnance est disponible dans son espace.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {isLoading && (
        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Chargement des ordonnances</CardTitle>
            <CardDescription>Nous préparons la liste de vos prescriptions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-60 rounded-full" />
                <Skeleton className="h-3 w-40 rounded-full" />
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

      {!isLoading && !error && prescriptions.length === 0 ? (
        <EmptyState className="py-16">
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2fe] text-lg text-[#1d4ed8] shadow-inner shadow-blue-200">
            💊
          </span>
          <p className="text-sm font-semibold text-[#1f2937]">Aucune ordonnance enregistrée pour le moment.</p>
          <p className="mt-2 text-xs text-[#64748b]">
            Créez votre première prescription pour retrouver ici l&apos;ensemble de vos traitements récents.
          </p>
        </EmptyState>
      ) : null}

      {!isLoading && !error && prescriptions.length > 0 && (
        <Card className="border-[#dbeafe]">
          <CardHeader className="pb-3">
            <CardTitle>Ordonnances récentes</CardTitle>
            <CardDescription>Historique des prescriptions partagées avec vos patients.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Patient</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Médicaments</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id} className="transition-colors hover:bg-[#f8fbff]">
                      <TableCell className="align-top">
                        <p className="font-semibold text-[#0f172a]">{prescription.patientName}</p>
                      </TableCell>
                      <TableCell className="align-top text-sm text-[#334155]">
                        {formatDate(new Date(prescription.date), { day: "2-digit", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell className="align-top text-sm text-[#334155]">
                        <ul className="space-y-2 text-xs text-[#475569]">
                          {prescription.medicaments.map((medication, idx) => (
                            <li key={`${prescription.id}-${idx}`} className="rounded-2xl border border-[#e2e8f0] bg-white px-3 py-2">
                              <span className="font-semibold text-[#0f172a]">{medication.nom}</span> – {medication.dosage}, {" "}
                              {medication.frequence}, {medication.duree}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
