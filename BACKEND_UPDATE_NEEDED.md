# Backend Update Required

## Problem

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
