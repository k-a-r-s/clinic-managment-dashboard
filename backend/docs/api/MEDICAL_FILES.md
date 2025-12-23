# Medical Files API Endpoints

## Base URL
```
/medical-files
```

**Authentication:** All endpoints require Bearer token

---

## 1. Create Medical File

**Endpoint:** `POST /medical-files`

**Description:** Create a new medical file for a patient

**Authentication:** Required

**Required Role:** `admin`, `doctor`

### Request Body
```typescript
{
  patientId: string;      // Required, UUID
  doctorId: string;       // Required, UUID
  data?: object;          // Optional, flexible medical data
}
```

**Example Request:**
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "doctorId": "987fcdeb-51a2-43f1-b9c8-123456789abc",
  "data": {
    "diagnosis": "Hypertension",
    "bloodPressure": "140/90",
    "medications": ["Lisinopril 10mg"],
    "notes": "Patient advised to reduce sodium intake"
  }
}
```

### Response

**Success (201):**
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
  "message": "Medical file created successfully",
  "data": null,
  "error": null
}
```

---

## 2. Get Medical File by Patient ID

**Endpoint:** `GET /medical-files/patient/:patientId`

**Description:** Retrieve the medical file for a specific patient

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### URL Parameters
```typescript
{
  patientId: string;  // UUID - Required
}
```

**Example Request:**
```
GET /medical-files/patient/123e4567-e89b-12d3-a456-426614174000
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;              // UUID
    doctorId: string;        // UUID
    data: object | null;     // Flexible medical data
    createdAt: string;       // ISO 8601 date-time
    updatedAt: string;       // ISO 8601 date-time
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Medical file retrieved successfully",
  "data": {
    "id": "abc12345-6789-def0-1234-567890abcdef",
    "doctorId": "987fcdeb-51a2-43f1-b9c8-123456789abc",
    "data": {
      "diagnosis": "Hypertension",
      "bloodPressure": "140/90",
      "medications": ["Lisinopril 10mg"],
      "notes": "Patient advised to reduce sodium intake"
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-12-11T14:30:00.000Z"
  },
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Medical file not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Medical file not found",
    "statusCode": 404
  }
}
```

---

## 3. Update Medical File

**Endpoint:** `PUT /medical-files/:id`

**Description:** Update an existing medical file

**Authentication:** Required

**Required Role:** `admin`, `doctor`

### URL Parameters
```typescript
{
  id: string;  // UUID - Required (medical file ID)
}
```

### Request Body
```typescript
{
  doctorId?: string;  // Optional, UUID
  data?: object;      // Optional, flexible medical data
}
```

**Example Request:**
```json
{
  "data": {
    "diagnosis": "Hypertension - Stage 2",
    "bloodPressure": "145/95",
    "medications": ["Lisinopril 20mg", "Amlodipine 5mg"],
    "notes": "Increased medication dosage. Follow-up in 2 weeks.",
    "labResults": {
      "date": "2024-12-11",
      "cholesterol": "220 mg/dL",
      "glucose": "105 mg/dL"
    }
  }
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
  "message": "Medical file updated successfully",
  "data": null,
  "error": null
}
```

---

## 4. Delete Medical File

**Endpoint:** `DELETE /medical-files/:id`

**Description:** Permanently delete a medical file

**Authentication:** Required

**Required Role:** `admin`

### URL Parameters
```typescript
{
  id: string;  // UUID - Required (medical file ID)
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
  "message": "Medical file deleted successfully",
  "data": null,
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Medical file not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Medical file not found",
    "statusCode": 404
  }
}
```

---

## Medical Data Structure

The `data` field is flexible and can contain any medical information. Common fields include:

```typescript
{
  diagnosis?: string;
  symptoms?: string[];
  medications?: string[];
  allergies?: string[];
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  notes?: string;
  labResults?: {
    date: string;
    [key: string]: any;
  };
  prescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  visitHistory?: Array<{
    date: string;
    reason: string;
    diagnosis: string;
    treatment: string;
  }>;
}
```

---

## Field Validations

### Create Medical File DTO
- `patientId`: Required, valid UUID
- `doctorId`: Required, valid UUID
- `data`: Optional, nullable JSON object

### Update Medical File DTO
- `doctorId`: Optional, valid UUID
- `data`: Optional, any valid JSON object

---

## Authorization

| Endpoint | Allowed Roles |
|----------|---------------|
| POST /medical-files | admin, doctor |
| GET /medical-files/patient/:patientId | admin, doctor, receptionist |
| PUT /medical-files/:id | admin, doctor |
| DELETE /medical-files/:id | admin |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Medical file not found |
| 500 | Internal server error |
