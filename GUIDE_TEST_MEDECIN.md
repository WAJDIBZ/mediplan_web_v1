# 🎯 Guide de Test - Dashboard Médecin & Disponibilités

## ✅ Ce qui a été implémenté

### 1. **Système de Disponibilités Complet**

- Types TypeScript pour les disponibilités MongoDB
- API CRUD complète pour gérer les disponibilités
- Hook React `useDisponibilites` avec SWR
- Composant `HorairesScheduleEditor` avec interface visuelle (comme votre capture)
- Page `/medecin/horaires` pour configurer les horaires hebdomadaires

### 2. **Dashboard Médecin Connecté aux Vraies Données**

- Types pour stats et rendez-vous
- API pour récupérer les données du backend
- Hook `useMedecinDashboard` qui rafraîchit automatiquement
- Page dashboard mise à jour avec vraies données au lieu de mock

### 3. **Nouvelle Navigation**

- Lien "Mes horaires" ajouté dans la sidebar médecin

---

## 🚀 Comment tester

### Étape 1 : Vérifier la compilation

```bash
npm run dev
```

Le projet devrait compiler sans erreurs.

### Étape 2 : Tester la page Horaires

1. **Se connecter en tant que médecin**
2. **Aller sur** `/medecin/horaires`
3. **Vous devriez voir** :

   - Liste des jours de la semaine (Lundi-Dimanche)
   - Toggle pour activer/désactiver chaque jour
   - Bouton "Add new time" pour ajouter des créneaux
   - Inputs pour heureDebut et heureFin (format HH:MM)
   - Bouton 🗑️ pour supprimer un créneau

4. **Tester l'interface** :

   ```
   ✅ Activer "Lundi"
   ✅ Ajouter un créneau : 09:00 - 12:00
   ✅ Ajouter un autre créneau : 14:00 - 18:00
   ✅ Répéter pour d'autres jours
   ✅ Cliquer sur "Enregistrer les horaires"
   ```

5. **Ce qui se passe** :
   - Frontend crée une disponibilité pour chaque créneau
   - Appelle `POST /api/medecin/disponibilites`
   - Données sauvegardées dans MongoDB collection `disponibilites`

### Étape 3 : Vérifier le Dashboard

1. **Aller sur** `/medecin`
2. **Le dashboard essaie de charger** :

   - Stats via `GET /api/medecin/stats`
   - Rendez-vous via `GET /api/medecin/rendez-vous?date=2025-11-14`

3. **Si le backend n'est pas prêt** :
   - Vous verrez un loader ou un message d'erreur
   - C'est normal ! Le backend doit implémenter ces endpoints

---

## 🔧 Backend à implémenter (URGENT)

### Endpoints nécessaires

#### 1. Stats du médecin

```
GET /api/medecin/stats
Authorization: Bearer {token}

Response:
{
  "totalPatients": 45,
  "rendezVousAujourdhui": 8,
  "rendezVousSemaine": 32,
  "tauxPresence": 87,
  "tempsMoyenConsultation": 23,
  "prochainsRendezVous": 5
}
```

#### 2. Rendez-vous du jour

```
GET /api/medecin/rendez-vous?date=2025-11-14
Authorization: Bearer {token}

Response: Array de RendezVous
```

#### 3. CRUD Disponibilités

```
GET    /api/medecin/disponibilites
POST   /api/medecin/disponibilites
PATCH  /api/medecin/disponibilites/{id}
DELETE /api/medecin/disponibilites/{id}
POST   /api/medecin/disponibilites/{id}/activate
POST   /api/medecin/disponibilites/{id}/deactivate
```

---

## 📊 Structure MongoDB - Collection `disponibilites`

```json
{
  "_id": "691075d9e9e20b3e061e31c9",
  "medecinId": "691074dae9e20b3e061e31c5",
  "date": "2025-11-14T23:00:00.000Z",
  "heureDebut": "2025-11-14T09:00:00.000Z",
  "heureFin": "2025-11-14T17:00:00.000Z",
  "actif": true,
  "recurrence": "HEBDOMADAIRE",
  "commentaire": "Consultations du lundi",
  "createdAt": "2025-11-09T11:07:05.378Z",
  "updatedAt": "2025-11-09T11:07:05.378Z",
  "version": 0,
  "_class": "com.example.mediplan.agenda.disponibilite.Disponibilite"
}
```

---

## 🧪 Tests Postman pour Disponibilités

### 1. Créer une disponibilité

```bash
POST https://mediplan-api-1b2c88de81dd.herokuapp.com/api/medecin/disponibilites
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2025-11-18T00:00:00.000Z",
  "heureDebut": "2025-11-18T09:00:00.000Z",
  "heureFin": "2025-11-18T12:00:00.000Z",
  "recurrence": "HEBDOMADAIRE",
  "commentaire": "Consultations du lundi matin",
  "actif": true
}
```

### 2. Lister les disponibilités

```bash
GET https://mediplan-api-1b2c88de81dd.herokuapp.com/api/medecin/disponibilites
Authorization: Bearer {token}
```

### 3. Modifier une disponibilité

```bash
PATCH https://mediplan-api-1b2c88de81dd.herokuapp.com/api/medecin/disponibilites/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "actif": false,
  "commentaire": "Fermé pour congés"
}
```

---

## 📁 Fichiers créés

### Types & API

- `features/medecin/disponibilites/types.ts` - Interfaces TypeScript
- `features/medecin/disponibilites/api.ts` - Fonctions API
- `features/medecin/disponibilites/use-disponibilites.ts` - Hook React
- `features/medecin/dashboard/types.ts` - Types dashboard
- `features/medecin/dashboard/api.ts` - API dashboard
- `features/medecin/dashboard/use-medecin-dashboard.ts` - Hook dashboard

### Composants

- `features/medecin/disponibilites/components/horaires-schedule-editor.tsx` - Éditeur d'horaires

### Pages

- `app/(protected)/medecin/horaires/page.tsx` - Page gestion horaires
- `app/(protected)/medecin/page.tsx` - Dashboard mis à jour

### Navigation

- `components/layout/doctor-sidebar.tsx` - Lien "Mes horaires" ajouté

### Documentation

- `BACKEND_UPDATE_NEEDED.md` - Endpoints requis pour le backend

---

## 🎨 Fonctionnalités de l'interface Horaires

1. **Toggle par jour** : Activer/désactiver chaque jour
2. **Créneaux multiples** : Plusieurs créneaux par jour (ex: matin + après-midi)
3. **Input time** : Sélecteur d'heure natif du navigateur
4. **Suppression** : Bouton 🗑️ pour retirer un créneau
5. **Sauvegarde** : Enregistrement de tous les créneaux en une fois
6. **Réinitialisation** : Bouton pour tout effacer

---

## ⚠️ État actuel

### ✅ Frontend prêt

- Toutes les interfaces sont créées
- Tous les hooks sont implémentés
- Toutes les pages sont fonctionnelles
- Navigation mise à jour

### ⏳ Backend requis

- Endpoints `disponibilites` à créer
- Endpoints `stats` et `rendez-vous` à créer
- Collection MongoDB `disponibilites` à créer

### 🔄 Workaround temporaire

- Le dashboard affiche un loader si les endpoints n'existent pas
- Un message d'erreur s'affiche si l'API échoue
- Les horaires peuvent être testés une fois le backend prêt

---

## 📞 Next Steps

1. **Développeur Backend** : Implémenter les endpoints listés dans `BACKEND_UPDATE_NEEDED.md`
2. **Créer la collection** `disponibilites` dans MongoDB
3. **Tester les endpoints** avec Postman
4. **Vérifier l'intégration** Frontend ↔️ Backend
5. **Ajuster si nécessaire** les formats de données

---

## 💡 Notes importantes

- **Recurrence** : `AUCUNE`, `HEBDOMADAIRE`, `MENSUELLE`
- **Statut RDV** : `PLANIFIE`, `CONFIRME`, `ANNULE`, `HONORE`, `ABSENT`
- **Format dates** : ISO 8601 (ex: `2025-11-14T09:00:00.000Z`)
- **Authentication** : Tous les endpoints requièrent un Bearer token
- **Pagination** : Liste des disponibilités paginée (page, size)

---

## 🎉 Résultat final attendu

Une fois le backend implémenté :

1. **Dashboard médecin** affiche les vraies stats et rendez-vous
2. **Page Horaires** permet de définir les disponibilités semaine par semaine
3. **Patients** peuvent réserver uniquement sur les créneaux disponibles
4. **Synchronisation** automatique entre disponibilités et rendez-vous
5. **Interface intuitive** ressemblant à votre capture d'écran

Bon courage ! 🚀
