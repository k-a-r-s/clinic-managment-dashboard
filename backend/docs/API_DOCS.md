# Authentication API Documentation

## Base URL

```
http://localhost:3000
```

---

## 1. Login

**Endpoint:** `POST /auth/login`

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
  "success": true,
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "doctor"
    }
  },
  "error": null
}
```

**Set-Cookie Header:**

```
Set-Cookie: refreshToken=sbr_1234567890abcdef; Path=/api/auth/refresh-token; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

> [!IMPORTANT]
> The refresh token is **NOT** returned in the response body. It is stored in a secure HTTP-only cookie that is automatically sent with subsequent requests to `/auth/refresh-token`.

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid login credentials"
  }
}
```

---

## 2. Create User

**Endpoint:** `POST /users/add-user`

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

**Valid Roles:**

- `doctor`
- `receptionist`

**Response (201 Created):**

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "doctor"
  },
  "error": null
}
```

**Error (400):**

```json
{
  "success": false,
  "status": 400,
  "data": null,
  "error": {
    "type": "ValidationError",
    "message": "Email already exists"
  }
}
```

**Error (403):**

```json
{
  "success": false,
  "status": 403,
  "data": null,
  "error": {
    "message": "Access denied. Required roles: admin"
  }
}
```

---

## 3. Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Description:** Get a new access token using the refresh token stored in HTTP-only cookie

**Authentication:** Not required (uses cookie)

**Request Body:** Empty (refresh token is read from cookie)

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  },
  "error": null
}
```

**Set-Cookie Header:**

```
Set-Cookie: refreshToken=sbr_new_token; Path=/api/auth/refresh-token; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

> [!IMPORTANT]
> The new refresh token is **NOT** returned in the response body. It is automatically rotated and stored in a new secure HTTP-only cookie.

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Refresh token not found"
  }
}
```

_OR_

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid or expired refresh token"
  }
}
```

---

## 4. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user and invalidate session

**Authentication:** Required (Bearer token)

**Request Body:** Empty

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "message": "Logged out successfully"
  },
  "error": null
}
```

**Set-Cookie Header:**

```
Set-Cookie: refreshToken=; Path=/api/auth/refresh-token; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

> [!NOTE]
> The logout endpoint clears the refresh token cookie by setting its expiration date to the past.

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid or expired token"
  }
}
```

---

## 5. Get Current User (Me)

**Endpoint:** `POST /auth/me`

**Description:** Retrieve the authenticated user's profile information

**Authentication:** Required (Bearer token)

**Request Body:** Empty

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "doctor"
  },
  "error": null
}
```

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid or expired token"
  }
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
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request / Validation Error       |
| 401  | Unauthorized / Invalid Token         |
| 403  | Forbidden / Insufficient Permissions |
| 500  | Internal Server Error                |

---

## Common Errors

| Error                        | Cause                                   | Solution                   |
| ---------------------------- | --------------------------------------- | -------------------------- |
| Invalid login credentials    | Wrong email/password                    | Verify credentials         |
| Invalid or expired token     | Token expired                           | Use refresh token endpoint |
| Only admins can create users | Non-admin trying to create user         | Use admin account          |
| Validation failed            | Missing/invalid fields                  | Check request body format  |
| User profile not found       | User exists in auth but not in database | Contact admin              |

---

## 6. Cookie Security

### Refresh Token Storage

Refresh tokens are stored in **secure HTTP-only cookies** for enhanced security:

| Property   | Value                     | Purpose                                                    |
| ---------- | ------------------------- | ---------------------------------------------------------- |
| `httpOnly` | `true`                    | Prevents JavaScript access, protecting against XSS attacks |
| `secure`   | `true` (in production)    | Ensures cookie is only sent over HTTPS                     |
| `sameSite` | `strict`                  | Prevents CSRF attacks by restricting cross-site requests   |
| `maxAge`   | `604800000` (7 days)      | Cookie expires after 7 days                                |
| `path`     | `/api/auth/refresh-token` | Cookie is only sent to the refresh token endpoint          |

### Security Benefits

- **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript, preventing token theft via XSS attacks
- **CSRF Protection**: SameSite=Strict prevents the cookie from being sent in cross-site requests
- **Automatic Token Rotation**: Each refresh generates a new refresh token, limiting the window of vulnerability
- **Reduced Attack Surface**: Refresh tokens are never exposed in response bodies or client-side storage

### Client Implementation Notes

- No need to manually store or send refresh tokens
- Cookies are automatically included in requests to `/api/auth/refresh-token`
- Ensure your HTTP client is configured to handle cookies (e.g., `credentials: 'include'` in fetch API)

---

## 7. Doctors API

### 7.1 Get All Doctors

**Endpoint:** `GET /doctors`

**Description:** Retrieve a paginated list of doctors

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "doctors": [
      {
        "id": "uuid-here",
        "firstName": "Gregory",
        "lastName": "House",
        "email": "house@princeton.edu",
        "specialization": "Diagnostician",
        "role": "DOCTOR"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "error": null
}
```

### 7.2 Get Doctor by ID

**Endpoint:** `GET /doctors/:id`

**Description:** Retrieve a specific doctor's details

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "uuid-here",
    "firstName": "Gregory",
    "lastName": "House",
    "email": "house@princeton.edu",
    "specialization": "Diagnostician",
    "role": "DOCTOR",
    "salary": 250000,
    "isMedicalDirector": true
  },
  "error": null
}
```

### 7.3 Update Doctor

**Endpoint:** `PUT /doctors/:id`

**Description:** Update doctor details (Admin only)

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Path Parameters:**

- `id` (required): UUID of the doctor

**Request Body:**

```json
{
  "specialization": "Cardiology",
  "salary": 150000,
  "isMedicalDirector": false
}
```

**Field Validations:**

| Field               | Type    | Required | Description                              |
| ------------------- | ------- | -------- | ---------------------------------------- |
| `specialization`    | string  | No       | The specialization of the doctor         |
| `salary`            | number  | No       | The salary of the doctor                 |
| `isMedicalDirector` | boolean | No       | Whether the doctor is a medical director |

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "uuid-here",
    "firstName": "Gregory",
    "lastName": "House",
    "email": "house@princeton.edu",
    "specialization": "Cardiology",
    "role": "DOCTOR",
    "salary": 150000,
    "isMedicalDirector": false
  },
  "error": null
}
```

**Error (404):**

```json
{
  "success": false,
  "status": 404,
  "data": null,
  "error": {
    "type": "NotFoundError",
    "message": "Doctor not found"
  }
}
```

**Error (400):**

```json
{
  "success": false,
  "status": 400,
  "data": null,
  "error": {
    "type": "ValidationError",
    "message": "Invalid field values"
  }
}
```

### 7.4 Delete Doctor

**Endpoint:** `DELETE /doctors/:id`

**Description:** Delete a doctor by ID (Admin only)

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": null,
  "error": null
}
```

**Error (404):**

```json
{
  "success": false,
  "status": 404,
  "data": null,
  "error": {
    "type": "NotFoundError",
    "message": "Doctor not found"
  }
}
```

---

## 8. Patients API

### 8.1 Create Patient

**Endpoint:** `POST /patients/add-patient`

**Description:** Create a new patient profile (Admin or Receptionist only)

**Authentication:** Required (Bearer token)

**Authorization:** Admin or Receptionist role required

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1-555-123-4567",
  "birthDate": "1985-03-15",
  "gender": "Male",
  "address": "123 Main St",
  "profession": "Engineer",
  "childrenNumber": 2,
  "familySituation": "Married",
  "insuranceNumber": "INS-123456789",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1-555-987-6543",
  "allergies": ["Penicillin"],
  "currentMedications": ["Lisinopril 10mg"]
}
```

**Field Validations:**

| Field                   | Type     | Required | Validation          |
| ----------------------- | -------- | -------- | ------------------- |
| `firstName`             | string   | Yes      | Minimum 1 character |
| `lastName`              | string   | Yes      | Minimum 1 character |
| `email`                 | string   | Yes      | Valid email format  |
| `phoneNumber`           | string   | Yes      | Minimum 1 character |
| `birthDate`             | string   | Yes      | Format: YYYY-MM-DD  |
| `gender`                | string   | Yes      | Minimum 1 character |
| `address`               | string   | Yes      | Minimum 1 character |
| `profession`            | string   | Yes      | Minimum 1 character |
| `childrenNumber`        | integer  | Yes      | Minimum 0           |
| `familySituation`       | string   | Yes      | Minimum 1 character |
| `insuranceNumber`       | string   | Yes      | Minimum 1 character |
| `emergencyContactName`  | string   | Yes      | Minimum 1 character |
| `emergencyContactPhone` | string   | Yes      | Minimum 1 character |
| `allergies`             | string[] | No       | Array of strings    |
| `currentMedications`    | string[] | No       | Array of strings    |

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-123-4567",
    "birthDate": "1985-03-15",
    "gender": "Male",
    "address": "123 Main St",
    "profession": "Engineer",
    "childrenNumber": 2,
    "familySituation": "Married",
    "insuranceNumber": "INS-123456789",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1-555-987-6543",
    "allergies": ["Penicillin"],
    "currentMedications": ["Lisinopril 10mg"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "error": null
}
```

**Error (400):**

```json
{
  "success": false,
  "status": 400,
  "data": null,
  "error": {
    "type": "ValidationError",
    "message": "firstName: First name is required; email: Invalid email address",
    "context": {
      "userMessage": "There was a validation error. Please check your input and try again.",
      "statusCode": 400
    }
  }
}
```

### 8.2 Get All Patients

**Endpoint:** `GET /patients`

**Description:** Retrieve a list of all patients

**Authentication:** Required (Bearer token)

**Authorization:** Admin or Receptionist role required

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1-555-123-4567",
      "birthDate": "1985-03-15",
      "gender": "Male",
      "address": "123 Main St",
      "profession": "Engineer",
      "childrenNumber": 2,
      "familySituation": "Married",
      "insuranceNumber": "INS-123456789",
      "emergencyContactName": "Jane Doe",
      "emergencyContactPhone": "+1-555-987-6543",
      "allergies": ["Penicillin"],
      "currentMedications": ["Lisinopril 10mg"]
    }
  ],
  "error": null
}
```

### 8.3 Get Patient by ID

**Endpoint:** `GET /patients/:id`

**Description:** Retrieve a specific patient's details

**Authentication:** Required (Bearer token)

**Authorization:** Admin or Receptionist role required

**Path Parameters:**

- `id` (required): UUID of the patient

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-123-4567",
    "birthDate": "1985-03-15",
    "gender": "Male",
    "address": "123 Main St",
    "profession": "Engineer",
    "childrenNumber": 2,
    "familySituation": "Married",
    "insuranceNumber": "INS-123456789",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1-555-987-6543",
    "allergies": ["Penicillin"],
    "currentMedications": ["Lisinopril 10mg"]
  },
  "error": null
}
```

**Error (404):**

```json
{
  "success": false,
  "status": 404,
  "data": null,
  "error": {
    "type": "NotFoundError",
    "message": "Patient not found"
  }
}
```

### 8.4 Delete Patient

**Endpoint:** `DELETE /patients/:id`

**Description:** Delete a patient by ID (Admin or Receptionist only)

**Authentication:** Required (Bearer token)

**Authorization:** Admin or Receptionist role required

**Path Parameters:**

- `id` (required): UUID of the patient

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": null,
  "error": null
}
```

**Error (404):**

```json
{
  "success": false,
  "status": 404,
  "data": null,
  "error": {
    "type": "NotFoundError",
    "message": "Patient not found"
  }
}
```

---

## 9. Example cURL Commands

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create User

```bash
curl -X POST http://localhost:3000/users/add-user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "doctor"
  }'
```

### Create Patient

```bash
curl -X POST http://localhost:3000/patients/add-patient \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-123-4567",
    "birthDate": "1985-03-15",
    "gender": "Male",
    "address": "123 Main St",
    "profession": "Engineer",
    "childrenNumber": 2,
    "familySituation": "Married",
    "insuranceNumber": "INS-123456789",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1-555-987-6543",
    "allergies": ["Penicillin"],
    "currentMedications": ["Lisinopril 10mg"]
  }'
```

### Get All Patients

```bash
curl -X GET http://localhost:3000/patients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Patient by ID

```bash
curl -X GET http://localhost:3000/patients/c0b837f3-5a95-44b6-bb60-7aeccc4afe9f \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Patient

```bash
curl -X DELETE http://localhost:3000/patients/c0b837f3-5a95-44b6-bb60-7aeccc4afe9f \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Doctor

```bash
curl -X PUT http://localhost:3000/doctors/c0b837f3-5a95-44b6-bb60-7aeccc4afe9f \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specialization": "Cardiology",
    "salary": 150000,
    "isMedicalDirector": false
  }'
```

### Delete Doctor

```bash
curl -X DELETE http://localhost:3000/doctors/c0b837f3-5a95-44b6-bb60-7aeccc4afe9f \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
