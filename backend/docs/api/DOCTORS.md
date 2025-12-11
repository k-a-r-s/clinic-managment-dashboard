# Doctors API Endpoints

## Base URL
```
/doctors
```

**Authentication:** All endpoints require Bearer token

---

## 1. Get All Doctors

**Endpoint:** `GET /doctors`

**Description:** Retrieve a paginated list of all doctors

**Authentication:** Required

**Required Role:** Any authenticated user

### Query Parameters
```typescript
{
  page?: number;    // Default: 1
  limit?: number;   // Default: 10
}
```

**Example Request:**
```
GET /doctors?page=1&limit=10
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    doctors: Array<{
      id: string;                    // UUID
      firstName: string;
      lastName: string;
      email: string;
      role: string;                  // "DOCTOR"
      salary: number | null;
      isMedicalDirector: boolean;
      specialization: string | null;
      createdAt: string;             // ISO 8601 date-time
      updatedAt: string;             // ISO 8601 date-time
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    }
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Doctors retrieved successfully",
  "data": {
    "doctors": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "firstName": "Gregory",
        "lastName": "House",
        "email": "house@princeton.edu",
        "role": "DOCTOR",
        "salary": 250000,
        "isMedicalDirector": true,
        "specialization": "Diagnostician",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  },
  "error": null
}
```

---

## 2. Get Doctor by ID

**Endpoint:** `GET /doctors/:id`

**Description:** Retrieve a specific doctor by their ID

**Authentication:** Required

**Required Role:** Any authenticated user

### URL Parameters
```typescript
{
  id: string;  // UUID - Required
}
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;                    // UUID
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    salary: number | null;
    isMedicalDirector: boolean;
    specialization: string | null;
    createdAt: string;
    updatedAt: string;
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Doctor retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "Gregory",
    "lastName": "House",
    "email": "house@princeton.edu",
    "role": "DOCTOR",
    "salary": 250000,
    "isMedicalDirector": true,
    "specialization": "Diagnostician",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Doctor not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Doctor not found",
    "statusCode": 404
  }
}
```

---

## 3. Update Doctor

**Endpoint:** `PATCH /doctors/:id`

**Description:** Update doctor information

**Authentication:** Required

**Required Role:** `admin`

### URL Parameters
```typescript
{
  id: string;  // UUID - Required
}
```

### Request Body
```typescript
{
  firstName?: string;
  lastName?: string;
  email?: string;
  salary?: number | string;          // Accepts number or string (auto-converted)
  isMedicalDirector?: boolean;
  specialization?: string | null;
}
```

**Example Request:**
```json
{
  "firstName": "Gregory",
  "lastName": "House",
  "salary": 275000,
  "specialization": "Diagnostic Medicine",
  "isMedicalDirector": true
}
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    salary: number | null;
    isMedicalDirector: boolean;
    specialization: string | null;
    createdAt: string;
    updatedAt: string;
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Doctor updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "Gregory",
    "lastName": "House",
    "email": "house@princeton.edu",
    "role": "DOCTOR",
    "salary": 275000,
    "isMedicalDirector": true,
    "specialization": "Diagnostic Medicine",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-12-11T14:20:00.000Z"
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
    "message": "salary: Expected number, received string",
    "statusCode": 400
  }
}
```

---

## 4. Delete Doctor

**Endpoint:** `DELETE /doctors/:id`

**Description:** Permanently delete a doctor from the system

**Authentication:** Required

**Required Role:** `admin`

### URL Parameters
```typescript
{
  id: string;  // UUID - Required
}
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: null;
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Doctor deleted successfully",
  "data": null,
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Doctor not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Doctor not found",
    "statusCode": 404
  }
}
```

---

## Field Validations

### Update Doctor DTO
- `firstName`: Optional string
- `lastName`: Optional string
- `email`: Optional valid email
- `salary`: Optional positive number (accepts string, auto-converts to number)
- `isMedicalDirector`: Optional boolean
- `specialization`: Optional string or null

---

## Authorization

| Endpoint | Allowed Roles |
|----------|---------------|
| GET /doctors | All authenticated users |
| GET /doctors/:id | All authenticated users |
| PATCH /doctors/:id | admin |
| DELETE /doctors/:id | admin |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Doctor not found |
| 500 | Internal server error |
