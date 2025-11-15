"use client";

import { Input } from "@/components/ui/input";
import type { JourSemaine, HorairesSemaine } from "../types";

interface HorairesScheduleEditorProps {
    horaires: HorairesSemaine;
    onChangeAction: (horaires: HorairesSemaine) => void;
}

const JOURS: { key: keyof HorairesSemaine; label: string }[] = [
    { key: "lundi", label: "Lundi" },
    { key: "mardi", label: "Mardi" },
    { key: "mercredi", label: "Mercredi" },
    { key: "jeudi", label: "Jeudi" },
    { key: "vendredi", label: "Vendredi" },
    { key: "samedi", label: "Samedi" },
    { key: "dimanche", label: "Dimanche" },
];

export function HorairesScheduleEditor({ horaires, onChangeAction }: HorairesScheduleEditorProps) {
    const addCreneau = (jour: keyof HorairesSemaine) => {
        const jourKey = jour.toUpperCase() as JourSemaine;
        onChangeAction({
            ...horaires,
            [jour]: [
                ...horaires[jour],
                {
                    jour: jourKey,
                    heureDebut: "09:00",
                    heureFin: "17:00",
                    actif: true,
                },
            ],
        });
    };

    const removeCreneau = (jour: keyof HorairesSemaine, index: number) => {
        onChangeAction({
            ...horaires,
            [jour]: horaires[jour].filter((_, i) => i !== index),
        });
    };

    const updateCreneau = (
        jour: keyof HorairesSemaine,
        index: number,
        field: "heureDebut" | "heureFin",
        value: string,
    ) => {
        const updated = [...horaires[jour]];
        updated[index] = { ...updated[index], [field]: value };
        onChangeAction({
            ...horaires,
            [jour]: updated,
        });
    };

    const toggleJour = (jour: keyof HorairesSemaine) => {
        const hasCreneaux = horaires[jour].length > 0;
        if (hasCreneaux) {
            // Désactiver tous les créneaux
            onChangeAction({
                ...horaires,
                [jour]: horaires[jour].map(c => ({ ...c, actif: false })),
            });
        } else {
            // Ajouter un créneau par défaut
            addCreneau(jour);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
                <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
                    Définir les horaires de rendez-vous
                </h3>
                
                {JOURS.map(({ key, label }) => {
                    const creneaux = horaires[key];
                    const isActive = creneaux.length > 0 && creneaux.some(c => c.actif);

                    return (
                        <div key={key} className="mb-6 pb-6 border-b border-[#e2e8f0] last:border-0">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer" aria-label={`Activer/désactiver ${label}`}>
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={() => toggleJour(key)}
                                            className="sr-only peer"
                                            aria-label={`Activer/désactiver ${label}`}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                                    </label>
                                    <span className="font-semibold text-[#1e293b]">{label}</span>
                                </div>
                                {isActive && (
                                    <button
                                        type="button"
                                        onClick={() => addCreneau(key)}
                                        className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-sm font-medium text-[#1e293b] transition hover:bg-[#f1f5f9] hover:border-[#2563eb]"
                                    >
                                        + Ajouter un créneau
                                    </button>
                                )}
                            </div>

                            {creneaux.length > 0 && (
                                <div className="space-y-2 ml-14">
                                    {creneaux.map((creneau, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    value={creneau.heureDebut}
                                                    onChange={(e) =>
                                                        updateCreneau(key, index, "heureDebut", e.target.value)
                                                    }
                                                    className="w-32"
                                                />
                                                <span className="text-[#64748b]">-</span>
                                                <Input
                                                    type="time"
                                                    value={creneau.heureFin}
                                                    onChange={(e) =>
                                                        updateCreneau(key, index, "heureFin", e.target.value)
                                                    }
                                                    className="w-32"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCreneau(key, index)}
                                                className="text-red-600 hover:text-red-800 font-bold text-xl"
                                                aria-label="Remove time slot"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className="mt-6 p-4 bg-[#eff6ff] rounded-lg">
                    <p className="text-sm text-[#1e40af]">
                        <strong>💡 Astuce :</strong> Activez/désactivez les jours et ajoutez plusieurs créneaux par jour. 
                        Les patients pourront uniquement réserver durant ces horaires disponibles.
                    </p>
                </div>
            </div>
        </div>
    );
}
