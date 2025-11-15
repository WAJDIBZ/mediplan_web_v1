# TODO - Tâches Restantes MediPlan

## 🎯 Vue d'Ensemble

Ce document liste toutes les tâches à réaliser pour compléter le projet MediPlan, organisées par priorité et catégorie.

---

## 🔴 PRIORITÉ HAUTE - À faire immédiatement

### 1. Backend - Spécialisations

**Owner:** Backend Developer  
**Estimation:** 1-2 jours  
**Fichiers à créer:**

- [ ] `Specialization.java` (entité MongoDB)
- [ ] `SpecializationRepository.java`
- [ ] `SpecializationService.java`
- [ ] `SpecializationController.java`
- [ ] DTOs (Request/Response)

**Endpoints à implémenter:**

- [ ] `GET /api/admin/specialisations` - Liste paginée
- [ ] `POST /api/admin/specialisations` - Créer
- [ ] `GET /api/admin/specialisations/{id}` - Détails
- [ ] `PATCH /api/admin/specialisations/{id}` - Modifier
- [ ] `DELETE /api/admin/specialisations/{id}` - Supprimer
- [ ] `POST /api/admin/specialisations/{id}/deactivate` - Désactiver
- [ ] `POST /api/admin/specialisations/{id}/reactivate` - Réactiver
- [ ] `POST /api/admin/specialisations/bulk/delete` - Suppression en masse

**Tests:**

- [ ] Tests unitaires du service
- [ ] Tests d'intégration des endpoints
- [ ] Tests avec Postman

**Documentation:** `BACKEND_SPECIALIZATIONS_API.md`

---

### 2. Frontend - Intégration Spécialisations

**Owner:** Frontend Developer  
**Estimation:** 1 jour  
**Tâches:**

- [ ] Tester la page `/admin/specialisations` avec le backend réel
- [ ] Corriger les bugs éventuels
- [ ] Ajouter les toasts de feedback
- [ ] Tester sur mobile
- [ ] Valider l'accessibilité

---

### 3. UX - Notifications Toast

**Owner:** Frontend Developer  
**Estimation:** 4 heures  
**Tâches:**

- [ ] Installer `react-hot-toast`
- [ ] Intégrer dans `AppProviders`
- [ ] Ajouter dans toutes les actions CRUD
  - [ ] Utilisateurs
  - [ ] Rendez-vous
  - [ ] Spécialisations
- [ ] Personnaliser les styles

**Documentation:** `UX_IMPROVEMENTS.md` Section 1

---

### 4. UX - Modals de Confirmation

**Owner:** Frontend Developer  
**Estimation:** 3 heures  
**Tâches:**

- [ ] Créer `components/ui/confirm-dialog.tsx`
- [ ] Remplacer tous les `window.confirm()`
  - [ ] Suppression utilisateurs
  - [ ] Suppression spécialisations
  - [ ] Désactivation comptes
- [ ] Tester le comportement

**Documentation:** `UX_IMPROVEMENTS.md` Section 2

---

## 🟠 PRIORITÉ MOYENNE - Cette semaine

### 5. Admin - Suivi des Prescriptions

**Owner:** Frontend Developer  
**Estimation:** 2-3 jours  
**Tâches:**

- [ ] Créer `features/admin/prescriptions/`
  - [ ] `types.ts`
  - [ ] `api.ts`
  - [ ] `use-admin-prescriptions.ts`
- [ ] Créer les composants
  - [ ] `prescriptions-table.tsx`
  - [ ] `prescription-details-modal.tsx`
  - [ ] `prescriptions-filters.tsx`
- [ ] Créer la page `app/(protected)/admin/ordonnances/page.tsx`
- [ ] Ajouter le lien dans la sidebar admin
- [ ] Tester avec l'API backend

**API utilisée:**

- `GET /api/prescriptions` (filtré pour admin)
- `GET /api/prescriptions/{id}`

---

### 6. Admin - Statistiques Avancées

**Owner:** Frontend Developer  
**Estimation:** 2 jours  
**Tâches:**

- [ ] Améliorer `features/admin/stats/types.ts`
  - [ ] Ajouter `DoctorPerformance`
  - [ ] Ajouter `MonthlyTrends`
  - [ ] Ajouter `RevenueStats`
- [ ] Créer les composants
  - [ ] `doctor-performance-chart.tsx` (graphique)
  - [ ] `revenue-chart.tsx` (graphique)
  - [ ] `monthly-trends-table.tsx`
  - [ ] `stats-export-button.tsx` (CSV/PDF)
- [ ] Installer `recharts` pour les graphiques
- [ ] Mettre à jour la page `/admin/statistiques`

---

### 7. Mobile - Navigation Responsive

**Owner:** Frontend Developer  
**Estimation:** 1 jour  
**Tâches:**

- [ ] Créer `components/layout/mobile-nav.tsx`
- [ ] Intégrer dans `admin-sidebar.tsx`
- [ ] Intégrer dans `doctor-sidebar.tsx`
- [ ] Tester sur différentes tailles d'écran
- [ ] Animations de transition fluides

**Documentation:** `UX_IMPROVEMENTS.md` Section 3

---

### 8. Frontend - États de Chargement

**Owner:** Frontend Developer  
**Estimation:** 1 jour  
**Tâches:**

- [ ] Créer `components/ui/skeleton.tsx`
  - [ ] `Skeleton` (base)
  - [ ] `SkeletonTable`
  - [ ] `SkeletonCard`
  - [ ] `SkeletonList`
- [ ] Remplacer les loaders basiques
  - [ ] Tables utilisateurs
  - [ ] Tables rendez-vous
  - [ ] Tables spécialisations
  - [ ] Cartes statistiques

**Documentation:** `UX_IMPROVEMENTS.md` Section 4

---

## 🟡 PRIORITÉ MOYENNE/BASSE - Semaine prochaine

### 9. Médecin - Gestion des Disponibilités

**Owner:** Frontend Developer  
**Estimation:** 3-4 jours  
**Tâches:**

- [ ] Créer `features/medecin/disponibilites/`
  - [ ] `types.ts`
  - [ ] `api.ts`
  - [ ] `use-disponibilites.ts`
- [ ] Installer `react-big-calendar` ou `fullcalendar`
- [ ] Créer les composants
  - [ ] `calendar-view.tsx` (vue calendrier)
  - [ ] `disponibilite-form-modal.tsx`
  - [ ] `disponibilites-list.tsx`
  - [ ] `recurrence-selector.tsx`
- [ ] Mettre à jour la page `/medecin/calendrier`
- [ ] Tester les récurrences

**API utilisée:**

- `GET /api/medecins/{id}/disponibilites`
- `POST /api/medecins/{id}/disponibilites`
- `PUT /api/medecins/{id}/disponibilites/{disponibiliteId}`
- `DELETE /api/medecins/{id}/disponibilites/{disponibiliteId}`

---

### 10. Système de Notifications

**Owner:** Frontend Developer  
**Estimation:** 2-3 jours  
**Tâches:**

- [ ] Créer `features/notifications/`
  - [ ] `types.ts`
  - [ ] `api.ts`
  - [ ] `use-notifications.ts`
- [ ] Créer les composants
  - [ ] `notification-preferences.tsx`
  - [ ] `notifications-list.tsx`
  - [ ] `notification-reminder-form.tsx`
- [ ] Créer les pages
  - [ ] `/admin/notifications`
  - [ ] `/medecin/notifications`
  - [ ] `/patient/notifications`
- [ ] Implémenter les préférences

**API utilisée:**

- `GET /api/notifications/preferences/me`
- `PUT /api/notifications/preferences/me`
- `POST /api/notifications/rappels`
- `GET /api/notifications` (admin)

---

### 11. Frontend - Recherche avec Debounce

**Owner:** Frontend Developer  
**Estimation:** 2 heures  
**Tâches:**

- [ ] Créer `hooks/useDebounce.ts`
- [ ] Appliquer sur toutes les recherches
  - [ ] Recherche utilisateurs
  - [ ] Recherche rendez-vous
  - [ ] Recherche spécialisations
  - [ ] Recherche médecins (future)

**Documentation:** `UX_IMPROVEMENTS.md` Section 6

---

### 12. Frontend - Tables Responsives

**Owner:** Frontend Developer  
**Estimation:** 1 jour  
**Tâches:**

- [ ] Créer `components/ui/responsive-table.tsx`
- [ ] Convertir les tables existantes
  - [ ] Table utilisateurs
  - [ ] Table rendez-vous
  - [ ] Table spécialisations
- [ ] Tester sur mobile

**Documentation:** `UX_IMPROVEMENTS.md` Section 5

---

## 🟢 PRIORITÉ BASSE - À planifier

### 13. Espace Patient Complet

**Owner:** Frontend Developer  
**Estimation:** 1-2 semaines  
**Tâches:**

- [ ] Créer `features/patient/`
  - [ ] `profile/` (profil)
  - [ ] `appointments/` (rendez-vous)
  - [ ] `consultations/` (historique)
  - [ ] `prescriptions/` (ordonnances)
  - [ ] `search-doctors/` (recherche médecins)
- [ ] Créer `components/layout/patient-sidebar.tsx`
- [ ] Créer les pages
  - [ ] `/patient` (dashboard)
  - [ ] `/patient/rendez-vous`
  - [ ] `/patient/consultations`
  - [ ] `/patient/ordonnances`
  - [ ] `/patient/profil`
  - [ ] `/patient/recherche-medecins`

**API utilisée:**

- `GET /api/patients/me`
- `PUT /api/patients/me`
- `GET /api/medecins?q=...&specialite=...`
- `GET /api/rdv` (filtré patient)
- `GET /api/consultations` (filtré patient)
- `GET /api/prescriptions` (filtré patient)

---

### 14. Pré-diagnostic IA

**Owner:** Frontend + Backend  
**Estimation:** 1 semaine  
**Tâches Backend:**

- [ ] Intégrer une API IA (OpenAI, HuggingFace, etc.)
- [ ] Implémenter l'endpoint `/api/prediagnostic`
- [ ] Validation des symptômes
- [ ] Gestion des limites de requêtes

**Tâches Frontend:**

- [ ] Créer `features/prediagnostic/`
- [ ] Interface de saisie des symptômes
- [ ] Affichage des résultats
- [ ] Disclaimer médical

---

### 15. Export PDF

**Owner:** Frontend Developer  
**Estimation:** 2 jours  
**Tâches:**

- [ ] Installer `jspdf` et `jspdf-autotable`
- [ ] Créer `lib/pdf-export.ts`
- [ ] Implémenter l'export pour:
  - [ ] Liste des utilisateurs
  - [ ] Statistiques
  - [ ] Prescriptions
  - [ ] Rapports personnalisés

---

### 16. Accessibilité (A11Y)

**Owner:** Frontend Developer  
**Estimation:** 3 jours  
**Tâches:**

- [ ] Audit avec Lighthouse
- [ ] Ajouter les `aria-label` manquants
- [ ] Gérer le focus management
- [ ] Support complet du clavier
- [ ] Tester avec un screen reader
- [ ] Contraste des couleurs (WCAG 2.1 AA)

**Documentation:** `UX_IMPROVEMENTS.md` Section 9

---

### 17. Tests Automatisés

**Owner:** Frontend Developer  
**Estimation:** 1 semaine  
**Tâches:**

- [ ] Setup Jest + React Testing Library
- [ ] Tests unitaires des composants UI
- [ ] Tests des hooks personnalisés
- [ ] Tests des utilitaires (lib/)
- [ ] Tests d'intégration
- [ ] CI/CD avec GitHub Actions

---

### 18. Mode Sombre (Dark Mode)

**Owner:** Frontend Developer  
**Estimation:** 3 jours  
**Tâches:**

- [ ] Créer un contexte `ThemeProvider`
- [ ] Définir les couleurs dark mode
- [ ] Ajouter un toggle dans Topbar
- [ ] Mettre à jour tous les composants
- [ ] Persister la préférence (localStorage)

---

## 🛠️ AMÉLIORATIONS TECHNIQUES

### 19. Performance

**Tâches:**

- [ ] Lazy loading des routes
- [ ] Code splitting
- [ ] Optimisation des images (Next/Image)
- [ ] Memoization (useMemo, useCallback)
- [ ] Bundle size analysis

---

### 20. Sécurité

**Tâches:**

- [ ] Rate limiting côté client
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Content Security Policy
- [ ] Audit des dépendances (npm audit)

---

### 21. Monitoring & Logs

**Tâches:**

- [ ] Intégrer Sentry (error tracking)
- [ ] Analytics (Plausible ou Google Analytics)
- [ ] Performance monitoring
- [ ] Logs des actions sensibles

---

## 📚 DOCUMENTATION

### 22. Documentation Utilisateur

**Tâches:**

- [ ] Guide de démarrage
- [ ] Manuel d'utilisation admin
- [ ] Manuel d'utilisation médecin
- [ ] Manuel d'utilisation patient
- [ ] FAQ
- [ ] Vidéos tutoriels (optionnel)

---

### 23. Documentation Technique

**Tâches:**

- [ ] Architecture du projet
- [ ] Guide de contribution
- [ ] Conventions de code
- [ ] Guide de déploiement
- [ ] API Reference (frontend)

---

## 🚀 DÉPLOIEMENT

### 24. CI/CD

**Tâches:**

- [ ] GitHub Actions workflow
- [ ] Build automatique
- [ ] Tests automatiques
- [ ] Déploiement automatique (Vercel/Netlify)
- [ ] Preview deployments

---

### 25. Production Setup

**Tâches:**

- [ ] Variables d'environnement
- [ ] Configuration Vercel/Netlify
- [ ] Domaine personnalisé
- [ ] SSL/HTTPS
- [ ] CDN pour les assets
- [ ] Monitoring production

---

## 📊 Métriques de Progression

### Par Catégorie

| Catégorie      | Tâches Totales | Complétées | Pourcentage |
| -------------- | -------------- | ---------- | ----------- |
| Backend        | 8              | 0          | 0%          |
| Frontend Core  | 15             | 5          | 33%         |
| UX/UI          | 10             | 0          | 0%          |
| Espace Patient | 6              | 0          | 0%          |
| Tests          | 5              | 0          | 0%          |
| Documentation  | 8              | 4          | 50%         |
| Déploiement    | 5              | 0          | 0%          |
| **TOTAL**      | **57**         | **9**      | **~16%**    |

### Par Priorité

| Priorité   | Tâches | Complétées | Pourcentage |
| ---------- | ------ | ---------- | ----------- |
| 🔴 HAUTE   | 15     | 5          | 33%         |
| 🟠 MOYENNE | 25     | 3          | 12%         |
| 🟢 BASSE   | 17     | 1          | 6%          |

---

## 🎯 Planning Suggéré

### Semaine 1 (Actuelle)

- ✅ Gestion des Spécialisations (Frontend)
- [ ] Backend Spécialisations
- [ ] Notifications Toast
- [ ] Modals de Confirmation

### Semaine 2

- [ ] Suivi des Prescriptions Admin
- [ ] Statistiques Avancées
- [ ] Navigation Mobile
- [ ] États de Chargement (Skeleton)

### Semaine 3

- [ ] Gestion des Disponibilités Médecin
- [ ] Système de Notifications
- [ ] Tables Responsives
- [ ] Recherche avec Debounce

### Semaine 4

- [ ] Espace Patient (début)
- [ ] Error Boundary
- [ ] Accessibilité de base

### Mois 2

- [ ] Espace Patient (complet)
- [ ] Pré-diagnostic IA
- [ ] Tests automatisés
- [ ] Documentation utilisateur

### Mois 3

- [ ] Mode Sombre
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Déploiement production

---

## 💡 Notes Importantes

### Dépendances à Installer

```bash
# UX
npm install react-hot-toast

# Calendrier
npm install react-big-calendar date-fns

# Graphiques
npm install recharts

# PDF Export
npm install jspdf jspdf-autotable

# Tests (optionnel)
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Points d'Attention

1. **Toujours tester avec le backend réel** avant de marquer une tâche comme complète
2. **Mobile-first**: Tester sur mobile régulièrement
3. **Accessibilité**: Garder en tête dès le début
4. **Performance**: Optimiser au fur et à mesure

### Blockers Potentiels

- ⚠️ Backend Spécialisations doit être fait avant de tester le frontend
- ⚠️ API Pré-diagnostic nécessite une clé API IA
- ⚠️ Espace Patient dépend de plusieurs endpoints backend

---

## 🏁 Définition de "Done"

Une tâche est considérée comme complète quand:

- [ ] Code implémenté et fonctionnel
- [ ] Testé manuellement (desktop + mobile)
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs de lint
- [ ] Feedback utilisateur (toasts, loaders)
- [ ] Documentation mise à jour si nécessaire
- [ ] Code review (si équipe)
- [ ] Commit avec message clair

---

**Dernière mise à jour:** 13 Novembre 2025  
**Version:** 1.0  
**Status:** 📋 TODO List complète et organisée
