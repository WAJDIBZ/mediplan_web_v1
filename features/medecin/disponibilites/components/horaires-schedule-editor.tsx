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

  const toggleActivation = (jour: keyof HorairesSemaine, actif: boolean) => {
    onChangeAction({
      ...horaires,
      [jour]: horaires[jour].map((c) => ({ ...c, actif })),
    });
  };

  return (
    <div className="space-y-4">
      {JOURS.map(({ key, label }) => {
        const creneaux = horaires[key];
        const hasSlots = creneaux.length > 0;
        const isActive = creneaux.some((c) => c.actif);

        return (
          <div
            key={key}
            className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-[2px] hover:border-sky-200 hover:shadow-[0_25px_45px_-30px_rgba(2,132,199,0.4)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <label className="relative inline-flex h-7 w-12 items-center" aria-label={`Activer ou désactiver ${label}`}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => {
                      if (hasSlots) {
                        toggleActivation(key, !isActive);
                      } else {
                        addCreneau(key);
                      }
                    }}
                    className="peer sr-only"
                  />
                  <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-sky-500" aria-hidden />
                  <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" aria-hidden />
                </label>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">
                    {isActive ? "Jour ouvert aux réservations" : "Jour inactif"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                  {creneaux.length} créneau(x)
                </span>
                {isActive && (
                  <button
                    type="button"
                    onClick={() => addCreneau(key)}
                    className="rounded-2xl border border-sky-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:border-sky-400 hover:text-sky-700"
                  >
                    + Ajouter un créneau
                  </button>
                )}
              </div>
            </div>

            {hasSlots ? (
              <div className="mt-4 space-y-3">
                {creneaux.map((creneau, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-600"
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={creneau.heureDebut}
                        onChange={(event) => updateCreneau(key, index, "heureDebut", event.target.value)}
                        className="w-32 rounded-2xl border-slate-200/80 bg-slate-50/70"
                      />
                      <span className="text-xs text-slate-400">à</span>
                      <Input
                        type="time"
                        value={creneau.heureFin}
                        onChange={(event) => updateCreneau(key, index, "heureFin", event.target.value)}
                        className="w-32 rounded-2xl border-slate-200/80 bg-slate-50/70"
                      />
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                        {creneau.actif ? "Actif" : "Inactif"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCreneau(key, index)}
                        className="rounded-full border border-rose-200/60 bg-rose-50/80 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
                        aria-label="Supprimer le créneau"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-xs text-slate-500">
                Activez ce jour pour ajouter votre premier créneau.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
