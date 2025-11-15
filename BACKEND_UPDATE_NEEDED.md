# Backend Update Required

## 🚨 URGENT: Include `specialty` field in Users List API

### Problem

The `/api/admin/users` endpoint returns `AdminUserListItem` which **does NOT include the `specialty` field**. This forces the frontend to make **N+1 HTTP requests** (1 for the list + 1 for each user's details) to display specializations, which is extremely inefficient.

**Current workaround:** The frontend fetches details for each doctor individually, causing:

- ❌ Poor performance (5 doctors = 6 HTTP requests)
- ❌ Slow page load
- ❌ High server load

### Solution Required

Add `specialty` field to the list response:

```java
// In your UserDTO or AdminUserListItem response
public class AdminUserListItem {
    private String id;
    private String fullName;
    private String email;
    private UserRole role;
    private boolean active;
    private AuthProvider provider;
    private String createdAt;

    // ✅ ADD THIS FIELD
    private String specialty; // For MEDECIN role only
}
```

Update the mapping in your `UserService` or controller to include `specialty` when returning the list.

**Priority:** HIGH - Performance issue

---

## 🚨 NEW: Endpoints Required for Medecin Dashboard & Disponibilités

### 1. Medecin Stats Endpoint

**Endpoint:** `GET /api/medecin/stats`

**Response:**

```json
{
  "totalPatients": 45,
  "rendezVousAujourdhui": 8,
  "rendezVousSemaine": 32,
  "tauxPresence": 87,
  "tempsMoyenConsultation": 23,
  "prochainsRendezVous": 5
}
```

### 2. Medecin Rendez-vous Today

**Endpoint:** `GET /api/medecin/rendez-vous?date=2025-11-14`

**Response:**

```json
[
  {
    "id": "rdv123",
    "patientId": "patient456",
    "patientName": "Marie Dupont",
    "medecinId": "medecin789",
    "date": "2025-11-14T09:30:00.000Z",
    "heureDebut": "2025-11-14T09:30:00.000Z",
    "heureFin": "2025-11-14T10:00:00.000Z",
    "statut": "CONFIRME",
    "motif": "Consultation de suivi",
    "notes": "",
    "createdAt": "2025-11-10T12:00:00.000Z"
  }
]
```

### 3. Disponibilités CRUD

**List:** `GET /api/medecin/disponibilites?medecinId=xxx&dateDebut=2025-11-14&dateFin=2025-11-21`

**Response:**

```json
{
  "content": [
    {
      "id": "691075d9e9e20b3e061e31c9",
      "date": "2025-11-14T23:00:00.000Z",
      "heureDebut": "2025-11-09T07:30:00.000Z",
      "heureFin": "2025-11-09T11:00:00.000Z",
      "actif": true,
      "recurrence": "HEBDOMADAIRE",
      "commentaire": "Consultations du matin"
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

**Create:** `POST /api/medecin/disponibilites`

**Body:**

```json
{
  "date": "2025-11-14T00:00:00.000Z",
  "heureDebut": "2025-11-14T09:00:00.000Z",
  "heureFin": "2025-11-14T17:00:00.000Z",
  "recurrence": "HEBDOMADAIRE",
  "commentaire": "Consultations lundi",
  "actif": true
}
```

**Update:** `PATCH /api/medecin/disponibilites/{id}`

**Delete:** `DELETE /api/medecin/disponibilites/{id}`

**Activate:** `POST /api/medecin/disponibilites/{id}/activate`

**Deactivate:** `POST /api/medecin/disponibilites/{id}/deactivate`

### 4. MongoDB Schema for Disponibilite

```java
@Document(collection = "disponibilites")
public class Disponibilite {
    @Id
    private String id;

    private String medecinId; // Reference to User with role MEDECIN
    private Date date;
    private Date heureDebut;
    private Date heureFin;
    private boolean actif = true;

    @Enumerated(EnumType.STRING)
    private RecurrenceType recurrence = RecurrenceType.AUCUNE;

    private String commentaire;

    private Date createdAt;
    private Date updatedAt;
    private int version = 0;
}

public enum RecurrenceType {
    AUCUNE,
    HEBDOMADAIRE,
    MENSUELLE
}
```

**Priority:** HIGH - Required for medecin features

---

## Problem: Missing User Fields in Creation

The frontend is sending `gender`, `dateOfBirth`, and `address` fields when creating users, but they are not being saved to MongoDB.

## Solution

Update your Java/Spring Boot backend to handle these fields:

### 1. Update User Entity (`User.java`)

```java
@Document(collection = "users")
public class User {
    // ... existing fields

    private String gender; // MALE, FEMALE, OTHER
    private String dateOfBirth; // ISO date format: "2000-01-15"

    // ... getters and setters
}
```

### 2. Update CreateUserRequest DTO

```java
public class CreateUserRequest {
    // ... existing fields

    private String gender;
    private String dateOfBirth;

    // ... getters and setters
}
```

### 3. Update UserService to map these fields

```java
public User createUser(CreateUserRequest request) {
    User user = new User();
    // ... existing mappings

    user.setGender(request.getGender());
    user.setDateOfBirth(request.getDateOfBirth());

    // ... save user
    return userRepository.save(user);
}
```

### 4. Update UserResponse DTO

```java
public class UserResponse {
    // ... existing fields

    private String gender;
    private String dateOfBirth;

    // ... getters and setters
}
```

## Fields Being Sent from Frontend

### For MEDECIN:

- specialty
- licenseNumber

### For PATIENT:

- gender (MALE/FEMALE/OTHER)
- dateOfBirth (ISO date string)
- address.line1 (string)
- insuranceNumber

## Test

After updating the backend:

1. Restart your Spring Boot application
2. Create a new PATIENT user with all fields filled
3. Click "Voir" to view the user details
4. Verify all fields (gender, date of birth, address) are displayed
