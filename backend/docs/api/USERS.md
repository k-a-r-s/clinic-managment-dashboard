# Users API Endpoints

## Base URL
```
/users
```

**Authentication:** All endpoints require Bearer token

---

## 1. Create User

**Endpoint:** `POST /users/add-user`

**Description:** Create a new user (Doctor or Receptionist). Only admins can create users.

**Authentication:** Required

**Required Role:** `admin`

### Request Body
```typescript
{
  email: string;        // Required, valid email format
  password: string;     // Required, min 6 characters
  firstName: string;    // Required
  lastName: string;     // Required
  role: "doctor" | "receptionist";  // Required
}
```

**Example Request:**
```json
{
  "email": "doctor@clinic.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "doctor"
}
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;          // UUID
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;   // ISO 8601 date-time
    updatedAt: string;   // ISO 8601 date-time
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "doctor@clinic.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "doctor",
    "createdAt": "2024-12-11T10:00:00.000Z",
    "updatedAt": "2024-12-11T10:00:00.000Z"
  },
  "error": null
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": {
    "name": "ValidationError",
    "message": "Email already exists",
    "statusCode": 400
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Forbidden",
  "data": null,
  "error": {
    "name": "AuthError",
    "message": "Admin access required",
    "statusCode": 403
  }
}
```

---

## Field Validations

### Create User DTO
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `firstName`: Required, non-empty string
- `lastName`: Required, non-empty string
- `role`: Required, must be either "doctor" or "receptionist"

---

## Authorization

| Endpoint | Allowed Roles |
|----------|---------------|
| POST /users/add-user | admin |

---

## Notes

1. **Password Security:** Passwords are hashed before storage using bcrypt
2. **Email Uniqueness:** Email addresses must be unique across all users
3. **Role Restrictions:** Only "doctor" and "receptionist" roles can be created via this endpoint
4. **Admin Creation:** Admin users must be created directly in the database or via migration
5. **Default Values:** Created users are active by default

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Validation error or duplicate email |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Admin access required |
| 500 | Internal server error |
