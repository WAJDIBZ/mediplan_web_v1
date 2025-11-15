"use client";

import { useState } from "react";
import { HorairesScheduleEditor } from "@/features/medecin/disponibilites/components/horaires-schedule-editor";
import { useDisponibilites } from "@/features/medecin/disponibilites/use-disponibilites";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HorairesSemaine } from "@/features/medecin/disponibilites/types";

export default function MedecinHorairesPage() {
    const { createDisponibilite, isLoading } = useDisponibilites();
    const [horaires, setHoraires] = useState<HorairesSemaine>({
        lundi: [],
        mardi: [],
        mercredi: [],
        jeudi: [],
        vendredi: [],
        samedi: [],
        dimanche: [],
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Créer une disponibilité pour chaque créneau
            const promises: Promise<unknown>[] = [];

            Object.entries(horaires).forEach(([jour, creneaux]) => {
                creneaux.forEach((creneau: { actif: boolean; heureDebut: string; heureFin: string }) => {
                    if (creneau.actif) {
                        // Calculer la date du prochain jour correspondant
                        const today = new Date();
                        const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
                        
                        // Convertir jour français en index (0-6)
                        const jourIndex = {
                            dimanche: 0,
                            lundi: 1,
                            mardi: 2,
                            mercredi: 3,
                            jeudi: 4,
                            vendredi: 5,
                            samedi: 6,
                        }[jour] || 0;

                        let daysUntilTarget = jourIndex - currentDay;
                        if (daysUntilTarget <= 0) {
                            daysUntilTarget += 7;
                        }

                        const targetDate = new Date(today);
                        targetDate.setDate(today.getDate() + daysUntilTarget);

                        // Créer les heures de début et fin
                        const [heureDebutH, heureDebutM] = creneau.heureDebut.split(":");
                        const [heureFinH, heureFinM] = creneau.heureFin.split(":");

                        const heureDebut = new Date(targetDate);
                        heureDebut.setHours(parseInt(heureDebutH), parseInt(heureDebutM), 0, 0);

                        const heureFin = new Date(targetDate);
                        heureFin.setHours(parseInt(heureFinH), parseInt(heureFinM), 0, 0);

                        // La date doit être un DateTime ISO complet (comme dans MongoDB)
                        const dateAtMidnight = new Date(targetDate);
                        dateAtMidnight.setHours(0, 0, 0, 0);

                        const payload = {
                            date: dateAtMidnight.toISOString(), // ISO DateTime complet
                            heureDebut: heureDebut.toISOString(),
                            heureFin: heureFin.toISOString(),
                            recurrence: "HEBDOMADAIRE" as const,
                            commentaire: `Disponibilité ${jour}`,
                            actif: true,
                        };

                        console.log("📤 Envoi de la disponibilité:", JSON.stringify(payload, null, 2));
                        promises.push(createDisponibilite(payload));
                    }
                });
            });

            await Promise.all(promises);
            alert("✅ Horaires enregistrés avec succès !");
        } catch (error) {
            console.error("Erreur complète:", error);
            if (error instanceof Error) {
                const apiError = error as unknown as { status?: number; details?: Record<string, string> };
                const statusInfo = apiError.status ? ` (Status: ${apiError.status})` : '';
                const detailsInfo = apiError.details ? `\nDétails: ${JSON.stringify(apiError.details, null, 2)}` : '';
                alert(`❌ Erreur${statusInfo}: ${error.message}${detailsInfo}`);
            } else {
                alert("❌ Erreur lors de l'enregistrement des horaires");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-[#dbeafe]">
                <CardHeader>
                    <CardTitle>Gestion des horaires de consultation</CardTitle>
                    <CardDescription>
                        Définissez vos créneaux de disponibilité pour chaque jour de la semaine. 
                        Les patients pourront prendre rendez-vous uniquement durant ces horaires.
                    </CardDescription>
                </CardHeader>
            </Card>

            <HorairesScheduleEditor horaires={horaires} onChangeAction={setHoraires} />

            <div className="flex justify-end gap-3">
                <button
                    className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium text-[#1e293b] transition hover:bg-[#f1f5f9] hover:border-[#2563eb]"
                    onClick={() =>
                        setHoraires({
                            lundi: [],
                            mardi: [],
                            mercredi: [],
                            jeudi: [],
                            vendredi: [],
                            samedi: [],
                            dimanche: [],
                        })
                    }
                >
                    Réinitialiser
                </button>
                <Button onClick={handleSave} disabled={isSaving || isLoading}>
                    {isSaving ? "Enregistrement..." : "Enregistrer les horaires"}
                </Button>
            </div>

            <Card className="border-[#fef3c7] bg-[#fffbeb]">
                <CardHeader>
                    <CardTitle className="text-[#92400e]">📋 Instructions</CardTitle>
                    <div className="text-[#78350f]">
                        <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                            <li>Activez les jours où vous souhaitez recevoir des patients</li>
                            <li>Ajoutez plusieurs créneaux par jour si nécessaire (ex: matin et après-midi)</li>
                            <li>Les horaires sont automatiquement répétés chaque semaine</li>
                            <li>Vous pouvez modifier ou supprimer vos disponibilités à tout moment</li>
                        </ul>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}
