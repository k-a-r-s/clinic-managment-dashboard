# Patients API Endpoints

## Base URL
```
/patients
```

**Authentication:** All endpoints require Bearer token

---

## 1. Create Patient

**Endpoint:** `POST /patients`

**Description:** Create a new patient record

**Authentication:** Required

**Required Role:** `admin`, `receptionist`

### Request Body
```typescript
{
  firstName: string;              // Required
  lastName: string;               // Required
  email: string;                  // Required, valid email
  phoneNumber: string;            // Required
  birthDate: string;              // Required, format: YYYY-MM-DD
  gender: string;                 // Required
  address: string;                // Required
  profession: string;             // Required
  childrenNumber: number;         // Required, >= 0
  familySituation: string;        // Required
  insuranceNumber: string;        // Required
  emergencyContactName: string;   // Required
  emergencyContactPhone: string;  // Required
  allergies?: string[];           // Optional
  currentMedications?: string[];  // Optional
}
```

**Example Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phoneNumber": "+1234567890",
  "birthDate": "1990-05-15",
  "gender": "Male",
  "address": "123 Main St, City, Country",
  "profession": "Engineer",
  "childrenNumber": 2,
  "familySituation": "Married",
  "insuranceNumber": "INS123456789",
  "emergencyContactName": "Jane Smith",
  "emergencyContactPhone": "+1234567891",
  "allergies": ["Penicillin", "Peanuts"],
  "currentMedications": ["Aspirin"]
}
```

### Response

**Success (201):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;                     // UUID
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;              // ISO 8601 date
    gender: string;
    address: string;
    profession: string;
    childrenNumber: number;
    familySituation: string;
    insuranceNumber: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    allergies: string[] | null;
    currentMedications: string[] | null;
    createdAt: string;              // ISO 8601 date-time
    updatedAt: string;              // ISO 8601 date-time
  };
  error: null;
}
```

---

## 2. Get All Patients

**Endpoint:** `GET /patients`

**Description:** Retrieve a paginated list of all patients

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### Query Parameters
```typescript
{
  page?: number;    // Default: 1
  limit?: number;   // Default: 10
}
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    patients: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      birthDate: string;
      gender: string;
      address: string;
      profession: string;
      childrenNumber: number;
      familySituation: string;
      insuranceNumber: string;
      emergencyContactName: string;
      emergencyContactPhone: string;
      allergies: string[] | null;
      currentMedications: string[] | null;
      createdAt: string;
      updatedAt: string;
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

---

## 3. Get Patient by ID

**Endpoint:** `GET /patients/:id`

**Description:** Retrieve a specific patient by their ID

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

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
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
    address: string;
    profession: string;
    childrenNumber: number;
    familySituation: string;
    insuranceNumber: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    allergies: string[] | null;
    currentMedications: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
  error: null;
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Patient not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Patient not found",
    "statusCode": 404
  }
}
```

---

## 4. Update Patient

**Endpoint:** `PATCH /patients/:id`

**Description:** Update patient information

**Authentication:** Required

**Required Role:** `admin`, `receptionist`

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
  phoneNumber?: string;
  birthDate?: string;              // Format: YYYY-MM-DD
  gender?: string;
  address?: string;
  profession?: string;
  childrenNumber?: number;
  familySituation?: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  currentMedications?: string[];
}
```

**Example Request:**
```json
{
  "phoneNumber": "+1234567899",
  "address": "456 New St, City, Country",
  "allergies": ["Penicillin", "Peanuts", "Shellfish"]
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
    phoneNumber: string;
    birthDate: string;
    gender: string;
    address: string;
    profession: string;
    childrenNumber: number;
    familySituation: string;
    insuranceNumber: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    allergies: string[] | null;
    currentMedications: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
  error: null;
}
```

---

## 5. Delete Patient

**Endpoint:** `DELETE /patients/:id`

**Description:** Permanently delete a patient from the system

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
  "message": "Patient deleted successfully",
  "data": null,
  "error": null
}
```

---

## Field Validations

### Create Patient DTO
- `firstName`: Required, min 1 character
- `lastName`: Required, min 1 character
- `email`: Required, valid email format
- `phoneNumber`: Required
- `birthDate`: Required, format YYYY-MM-DD
- `gender`: Required
- `address`: Required
- `profession`: Required
- `childrenNumber`: Required, integer >= 0
- `familySituation`: Required
- `insuranceNumber`: Required
- `emergencyContactName`: Required
- `emergencyContactPhone`: Required
- `allergies`: Optional array of strings
- `currentMedications`: Optional array of strings

### Update Patient DTO
- All fields are optional
- Same validation rules apply when provided

---

## Authorization

| Endpoint | Allowed Roles |
|----------|---------------|
| POST /patients | admin, receptionist |
| GET /patients | admin, doctor, receptionist |
| GET /patients/:id | admin, doctor, receptionist |
| PATCH /patients/:id | admin, receptionist |
| DELETE /patients/:id | admin |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Patient not found |
| 500 | Internal server error |
