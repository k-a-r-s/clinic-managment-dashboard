# Authentication API Documentation

## Base URL
```
http://localhost:3000/api/auth
```

---

## 1. Login
**Endpoint:** `POST /login`

**Description:** Authenticate user with email and password

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "sbr_1234567890abcdef",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "doctor"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Invalid login credentials"
}
```

---

## 2. Create User
**Endpoint:** `POST /create-user`

**Description:** Create a new user (admin only)

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepass123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "doctor"
}
```

**Valid Roles:**
- `admin`
- `doctor`
- `receptionist`

**Response (201 Created):**
```json
{
  "status": 201,
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "doctor"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "Only admins can create users"
}
```

---

## 3. Refresh Token
**Endpoint:** `POST /refresh-token`

**Description:** Get a new access token using refresh token

**Authentication:** Not required

**Request Body:**
```json
{
  "refreshToken": "sbr_1234567890abcdef"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "sbr_new_token_here",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "doctor"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid or expired refresh token"
}
```

---

## 4. Logout
**Endpoint:** `POST /logout`

**Description:** Logout user and invalidate session

**Authentication:** Required (Bearer token)

**Request Body:** Empty

**Response (200 OK):**
```json
{
  "status": 200,
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

## Authentication Header Format

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Invalid Token |
| 403 | Forbidden / Insufficient Permissions |
| 500 | Internal Server Error |

---

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid login credentials | Wrong email/password | Verify credentials |
| Invalid or expired token | Token expired | Use refresh token endpoint |
| Only admins can create users | Non-admin trying to create user | Use admin account |
| Validation failed | Missing/invalid fields | Check request body format |
| User profile not found | User exists in auth but not in database | Contact admin |
