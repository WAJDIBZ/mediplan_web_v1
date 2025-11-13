"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/date";
import { prescriptionsMock, type PrescriptionItem } from "@/features/medecin/ordonnances/mock-data";

interface MedicationForm {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function MedecinPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(prescriptionsMock);
  const [patient, setPatient] = useState("");
  const [instructions, setInstructions] = useState("");
  const [medications, setMedications] = useState<MedicationForm[]>([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  const addMedicationLine = () => {
    setMedications((current) => [...current, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const updateMedication = (index: number, field: keyof MedicationForm, value: string) => {
    setMedications((current) =>
      current.map((medication, idx) => (idx === index ? { ...medication, [field]: value } : medication)),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patient.trim()) {
      return;
    }
    const cleanedMedications = medications.filter((item) => item.name.trim().length > 0);
    if (cleanedMedications.length === 0) {
      return;
    }
    const newPrescription: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      patient: patient.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      medications: cleanedMedications.map((item) => ({
        name: item.name,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
      })),
      instructions: instructions.trim() || "",
    };
    setPrescriptions((current) => [newPrescription, ...current]);
    setPatient("");
    setInstructions("");
    setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
  };

  return (
    <div className="space-y-8">
      <Card className="border-[#dbeafe]">
        <CardHeader>
          <CardTitle>Nouvelle ordonnance</CardTitle>
          <CardDescription>Préparez une prescription à remettre ou à envoyer au patient.</CardDescription>
        </CardHeader>
        <form className="space-y-6 px-6 pb-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Input
              id="patient"
              placeholder="Nom et prénom"
              value={patient}
              onChange={(event) => setPatient(event.target.value)}
            />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#1f2937]">Médicaments</p>
            {medications.map((medication, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Nom"
                  value={medication.name}
                  onChange={(event) => updateMedication(index, "name", event.target.value)}
                />
                <Input
                  placeholder="Dosage"
                  value={medication.dosage}
                  onChange={(event) => updateMedication(index, "dosage", event.target.value)}
                />
                <Input
                  placeholder="Fréquence"
                  value={medication.frequency}
                  onChange={(event) => updateMedication(index, "frequency", event.target.value)}
                />
                <Input
                  placeholder="Durée"
                  value={medication.duration}
                  onChange={(event) => updateMedication(index, "duration", event.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addMedicationLine}>
              Ajouter un médicament
            </Button>
          </div>
          <div>
            <Label htmlFor="instructions">Instructions générales</Label>
            <Textarea
              id="instructions"
              placeholder="Conseils pour le patient..."
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Enregistrer l’ordonnance</Button>
          </div>
        </form>
      </Card>

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
                <TableHeaderCell>Instructions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="align-top">
                    <p className="font-semibold text-[#0f172a]">{prescription.patient}</p>
                  </TableCell>
                  <TableCell className="align-top text-sm text-[#334155]">
                    {formatDate(new Date(prescription.createdAt), { day: "2-digit", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="align-top text-sm text-[#334155]">
                    <ul className="space-y-1">
                      {prescription.medications.map((medication) => (
                        <li key={`${prescription.id}-${medication.name}`}>
                          <span className="font-semibold">{medication.name}</span> – {medication.dosage}, {medication.frequency}, {medication.duration}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="align-top text-sm text-[#334155]">{prescription.instructions}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
