# Guide d'Implémentation des Fonctionnalités Manquantes

## ✅ Ce qui a été fait

### 1. Gestion des Spécialisations (COMPLET)

Fichiers créés:

- ✅ `features/admin/specializations/types.ts` - Types TypeScript
- ✅ `features/admin/specializations/api.ts` - Appels API
- ✅ `features/admin/specializations/use-specializations.ts` - Hook React
- ✅ `features/admin/specializations/components/specialization-form-modal.tsx` - Modal de création/édition
- ✅ `features/admin/specializations/components/specializations-table.tsx` - Tableau d'affichage
- ✅ `app/(protected)/admin/specialisations/page.tsx` - Page principale
- ✅ Sidebar admin mise à jour avec le lien

**Fonctionnalités:**

- ✅ Lister les spécialisations (pagination, recherche)
- ✅ Créer une spécialisation
- ✅ Modifier une spécialisation
- ✅ Activer/Désactiver une spécialisation
- ✅ Supprimer une spécialisation

**⚠️ Backend requis:**
Le backend doit implémenter ces endpoints (non documentés dans l'API):

```
GET    /api/admin/specialisations
POST   /api/admin/specialisations
GET    /api/admin/specialisations/{id}
PATCH  /api/admin/specialisations/{id}
DELETE /api/admin/specialisations/{id}
POST   /api/admin/specialisations/{id}/deactivate
POST   /api/admin/specialisations/{id}/reactivate
POST   /api/admin/specialisations/bulk/delete
```

---

## 📋 Prochaines Étapes Prioritaires

### 2. Suivi des Prescriptions Admin (HIGH PRIORITY)

**Page à créer:** `/admin/ordonnances`

**Structure suggérée:**

```
features/admin/prescriptions/
├── types.ts
├── api.ts
├── use-admin-prescriptions.ts
└── components/
    ├── prescriptions-table.tsx
    └── prescription-details-modal.tsx

app/(protected)/admin/ordonnances/
└── page.tsx
```

**API disponible:**

- `GET /api/prescriptions` - Lister toutes les prescriptions (admin)
- `GET /api/prescriptions/{id}` - Détails d'une prescription

**Types à créer:**

```typescript
interface AdminPrescription {
  id: string;
  patient: {
    id: string;
    fullName: string;
  };
  medecin: {
    id: string;
    fullName: string;
    specialty: string;
  };
  consultationId: string;
  medicaments: Array<{
    nom: string;
    dosage: string;
    frequence: string;
    duree: string;
  }>;
  instructionsGenerales?: string;
  createdAt: string;
}
```

**Fonctionnalités:**

- Lister toutes les prescriptions (pagination)
- Filtrer par médecin/patient/date
- Voir les détails d'une prescription
- Exporter en PDF (optionnel)

---

### 3. Amélioration des Statistiques (MEDIUM PRIORITY)

**Page existante:** `/admin/statistiques`

**À ajouter:**

```typescript
// features/admin/stats/types.ts
interface DetailedStats extends AdminStats {
  // Statistiques de revenus (si applicable)
  revenueStats?: {
    totalRevenue: number;
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
    }>;
  };

  // Performance des médecins
  doctorPerformance?: Array<{
    medecinId: string;
    fullName: string;
    totalAppointments: number;
    completedAppointments: number;
    canceledAppointments: number;
    averageRating?: number;
  }>;

  // Tendances mensuelles détaillées
  monthlyTrends: Array<{
    month: string;
    appointments: number;
    newPatients: number;
    revenue?: number;
  }>;
}
```

**API à vérifier:**

- `GET /api/admin/stats?from=...&to=...`
- `GET /api/admin/stats/export` (CSV)

**Composants à créer:**

- `DoctorPerformanceChart.tsx` - Graphique de performance des médecins
- `RevenueChart.tsx` - Graphique des revenus
- `MonthlyTrendsTable.tsx` - Tableau des tendances détaillées
- `StatsExportButton.tsx` - Bouton d'export CSV/PDF

---

### 4. Gestion des Disponibilités Médecin (HIGH PRIORITY)

**Page existante:** `/medecin/calendrier`

**API disponible:**

- `GET /api/medecins/{id}/disponibilites?from=...&to=...`
- `POST /api/medecins/{id}/disponibilites`
- `PUT /api/medecins/{id}/disponibilites/{disponibiliteId}`
- `DELETE /api/medecins/{id}/disponibilites/{disponibiliteId}`

**Types à créer:**

```typescript
interface Disponibilite {
  id: string;
  medecinId: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  recurrence: "AUCUNE" | "QUOTIDIENNE" | "HEBDOMADAIRE" | "MENSUELLE";
  commentaire?: string;
  active: boolean;
}

interface CreateDisponibilitePayload {
  date: string;
  heureDebut: string;
  heureFin: string;
  recurrence: "AUCUNE" | "QUOTIDIENNE" | "HEBDOMADAIRE" | "MENSUELLE";
  commentaire?: string;
}
```

**Composants à créer:**

- `CalendarView.tsx` - Vue calendrier interactive
- `DisponibiliteFormModal.tsx` - Création/édition de créneau
- `DisponibilitesList.tsx` - Liste des créneaux
- `RecurrenceSelector.tsx` - Sélecteur de récurrence

**Bibliothèques recommandées:**

- `react-big-calendar` ou `fullcalendar` pour la vue calendrier

---

### 5. Notifications (MEDIUM PRIORITY)

**Pages à créer:**

- `/admin/notifications` - Gestion des notifications (admin)
- `/medecin/notifications` - Mes préférences (médecin)
- `/patient/notifications` - Mes préférences (patient)

**API disponible:**

- `GET /api/notifications/preferences/me`
- `PUT /api/notifications/preferences/me`
- `POST /api/notifications/rappels`
- `GET /api/notifications` (admin)
- `PATCH /api/notifications/{id}/etat` (admin)
- `POST /api/notifications/rappels/execute` (admin)

**Structure:**

```
features/notifications/
├── types.ts
├── api.ts
├── use-notifications.ts
└── components/
    ├── notification-preferences.tsx
    ├── notifications-list.tsx
    └── notification-reminder-form.tsx
```

---

### 6. Espace Patient (LOW PRIORITY mais complet)

**Pages à créer:**

```
app/(protected)/patient/
├── page.tsx                    # Tableau de bord
├── rendez-vous/
│   └── page.tsx                # Mes rendez-vous
├── consultations/
│   └── page.tsx                # Mon historique
├── ordonnances/
│   └── page.tsx                # Mes ordonnances
├── profil/
│   └── page.tsx                # Mon profil
└── recherche-medecins/
    └── page.tsx                # Trouver un médecin
```

**API disponible:**

- `GET /api/patients/me` - Mon profil
- `PUT /api/patients/me` - Modifier mon profil
- `GET /api/medecins?q=...&specialite=...&ville=...` - Rechercher médecins
- `GET /api/rdv` (filtré sur patientId)
- `GET /api/consultations` (filtré sur patientId)
- `GET /api/prescriptions` (filtré sur patientId)
- `POST /api/prediagnostic` - Pré-diagnostic IA

---

## 🛠️ Améliorations Techniques

### 1. Gestion des Erreurs Améliorée

Créer un composant `ErrorBoundary`:

```typescript
// components/error-boundary.tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">
              Une erreur est survenue
            </h2>
            <p className="mt-2 text-gray-600">{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### 2. Toast Notifications

Améliorer le `ToastProvider` pour afficher les succès/erreurs:

```typescript
// Ajouter dans app-providers.tsx
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      {children}
    </AuthProvider>
  );
}
```

Utiliser dans les composants:

```typescript
import toast from "react-hot-toast";

const handleCreate = async (data) => {
  try {
    await createSpecialization(data);
    toast.success("Spécialisation créée avec succès");
  } catch (error) {
    toast.error("Erreur lors de la création");
  }
};
```

### 3. Loading States

Créer un composant de skeleton:

```typescript
// components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  );
}

// Usage dans les tables
{isLoading ? (
  <>
    <Skeleton className="h-12 w-full mb-2" />
    <Skeleton className="h-12 w-full mb-2" />
    <Skeleton className="h-12 w-full" />
  </>
) : (
  <SpecializationsTable ... />
)}
```

---

## 🎨 Améliorations UX

### 1. Confirmations des Actions Destructives

Remplacer `window.confirm` par un modal de confirmation:

```typescript
// components/ui/confirm-dialog.tsx
"use client";

import { Modal } from "./modal";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-gray-600">{message}</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onClose} variant="secondary" className="flex-1">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="danger" className="flex-1">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
```

### 2. Navigation Mobile Améliorée

Créer un hamburger menu:

```typescript
// components/layout/mobile-nav.tsx
"use client";

import { useState } from "react";
import { SidebarLink } from "./sidebar-link";

export function MobileNav({
  links,
}: {
  links: Array<{ href: string; label: string; icon: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
        ☰
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white w-72 h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <SidebarLink key={link.href} {...link} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## 📦 Dépendances Recommandées

```bash
# Notifications toast
npm install react-hot-toast

# Calendrier
npm install react-big-calendar date-fns

# Charts améliorés
npm install recharts

# Export PDF
npm install jspdf jspdf-autotable

# Gestion des formulaires complexes (optionnel)
npm install react-hook-form zod @hookform/resolvers
```

---

## 🔐 Sécurité et Performance

### 1. Rate Limiting Côté Client

```typescript
// lib/rate-limiter.ts
export class RateLimiter {
  private calls: number[] = [];

  constructor(private maxCalls: number, private windowMs: number) {}

  canMakeRequest(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter((time) => now - time < this.windowMs);

    if (this.calls.length < this.maxCalls) {
      this.calls.push(now);
      return true;
    }

    return false;
  }
}

// Usage
const apiRateLimiter = new RateLimiter(10, 60000); // 10 calls per minute

if (apiRateLimiter.canMakeRequest()) {
  await fetchData();
} else {
  toast.error("Trop de requêtes, veuillez patienter");
}
```

### 2. Optimisation des Images

Utiliser Next.js Image:

```typescript
import Image from "next/image";

<Image
  src="/avatar.jpg"
  alt="Avatar"
  width={40}
  height={40}
  className="rounded-full"
/>;
```

---

## 📝 Checklist de Déploiement

- [ ] Tester toutes les fonctionnalités en dev
- [ ] Vérifier la compatibilité mobile
- [ ] Tester avec des données réelles
- [ ] Valider les permissions par rôle
- [ ] Tester les cas d'erreur
- [ ] Optimiser les performances
- [ ] Ajouter les tests unitaires (optionnel)
- [ ] Documenter les nouvelles fonctionnalités
- [ ] Vérifier l'accessibilité (ARIA)
- [ ] Configurer les variables d'environnement
- [ ] Déployer sur production

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Type checking
npx tsc --noEmit

# Formater le code
npx prettier --write .
```

---

**Note:** Ce guide suppose que le backend implémente tous les endpoints documentés dans l'API. Si certains endpoints sont manquants, il faudra les implémenter côté backend Java/Spring Boot avant de pouvoir les utiliser dans le frontend.
