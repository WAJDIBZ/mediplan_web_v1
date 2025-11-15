"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/date";
import { useMesPrescriptions } from "@/features/medecin/ordonnances/use-ordonnances";

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
    if (!patientId.trim() || !consultationId.trim()) {
      alert("Veuillez renseigner l'ID patient et l'ID consultation");
      return;
    }
    const cleanedMedications = medications.filter((item) => item.nom.trim().length > 0);
    if (cleanedMedications.length === 0) {
      alert("Veuillez ajouter au moins un médicament");
      return;
    }
    
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
              <Label htmlFor="patientId">ID Patient</Label>
              <Input
                id="patientId"
                placeholder="ID du patient"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="consultationId">ID Consultation</Label>
              <Input
                id="consultationId"
                placeholder="ID de la consultation"
                value={consultationId}
                onChange={(event) => setConsultationId(event.target.value)}
                required
              />
            </div>
          </div>
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
