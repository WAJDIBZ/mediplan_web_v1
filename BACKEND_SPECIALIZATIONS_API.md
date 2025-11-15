# Backend - Endpoints à Implémenter pour les Spécialisations

## 📋 Vue d'ensemble

Le frontend a été développé pour gérer les spécialisations médicales, mais le backend doit implémenter ces endpoints pour que la fonctionnalité soit complète.

## 🔧 Endpoints Requis

### 1. GET `/api/admin/specialisations`

**Description:** Lister toutes les spécialisations (paginé)

**Rôle requis:** `ADMIN`

**Query Parameters:**
| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `q` | `string` | Recherche par nom | `?q=cardio` |
| `active` | `boolean` | Filtre par statut | `?active=true` |
| `page` | `number` | Numéro de page (0-based) | `?page=0` |
| `size` | `number` | Taille de page | `?size=20` |
| `sort` | `string` | Tri `field,(asc\|desc)` | `?sort=name,asc` |

**Réponse 200:**

```json
{
  "content": [
    {
      "id": "65f123abc...",
      "name": "Cardiologie",
      "description": "Spécialité médicale qui traite les maladies cardiovasculaires",
      "active": true,
      "doctorCount": 12,
      "createdAt": "2024-11-01T10:00:00Z",
      "updatedAt": "2024-11-10T15:30:00Z"
    },
    {
      "id": "65f124def...",
      "name": "Dermatologie",
      "description": "Spécialité médicale qui traite les maladies de la peau",
      "active": true,
      "doctorCount": 8,
      "createdAt": "2024-11-02T11:00:00Z",
      "updatedAt": null
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 25,
  "totalPages": 2,
  "last": false,
  "first": true,
  "numberOfElements": 20,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "empty": false
}
```

**Erreurs:**

- `401` - Non authentifié
- `403` - Rôle insuffisant (pas ADMIN)
- `422` - Champ de tri invalide

---

### 2. GET `/api/admin/specialisations/{id}`

**Description:** Obtenir les détails d'une spécialisation

**Rôle requis:** `ADMIN`

**Path Parameters:**

- `id` - Identifiant de la spécialisation

**Réponse 200:**

```json
{
  "id": "65f123abc...",
  "name": "Cardiologie",
  "description": "Spécialité médicale qui traite les maladies cardiovasculaires",
  "active": true,
  "doctorCount": 12,
  "createdAt": "2024-11-01T10:00:00Z",
  "updatedAt": "2024-11-10T15:30:00Z"
}
```

**Erreurs:**

- `401` - Non authentifié
- `403` - Rôle insuffisant
- `404` - Spécialisation introuvable

---

### 3. POST `/api/admin/specialisations`

**Description:** Créer une nouvelle spécialisation

**Rôle requis:** `ADMIN`

**Body (JSON):**

```json
{
  "name": "Cardiologie",
  "description": "Spécialité médicale qui traite les maladies cardiovasculaires",
  "active": true
}
```

**Validation:**

- `name` : **requis**, 2-100 caractères, unique (case insensitive)
- `description` : optionnel, max 500 caractères
- `active` : optionnel, défaut `true`

**Réponse 201:**

```json
{
  "id": "65f123abc...",
  "name": "Cardiologie",
  "description": "Spécialité médicale qui traite les maladies cardiovasculaires",
  "active": true,
  "doctorCount": 0,
  "createdAt": "2024-11-13T10:30:00Z",
  "updatedAt": null
}
```

**Erreurs:**

- `400` - Validation échouée
- `401` - Non authentifié
- `403` - Rôle insuffisant
- `409` - Nom déjà existant

**Exemple curl:**

```bash
curl -X POST \
  "https://mediplan-api-1b2c88de81dd.herokuapp.com/api/admin/specialisations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cardiologie",
    "description": "Spécialité médicale qui traite les maladies cardiovasculaires",
    "active": true
  }'
```

---

### 4. PATCH `/api/admin/specialisations/{id}`

**Description:** Mettre à jour une spécialisation

**Rôle requis:** `ADMIN`

**Path Parameters:**

- `id` - Identifiant de la spécialisation

**Body (JSON - tous les champs optionnels):**

```json
{
  "name": "Cardiologie Interventionnelle",
  "description": "Spécialité médicale avancée des maladies cardiovasculaires",
  "active": true
}
```

**Réponse 200:**

```json
{
  "id": "65f123abc...",
  "name": "Cardiologie Interventionnelle",
  "description": "Spécialité médicale avancée des maladies cardiovasculaires",
  "active": true,
  "doctorCount": 12,
  "createdAt": "2024-11-01T10:00:00Z",
  "updatedAt": "2024-11-13T11:00:00Z"
}
```

**Erreurs:**

- `400` - Validation échouée
- `401` - Non authentifié
- `403` - Rôle insuffisant
- `404` - Spécialisation introuvable
- `409` - Nouveau nom déjà existant

---

### 5. DELETE `/api/admin/specialisations/{id}`

**Description:** Supprimer une spécialisation (soft delete par défaut)

**Rôle requis:** `ADMIN`

**Path Parameters:**

- `id` - Identifiant de la spécialisation

**Query Parameters:**

- `hard` (optionnel) - `true` pour suppression définitive, `false` (défaut) pour soft delete

**Réponse 204:** Sans contenu

**Erreurs:**

- `401` - Non authentifié
- `403` - Rôle insuffisant
- `404` - Spécialisation introuvable (uniquement si `hard=true`)
- `422` - Impossible de supprimer (médecins associés)

**Note:** Le soft delete devrait marquer `active=false` au lieu de supprimer la ligne.

**Exemple curl:**

```bash
# Soft delete
curl -X DELETE \
  "https://mediplan-api-1b2c88de81dd.herokuapp.com/api/admin/specialisations/65f123abc" \
  -H "Authorization: Bearer $TOKEN"

# Hard delete
curl -X DELETE \
  "https://mediplan-api-1b2c88de81dd.herokuapp.com/api/admin/specialisations/65f123abc?hard=true" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. POST `/api/admin/specialisations/{id}/deactivate`

**Description:** Désactiver une spécialisation

**Rôle requis:** `ADMIN`

**Path Parameters:**

- `id` - Identifiant de la spécialisation

**Body:** `{}` (vide)

**Réponse 204:** Sans contenu

**Erreurs:**

- `401` - Non authentifié
- `403` - Rôle insuffisant
- `404` - Spécialisation introuvable

**Note:** Cette action est idempotente. Désactiver une spécialisation déjà inactive ne génère pas d'erreur.

---

### 7. POST `/api/admin/specialisations/{id}/reactivate`

**Description:** Réactiver une spécialisation

**Rôle requis:** `ADMIN`

**Path Parameters:**

- `id` - Identifiant de la spécialisation

**Body:** `{}` (vide)

**Réponse 204:** Sans contenu

**Erreurs:**

- `401` - Non authentifié
- `403` - Rôle insuffisant
- `404` - Spécialisation introuvable

**Note:** Cette action est idempotente. Réactiver une spécialisation déjà active ne génère pas d'erreur.

---

### 8. POST `/api/admin/specialisations/bulk/delete`

**Description:** Supprimer plusieurs spécialisations en masse

**Rôle requis:** `ADMIN`

**Body (JSON):**

```json
{
  "ids": ["65f123abc...", "65f124def...", "65f125ghi..."]
}
```

**Réponse 204:** Sans contenu

**Erreurs:**

- `400` - Liste d'IDs invalide
- `401` - Non authentifié
- `403` - Rôle insuffisant

**Note:** Les IDs inexistants sont ignorés silencieusement. Seuls les IDs valides sont supprimés (soft delete).

---

## 🗄️ Modèle de Données Suggéré

### Entité Specialization (MongoDB)

```java
@Document(collection = "specializations")
public class Specialization {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String description;

    private Boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Getters, Setters, Constructors
}
```

### DTO Response

```java
public class SpecializationResponse {
    private String id;
    private String name;
    private String description;
    private Boolean active;
    private Integer doctorCount; // Calculé via count des médecins
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters, Setters
}
```

### DTO Request (Create)

```java
public class CreateSpecializationRequest {
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String name;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    private String description;

    private Boolean active = true;

    // Getters, Setters
}
```

### DTO Request (Update)

```java
public class UpdateSpecializationRequest {
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String name;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    private String description;

    private Boolean active;

    // Getters, Setters
}
```

---

## 🔧 Logique Métier Importante

### 1. Calcul de `doctorCount`

Le champ `doctorCount` doit être calculé dynamiquement:

```java
public Integer getDoctorCount(String specializationId) {
    return medecinRepository.countBySpecialty(specializationId);
}
```

### 2. Validation du nom unique

Lors de la création/modification, vérifier que le nom n'existe pas déjà (case insensitive):

```java
public boolean existsByNameIgnoreCase(String name, String excludeId) {
    if (excludeId != null) {
        return specializationRepository
            .findByNameIgnoreCaseAndIdNot(name, excludeId)
            .isPresent();
    }
    return specializationRepository
        .findByNameIgnoreCase(name)
        .isPresent();
}
```

### 3. Vérification avant suppression

Avant de supprimer (hard delete), vérifier qu'aucun médecin n'utilise cette spécialité:

```java
public void deleteSpecialization(String id, boolean hard) {
    if (hard) {
        long count = medecinRepository.countBySpecialty(id);
        if (count > 0) {
            throw new BusinessException(
                "Impossible de supprimer cette spécialisation car " +
                count + " médecin(s) l'utilisent encore"
            );
        }
        specializationRepository.deleteById(id);
    } else {
        // Soft delete
        Specialization spec = findById(id);
        spec.setActive(false);
        spec.setUpdatedAt(LocalDateTime.now());
        specializationRepository.save(spec);
    }
}
```

### 4. Recherche full-text

La recherche par `q` devrait chercher dans `name` ET `description`:

```java
@Query("{ $or: [ " +
    "{ 'name': { $regex: ?0, $options: 'i' } }, " +
    "{ 'description': { $regex: ?0, $options: 'i' } } " +
    "] }")
Page<Specialization> searchByQuery(String query, Pageable pageable);
```

---

## 🔒 Sécurité

### Annotations Spring Security

```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/api/admin/specialisations")
public ResponseEntity<Page<SpecializationResponse>> list(...) {
    // ...
}
```

### Validation des permissions

Tous ces endpoints doivent:

1. Vérifier que l'utilisateur est authentifié (JWT valide)
2. Vérifier que l'utilisateur a le rôle `ADMIN`
3. Vérifier que le compte est actif (`active=true`)

---

## 📝 Exemple d'Implémentation (Controller)

```java
@RestController
@RequestMapping("/api/admin/specialisations")
@RequiredArgsConstructor
public class SpecializationController {

    private final SpecializationService specializationService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<SpecializationResponse>> list(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) Boolean active,
        @PageableDefault(size = 20, sort = "name") Pageable pageable
    ) {
        Page<SpecializationResponse> result = specializationService.findAll(q, active, pageable);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<SpecializationResponse> getById(@PathVariable String id) {
        SpecializationResponse result = specializationService.findById(id);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<SpecializationResponse> create(
        @Valid @RequestBody CreateSpecializationRequest request
    ) {
        SpecializationResponse result = specializationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<SpecializationResponse> update(
        @PathVariable String id,
        @Valid @RequestBody UpdateSpecializationRequest request
    ) {
        SpecializationResponse result = specializationService.update(id, request);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable String id,
        @RequestParam(defaultValue = "false") boolean hard
    ) {
        specializationService.delete(id, hard);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable String id) {
        specializationService.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reactivate")
    public ResponseEntity<Void> reactivate(@PathVariable String id) {
        specializationService.reactivate(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk/delete")
    public ResponseEntity<Void> bulkDelete(@RequestBody BulkDeleteRequest request) {
        specializationService.bulkDelete(request.getIds());
        return ResponseEntity.noContent().build();
    }
}
```

---

## ✅ Checklist d'Implémentation

- [ ] Créer l'entité `Specialization` dans MongoDB
- [ ] Créer le repository `SpecializationRepository`
- [ ] Créer les DTOs (Request, Response)
- [ ] Créer le service `SpecializationService`
- [ ] Créer le controller `SpecializationController`
- [ ] Ajouter les validations (Bean Validation)
- [ ] Ajouter la sécurité (`@PreAuthorize`)
- [ ] Implémenter la recherche full-text
- [ ] Implémenter le calcul de `doctorCount`
- [ ] Tester tous les endpoints avec Postman
- [ ] Gérer les erreurs (404, 409, 422)
- [ ] Ajouter les logs (création, modification, suppression)
- [ ] Tester l'intégration avec le frontend

---

## 🧪 Tests Recommandés

```bash
# 1. Créer une spécialisation
curl -X POST "http://localhost:8080/api/admin/specialisations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Cardio","description":"Test","active":true}'

# 2. Lister
curl "http://localhost:8080/api/admin/specialisations?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"

# 3. Modifier
curl -X PATCH "http://localhost:8080/api/admin/specialisations/ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cardiologie Modifiée"}'

# 4. Désactiver
curl -X POST "http://localhost:8080/api/admin/specialisations/ID/deactivate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# 5. Supprimer
curl -X DELETE "http://localhost:8080/api/admin/specialisations/ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

**Date:** 13 Novembre 2025  
**Version:** 1.0  
**Status:** 📋 Spécification complète - En attente d'implémentation backend
