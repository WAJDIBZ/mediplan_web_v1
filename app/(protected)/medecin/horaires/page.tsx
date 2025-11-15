"use client";

import { useState, useEffect } from "react";
import { HorairesScheduleEditor } from "@/features/medecin/disponibilites/components/horaires-schedule-editor";
import { useDisponibilites } from "@/features/medecin/disponibilites/use-disponibilites";
import { formatDateLocal, formatTimeLocal } from "@/features/medecin/disponibilites/api";
import { ApiError } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HorairesSemaine, JourSemaine } from "@/features/medecin/disponibilites/types";

export default function MedecinHorairesPage() {
    const { disponibilites, createDisponibilite, isLoading, reload } = useDisponibilites();
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
    const [isInitialized, setIsInitialized] = useState(false);

    // Convertir une heure (peut être "HH:mm", "HH:mm:ss" ou ISO timestamp) en "HH:mm"
    const normalizeTime = (time: string): string => {
        if (!time) return "00:00";
        
        // Si déjà au format HH:mm
        if (/^\d{2}:\d{2}$/.test(time)) {
            return time;
        }
        
        // Si format HH:mm:ss, on coupe les secondes
        if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
            return time.substring(0, 5);
        }
        
        // Si c'est un timestamp ISO ou autre format de date
        try {
            const date = new Date(time);
            if (!isNaN(date.getTime())) {
                return formatTimeLocal(date);
            }
        } catch (error) {
            console.error("Erreur conversion heure:", time, error);
        }
        
        // Par défaut, retourner tel quel
        return time;
    };

    // Charger les disponibilités existantes au montage
    useEffect(() => {
        if (!disponibilites || disponibilites.length === 0 || isInitialized) return;

        console.log("📥 Disponibilités reçues:", disponibilites);

        const horairesByJour: HorairesSemaine = {
            lundi: [],
            mardi: [],
            mercredi: [],
            jeudi: [],
            vendredi: [],
            samedi: [],
            dimanche: [],
        };

        // Grouper les disponibilités par jour de la semaine
        disponibilites.forEach((dispo) => {
            console.log("🔍 Traitement dispo:", {
                date: dispo.date,
                heureDebut: dispo.heureDebut,
                heureFin: dispo.heureFin,
                recurrence: dispo.recurrence,
                actif: dispo.actif
            });
            
            if (dispo.recurrence !== "HEBDOMADAIRE" || !dispo.actif) return;

            // Extraire le jour de la semaine depuis la date
            const date = new Date(dispo.date);
            const jourIndex = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
            
            const joursMap: Record<number, keyof HorairesSemaine> = {
                0: "dimanche",
                1: "lundi",
                2: "mardi",
                3: "mercredi",
                4: "jeudi",
                5: "vendredi",
                6: "samedi",
            };

            const jour = joursMap[jourIndex];
            if (!jour) return;

            // Créer un créneau horaire à partir de la disponibilité
            const heureDebutNormalized = normalizeTime(dispo.heureDebut);
            const heureFinNormalized = normalizeTime(dispo.heureFin);
            
            console.log("✅ Ajout créneau:", {
                jour,
                heureDebut: heureDebutNormalized,
                heureFin: heureFinNormalized
            });
            
            horairesByJour[jour].push({
                jour: jour.toUpperCase() as JourSemaine,
                heureDebut: heureDebutNormalized,
                heureFin: heureFinNormalized,
                actif: dispo.actif,
            });
        });

        console.log("📋 Horaires finaux:", horairesByJour);
        setHoraires(horairesByJour);
        setIsInitialized(true);
    }, [disponibilites, isInitialized]);

    const handleSave = async () => {
        // Validation: vérifier qu'il y a au moins un créneau actif
        const hasActiveSlot = Object.values(horaires).some(creneaux => 
            creneaux.some((c: { actif: boolean }) => c.actif)
        );
        
        if (!hasActiveSlot) {
            alert("⚠️ Veuillez définir au moins un créneau horaire actif");
            return;
        }
        
        // Validation: vérifier que les heures de début sont avant les heures de fin
        let hasInvalidTime = false;
        Object.entries(horaires).forEach(([jour, creneaux]) => {
            creneaux.forEach((creneau: { actif: boolean; heureDebut: string; heureFin: string }) => {
                if (creneau.actif) {
                    const [debutH, debutM] = creneau.heureDebut.split(':').map(Number);
                    const [finH, finM] = creneau.heureFin.split(':').map(Number);
                    const debutMinutes = debutH * 60 + debutM;
                    const finMinutes = finH * 60 + finM;
                    
                    if (debutMinutes >= finMinutes) {
                        alert(`⚠️ Erreur le ${jour}: l'heure de début (${creneau.heureDebut}) doit être avant l'heure de fin (${creneau.heureFin})`);
                        hasInvalidTime = true;
                    }
                }
            });
        });
        
        if (hasInvalidTime) {
            return;
        }
        
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

                        // Utiliser les formats LocalDate et LocalTime attendus par le backend Spring Boot
                        const payload = {
                            date: formatDateLocal(targetDate), // Format: "YYYY-MM-DD"
                            heureDebut: formatTimeLocal(heureDebut), // Format: "HH:mm"
                            heureFin: formatTimeLocal(heureFin), // Format: "HH:mm"
                            recurrence: "HEBDOMADAIRE" as const,
                            commentaire: `Disponibilité ${jour}`,
                            actif: true,
                        };

                        promises.push(createDisponibilite(payload));
                    }
                });
            });

            await Promise.all(promises);
            
            // Recharger les disponibilités et réinitialiser l'état
            await reload();
            setIsInitialized(false);
            
            alert("✅ Horaires enregistrés avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            
            // Gestion des erreurs API avec messages du backend
            if (error instanceof ApiError) {
                // 422 = règles métier (ex: heure fin <= début)
                // 400 = validation des champs
                // 409 = conflit de disponibilités
                let errorMessage = error.message;
                
                // Ajouter les détails de validation si présents
                if (error.details && Object.keys(error.details).length > 0) {
                    const detailsList = Object.entries(error.details)
                        .map(([field, msg]) => `- ${field}: ${msg}`)
                        .join('\n');
                    errorMessage += `\n\n${detailsList}`;
                }
                
                alert(`❌ Erreur (${error.status})\n\n${errorMessage}`);
            } else if (error instanceof Error) {
                alert(`❌ Erreur: ${error.message}`);
            } else {
                alert("❌ Erreur inconnue lors de l'enregistrement des horaires");
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
                    onClick={() => {
                        // Réinitialiser à l'état vide puis recharger depuis l'API
                        setHoraires({
                            lundi: [],
                            mardi: [],
                            mercredi: [],
                            jeudi: [],
                            vendredi: [],
                            samedi: [],
                            dimanche: [],
                        });
                        setIsInitialized(false);
                    }}
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
