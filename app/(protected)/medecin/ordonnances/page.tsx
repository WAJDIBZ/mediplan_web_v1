"use client";

import { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/date";
import { useMesPrescriptions } from "@/features/medecin/ordonnances/use-ordonnances";
import { fetchPatientsForSelect, fetchConsultationsForSelect } from "@/features/medecin/ordonnances/api";

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

  // Charger les patients au montage
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

  // Charger les consultations quand un patient est sélectionné
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
    
    // Réinitialiser les erreurs
    const newErrors: typeof errors = {};
    
    // Validation du patient
    if (!patientId.trim()) {
      newErrors.patientId = "Veuillez sélectionner un patient";
    }
    
    // Validation de la consultation
    if (!consultationId.trim()) {
      newErrors.consultationId = "Veuillez sélectionner une consultation";
    }
    
    // Validation des médicaments
    const cleanedMedications = medications.filter((item) => item.nom.trim().length > 0);
    if (cleanedMedications.length === 0) {
      newErrors.medications = "Veuillez ajouter au moins un médicament";
    }
    
    // Vérifier que tous les médicaments ont tous les champs remplis
    const incompleteMeds = cleanedMedications.filter(
      (med) => !med.nom.trim() || !med.dosage.trim() || !med.frequence.trim() || !med.duree.trim()
    );
    if (incompleteMeds.length > 0) {
      newErrors.medications = "Tous les champs des médicaments doivent être remplis";
    }
    
    // Si erreurs, les afficher et arrêter
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
      
      // Réinitialiser le formulaire après succès
      setPatientId("");
      setConsultationId("");
      setMedications([{ nom: "", dosage: "", frequence: "", duree: "" }]);
    } catch (err) {
      console.error("Erreur lors de la création de l'ordonnance:", err);
      setErrors({ medications: err instanceof Error ? err.message : "Erreur lors de la création" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-[#dbeafe]">
        <CardHeader>
          <CardTitle>Nouvelle ordonnance</CardTitle>
          <CardDescription>Préparez une prescription à remettre ou à envoyer au patient.</CardDescription>
        </CardHeader>
        <form className="space-y-6 px-6 pb-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
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
                className={`flex h-10 w-full rounded-md border ${errors.patientId ? 'border-red-500' : 'border-[#cbd5e1]'} bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="">Sélectionner un patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.label} {patient.email ? `(${patient.email})` : ''}
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
                className={`flex h-10 w-full rounded-md border ${errors.consultationId ? 'border-red-500' : 'border-[#cbd5e1]'} bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#94a3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="">
                  {!patientId 
                    ? "Sélectionner d'abord un patient" 
                    : loadingConsultations 
                    ? "Chargement..." 
                    : consultations.length === 0
                    ? "Aucune consultation disponible"
                    : "Sélectionner une consultation..."}
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
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-800">{errors.medications}</p>
            </div>
          )}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#1f2937]">Médicaments</p>
            {medications.map((medication, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Nom"
                  value={medication.nom}
                  onChange={(event) => updateMedication(index, "nom", event.target.value)}
                />
                <Input
                  placeholder="Dosage"
                  value={medication.dosage}
                  onChange={(event) => updateMedication(index, "dosage", event.target.value)}
                />
                <Input
                  placeholder="Fréquence"
                  value={medication.frequence}
                  onChange={(event) => updateMedication(index, "frequence", event.target.value)}
                />
                <Input
                  placeholder="Durée"
                  value={medication.duree}
                  onChange={(event) => updateMedication(index, "duree", event.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addMedicationLine}>
              Ajouter un médicament
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Enregistrement..." : "Enregistrer l'ordonnance"}
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && (
        <div className="rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center shadow-sm">
          <p className="text-[#64748b]">Chargement des ordonnances...</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-800">Erreur : {error.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        <Card className="border-[#dbeafe]">
          <CardHeader>
            <CardTitle>Ordonnances récentes</CardTitle>
            <CardDescription>Historique des prescriptions partagées avec vos patients.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto px-6 pb-6">
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
                  <TableRow key={prescription.id}>
                    <TableCell className="align-top">
                      <p className="font-semibold text-[#0f172a]">{prescription.patientName}</p>
                    </TableCell>
                    <TableCell className="align-top text-sm text-[#334155]">
                      {formatDate(new Date(prescription.date), { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="align-top text-sm text-[#334155]">
                      <ul className="space-y-1">
                        {prescription.medicaments.map((medication, idx) => (
                          <li key={`${prescription.id}-${idx}`}>
                            <span className="font-semibold">{medication.nom}</span> – {medication.dosage}, {medication.frequence}, {medication.duree}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
