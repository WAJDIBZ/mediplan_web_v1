# Améliorations UX/UI Recommandées - MediPlan

## 🎨 Vue d'Ensemble

Ce document liste toutes les améliorations UX/UI recommandées pour améliorer l'expérience utilisateur sur la plateforme MediPlan.

---

## 🔔 1. Système de Notifications Toast

### Problème Actuel

- Aucun feedback visuel après les actions (création, modification, suppression)
- L'utilisateur ne sait pas si son action a réussi ou échoué

### Solution Recommandée

Implémenter `react-hot-toast`

**Installation:**

```bash
npm install react-hot-toast
```

**Intégration dans `app-providers.tsx`:**

```typescript
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#0f172a",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {children}
    </AuthProvider>
  );
}
```

**Usage dans les composants:**

```typescript
import toast from "react-hot-toast";

// Succès
toast.success("Spécialisation créée avec succès");

// Erreur
toast.error("Erreur lors de la création");

// Info
toast("Information importante");

// Chargement
const toastId = toast.loading("Enregistrement en cours...");
// ... après l'opération
toast.success("Terminé!", { id: toastId });
```

---

## 💬 2. Modals de Confirmation

### Problème Actuel

- Utilisation de `window.confirm()` natif (pas esthétique)
- Pas de personnalisation possible

### Solution Recommandée

Créer un composant `ConfirmDialog`

**Fichier:** `components/ui/confirm-dialog.tsx`

```typescript
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
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "info",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <p className="text-[#64748b]">{message}</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onClose} variant="secondary" className="flex-1">
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant={variant === "danger" ? "danger" : "primary"}
          className="flex-1"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
```

**Usage:**

```typescript
const [confirmOpen, setConfirmOpen] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);

const handleDeleteClick = (id: string) => {
  setDeleteId(id);
  setConfirmOpen(true);
};

const handleConfirmDelete = async () => {
  if (deleteId) {
    await deleteSpecialization(deleteId);
    toast.success("Spécialisation supprimée");
  }
};

return (
  <>
    <Button onClick={() => handleDeleteClick(spec.id)} variant="danger">
      Supprimer
    </Button>

    <ConfirmDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Confirmer la suppression"
      message="Êtes-vous sûr de vouloir supprimer cette spécialisation ? Cette action ne peut pas être annulée."
      confirmText="Oui, supprimer"
      cancelText="Non, annuler"
      variant="danger"
    />
  </>
);
```

---

## 📱 3. Navigation Mobile

### Problème Actuel

- Sidebar non visible sur mobile
- Navigation difficile sur petits écrans

### Solution Recommandée

Créer un menu hamburger responsive

**Fichier:** `components/layout/mobile-nav.tsx`

```typescript
"use client";

import { useState } from "react";
import { SidebarLink } from "./sidebar-link";
import { Button } from "../ui/button";

interface MobileNavProps {
  links: Array<{
    href: string;
    label: string;
    icon: string;
  }>;
  title: string;
  subtitle: string;
}

export function MobileNav({ links, title, subtitle }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col gap-6 px-6 py-10 h-full">
          {/* Close Button */}
          <button onClick={() => setIsOpen(false)} className="self-end p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#2563eb]">
              MEDIPLAN
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[#64748b]">{subtitle}</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                {...link}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
```

**Intégration dans les layouts:**

```typescript
// admin-sidebar.tsx
import { MobileNav } from "./mobile-nav";

const adminLinks = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "👥" },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: "📅" },
  { href: "/admin/specialisations", label: "Spécialisations", icon: "🏥" },
  { href: "/admin/statistiques", label: "Statistiques", icon: "📈" },
];

export function AdminSidebarLayout({ children }: AdminSidebarProps) {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <MobileNav
        links={adminLinks}
        title="Administration"
        subtitle="Pilotez votre organisation"
      />

      {/* Desktop Sidebar (existing code) */}
      <aside className="hidden lg:flex ...">{/* ... */}</aside>

      <main className="flex-1 px-4 py-6 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
```

---

## 🔄 4. États de Chargement Améliorés

### Problème Actuel

- Messages de chargement simples
- Pas de skeleton screens

### Solution Recommandée

Créer des composants Skeleton

**Fichier:** `components/ui/skeleton.tsx`

```typescript
"use client";

import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse bg-gray-200 rounded", className)} />;
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-32" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-20 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
```

**Usage:**

```typescript
import { SkeletonTable } from '@/components/ui/skeleton';

{isLoading ? (
  <SkeletonTable rows={10} />
) : (
  <SpecializationsTable ... />
)}
```

---

## 📊 5. Tables Responsives

### Problème Actuel

- Tables difficiles à lire sur mobile
- Scroll horizontal peu intuitif

### Solution Recommandée

Convertir en cards sur mobile

**Fichier:** `components/ui/responsive-table.tsx`

```typescript
"use client";

import { ReactNode } from "react";

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
}: ResponsiveTableProps<T>) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white">
        <table className="w-full">
          <thead className="bg-[#f8fafc]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-[#0f172a]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="border-t border-[#e2e8f0]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-[#64748b]"
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className="rounded-xl border border-[#e2e8f0] bg-white p-4"
          >
            {columns
              .filter((col) => !col.hideOnMobile)
              .map((col) => (
                <div key={col.key} className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-[#64748b] uppercase mb-1">
                    {col.label}
                  </div>
                  <div className="text-sm text-[#0f172a]">
                    {col.render(item)}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
```

---

## 🔍 6. Recherche Améliorée

### Problème Actuel

- Recherche uniquement sur Enter ou clic
- Pas de debounce

### Solution Recommandée

Recherche avec debounce automatique

**Fichier:** `hooks/useDebounce.ts`

```typescript
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Usage:**

```typescript
import { useDebounce } from "@/hooks/useDebounce";

const [searchQuery, setSearchQuery] = useState("");
const debouncedQuery = useDebounce(searchQuery, 500);

useEffect(() => {
  if (debouncedQuery !== undefined) {
    setFilters({ ...filters, q: debouncedQuery, page: 0 });
  }
}, [debouncedQuery]);

return (
  <Input
    placeholder="Rechercher..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
);
```

---

## ⚠️ 7. Gestion des Erreurs

### Problème Actuel

- Erreurs non catchées
- Pas de boundary error

### Solution Recommandée

Implémenter un ErrorBoundary

**Fichier:** `components/error-boundary.tsx`

```typescript
"use client";

import { Component, ReactNode } from "react";
import { Button } from "./ui/button";

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="text-center max-w-md">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h2 className="text-2xl font-semibold text-[#0f172a] mb-2">
                Une erreur est survenue
              </h2>
              <p className="text-[#64748b] mb-6">
                {this.state.error?.message || "Erreur inattendue"}
              </p>
              <Button onClick={() => window.location.reload()}>
                Recharger la page
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**Usage dans layout:**

```typescript
import { ErrorBoundary } from "@/components/error-boundary";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AdminSidebarLayout>{children}</AdminSidebarLayout>
    </ErrorBoundary>
  );
}
```

---

## ✨ 8. Animations et Transitions

### Solution Recommandée

Ajouter des animations subtiles

**Fichier:** `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
};
```

**Usage:**

```typescript
<div className="animate-fade-in">
  {/* Contenu */}
</div>

<Modal className="animate-scale-in">
  {/* Contenu */}
</Modal>
```

---

## 🎯 9. Focus Management & Accessibilité

### Solution Recommandée

Améliorer l'accessibilité

**Guidelines:**

1. Ajouter des `aria-label` sur tous les boutons d'action
2. Gérer le focus dans les modals
3. Ajouter des `role` appropriés
4. Support du clavier (Tab, Enter, Escape)

**Exemple:**

```typescript
<Button
  onClick={handleDelete}
  aria-label="Supprimer la spécialisation Cardiologie"
>
  Supprimer
</Button>

<Modal
  open={isOpen}
  onClose={onClose}
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">{title}</h2>
  <p id="modal-description">{description}</p>
</Modal>
```

---

## 📋 Checklist d'Amélioration UX

### Priorité HAUTE (À faire immédiatement)

- [ ] Implémenter les notifications toast
- [ ] Ajouter les modals de confirmation
- [ ] Créer le menu mobile hamburger
- [ ] Ajouter les skeleton loaders

### Priorité MOYENNE (Cette semaine)

- [ ] Tables responsives
- [ ] Recherche avec debounce
- [ ] Error boundary
- [ ] Animations de base

### Priorité BASSE (À planifier)

- [ ] Tooltips sur les actions
- [ ] Raccourcis clavier
- [ ] Mode sombre (dark mode)
- [ ] Personnalisation du thème

---

## 💡 Conseils Généraux

### Design Consistency

1. **Espacements:** Utiliser `gap-2`, `gap-4`, `gap-6` de manière cohérente
2. **Couleurs:** Rester dans la palette définie (bleus, gris)
3. **Typographie:** Hiérarchie claire (h1 > h2 > h3 > p)
4. **Arrondis:** Utiliser `rounded-xl` pour les cards, `rounded-lg` pour les boutons

### Performance

1. **Lazy loading:** Charger les images et composants lourds à la demande
2. **Pagination:** Toujours paginer les listes longues
3. **Debounce:** Pour toutes les recherches en temps réel
4. **Memoization:** Utiliser `useMemo` et `useCallback` quand nécessaire

### Feedback Utilisateur

1. **Toujours confirmer les actions destructives**
2. **Afficher un toast après chaque action**
3. **Montrer un loader pendant les opérations longues**
4. **Désactiver les boutons pendant le submit**

---

**Date:** 13 Novembre 2025  
**Version:** 1.0  
**Status:** 📝 Recommandations UX complètes
