# MediPlan Web

Interface Next.js (App Router) dédiée aux professionnels de santé et aux administrateurs MediPlan.

## 🚀 Aperçu

- Landing page premium présentant MediPlan.
- Authentification email / mot de passe connectée aux endpoints Spring Boot (`/api/auth/**`).
- Tableau de bord Administration : statistiques, gestion des utilisateurs et actions rapides.
- Espace Médecin : suivi des rendez-vous, patients, ordonnances et calendrier interactif.
- Composants UI réutilisables, validation forte côté client, notifications et états de chargement soignés.

## 🏗️ Architecture

```
app/
  (public)/         Pages publiques (landing, auth)
  (protected)/      Espaces sécurisés Admin et Médecin
components/
  layout/           Barre latérale, topbar
  ui/               Bibliothèque de composants Tailwind
  feedback/         Toast provider
features/
  auth/             Contexte, hooks et services d'authentification
  admin/            Gestion utilisateurs & statistiques
  medecin/          Dashboard, calendrier, patients, ordonnances (mockées)
lib/                Client API, helpers date/format, SWR maison
hooks/              Hooks partagés (useForm...)
tests/              Tests unitaires (node --test)
```

## ⚙️ Pré-requis & configuration

1. **Variables d'environnement** (fichier `.env.local`) :
   ```bash
   NEXT_PUBLIC_API_URL=https://mediplan-api-1b2c88de81dd.herokuapp.com
   ```
   > Optionnel : l'URL par défaut utilisée dans le code pointe déjà vers l'environnement de production.

2. **Installation & commandes** :
   ```bash
   npm install        # installe les dépendances déjà présentes dans le repo
   npm run dev        # démarre l'application sur http://localhost:3000
   npm run build      # build production
   npm run start      # lance le serveur en mode production
   npm run lint       # vérifie les règles ESLint
   npm run test       # compile les modules utiles et exécute les tests node --test
   ```

## 🔐 Authentification

- `AuthProvider` stocke les tokens en mémoire/localStorage et gère automatiquement le refresh (`/api/auth/refresh`).
- `ProtectedRoute` sécurise les layouts `/admin` et `/medecin` selon le rôle (`ADMIN` ou `MEDECIN`).
- Formulaire de connexion validé côté client (email + mot de passe ≥ 8 caractères) avec remontée des messages backend.

## 🧩 Fonctionnalités principales

### Administration
- Tableau de bord : filtres temporels sur `/api/admin/stats`, cartes synthétiques, répartition des statuts et recommandations.
- Gestion des utilisateurs : liste paginée, recherche, filtres (rôle, statut, provider), création, changement de rôle, activation/désactivation et export CSV.
- Modales dédiées : détails utilisateur, création manuelle, changement de rôle (avec champs spécifiques médecins).

### Médecin
- Dashboard : indicateurs clés, rendez-vous du jour, actions rapides et recommandations.
- Calendrier : vue mensuelle (données mock), navigation par mois, détail des événements dans une modale.
- Patients : table filtrable, dossier patient synthétique (mock) accessible via modale.
- Ordonnances : historique (mock) et formulaire interactif permettant de préparer une ordonnance (multi-médicaments).

## 🧪 Tests

- `tests/token-storage.test.ts` vérifie la persistance des tokens, la notification des abonnés et la purge correcte.
- Les tests compilent via `tsc -p tsconfig.test.json` vers `.tmp/test-build` avant exécution (`node --test`).

## 🔮 Intégrations futures

- Remplacer les mocks (patients, calendrier, ordonnances) par les endpoints REST correspondants (`/api/rdv`, `/api/consultations`, `/api/prescriptions`).
- Ajouter la gestion avancée des disponibilités médecin (`/api/medecins/{id}/disponibilites`).
- Connecter les actions rapides Administration (export, rendez-vous) aux services backend dédiés.

## 🤝 Contribution

1. Créer une branche par fonctionnalité.
2. Lancer `npm run lint && npm run test` avant commit.
3. Documenter toute nouvelle variable d'environnement ou endpoint backend consommé.

Bon développement avec MediPlan !
