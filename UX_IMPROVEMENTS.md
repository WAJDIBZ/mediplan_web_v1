# Design System & UX Guidelines — MediPlan Frontend

Ce document synthétise les fondations visuelles et interactives appliquées au redesign de MediPlan. Il sert de référence rapide pour conserver la cohérence sur les prochains écrans.

## 🎨 Palette & Tokens

| Usage | Classe Tailwind | Valeur |
| --- | --- | --- |
| Dégradés primaires | `from-sky-500 via-blue-500 to-indigo-500` | #0EA5E9 → #2563EB → #4338CA |
| Fond neutre | `bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_45%,_#eef2ff_100%)]` | Dégradé bleu ciel → blanc |
| Texte principal | `text-slate-900` | #0F172A |
| Texte secondaire | `text-slate-600` | #475569 |
| Accent succès | `text-emerald-500`, `bg-emerald-50/60` | #10B981 |
| Bords vitrés | `border-white/60`, `backdrop-blur-xl` | Effet glassmorphism |
| Rayons | `rounded-[28px]`, `rounded-3xl` | 24 px – 32 px |

### Typographie
- Utiliser la police `Geist` chargée globalement (`--font-geist-sans`).
- Titres : `text-3xl` à `text-5xl` selon la hiérarchie, poids `font-semibold`.
- Corps : `text-sm` ou `text-base`, couleur `text-slate-600`.

### Ombres
- Cartes principales : `shadow-xl shadow-sky-900/10`.
- Boutons primaires : `shadow-[0_18px_45px_-22px_rgba(14,116,144,0.8)]`.
- Éléments interactifs secondaires : `shadow-slate-900/5`.

## 🧭 Navigation & Responsive
- **Sidebar desktop** : 300 px, `backdrop-blur-2xl`, navigation via `SidebarLink` avec focus visibles et `aria-current`.
- **Mobile** : utiliser `MobileNav` pour générer le menu hamburger. Le drawer applique `aria-modal` et ferme automatiquement après sélection.
- Topbar : badge "MediPlan", date localisée, capsule utilisateur et actions contextuelles.
- Grilles de contenu : `max-w-6xl`, marges `px-4` (mobile) → `lg:px-16`.

## 🔄 Animations & Micro-interactions
- Animation d’entrée générique : classe utilitaire `.animate-in-up` définie dans `globals.css` (fade + translation 12 px).
- Transition hover/active : `transition-all duration-300` sur liens/boutons, combiner `hover:shadow-xl` et `hover:-translate-y-[1px]` avec modération.
- Skeleton : utiliser `components/ui/skeleton.tsx` (shimmer intégré) pour tous les écrans data-heavy.
- Boutons en chargement : propriété `loading` sur `Button` => spinner + `aria-busy=true`.
- Modales/dialogues : `components/ui/modal.tsx` avec transitions opacité + scale.

## ♿ Accessibilité
- Contrastes respectés (texte foncé sur fond clair, CTA sur gradient).
- Focus : `focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2` sur tous les éléments interactifs.
- Navigation clavier mobile : bouton hamburger `aria-expanded`, `aria-controls` et overlay cliquable.
- Messages d’erreurs formulaires : attributs `aria-describedby` et conteneur `role="alert"` pour les erreurs serveur.

## 📐 Mise en page & Sections clés
- **Hero Landing** : container `rounded-[36px]` + background radial, CTA principal gradient + CTA secondaire bordé.
- **Sections Features** : cartes `border-white/60 bg-white/80` pour la cohérence glassmorphism.
- **Contact** : grille 2 colonnes avec cartes support/migration + bloc contact textuel.
- **Login** : grille responsive, panneau branding gradient, panneau formulaire vitré avec badges "Connexion sécurisée".

## ✅ Bonnes pratiques supplémentaires
- Utiliser `max-w` cohérent sur chaque page pour éviter les lignes trop longues.
- Préférer les icônes SVG internes (`components/icons/mediplan-icons.tsx`).
- Garder les textes en français professionnel et concis, éviter jargon superflu.
- Réemployer les composants UI (`Button`, `Card`, `Modal`, `Table`, `Skeleton`) pour bénéficier des styles partagés.

Ces principes assurent une expérience homogène, responsive et accessible sur toutes les surfaces MediPlan.
