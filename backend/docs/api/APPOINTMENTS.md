# Appointments API Endpoints

## Base URL
```
/appointments
```

**Authentication:** All endpoints require Bearer token

---

## 1. Create Appointment

**Endpoint:** `POST /appointments`

**Description:** Create a new appointment

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### Request Body
```typescript
{
  patientId: string;           // Required, UUID
  doctorId: string;            // Required, UUID
  date: string;                // Required, ISO 8601 date-time
  reason: string;              // Required
  status?: string;             // Optional, default: "scheduled"
  notes?: string;              // Optional
  roomId?: string;             // Optional, UUID
}
```

**Example Request:**
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "doctorId": "987fcdeb-51a2-43f1-b9c8-123456789abc",
  "date": "2024-12-15T14:30:00.000Z",
  "reason": "Regular checkup",
  "status": "scheduled",
  "notes": "Patient requested afternoon slot",
  "roomId": "abc12345-6789-def0-1234-567890abcdef"
}
```

### Response

**Success (201):**
```typescript
{
  success: boolean;
  message: string;
  data: null; // The endpoint returns no entity; just confirmation message
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "id": "456def78-90ab-cdef-1234-567890abcdef",
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "doctorId": "987fcdeb-51a2-43f1-b9c8-123456789abc",
    "date": "2024-12-15T14:30:00.000Z",
    "reason": "Regular checkup",
    "status": "scheduled",
    "notes": "Patient requested afternoon slot",
    "roomId": "abc12345-6789-def0-1234-567890abcdef",
    "createdAt": "2024-12-11T10:00:00.000Z",
    "updatedAt": "2024-12-11T10:00:00.000Z"
  },
  "error": null
}
```

---

## 2. Get All Appointments

**Endpoint:** `GET /appointments`

**Description:** Retrieve all appointments with optional time-based and name-based filtering

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### Query Parameters
```typescript
{
  view?: "year" | "month" | "week" | "day" | "all";  // Optional, default: "month"
  date?: string;                                       // Optional, ISO 8601 date
  patientName?: string;                                // Optional, filter by patient name
  doctorName?: string;                                 // Optional, filter by doctor name
}
```

**Example Requests:**
```
GET /appointments?view=week&date=2024-12-11
GET /appointments?view=day&date=2024-12-15
GET /appointments?view=all&patientName=John
GET /appointments
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    reason: string;
    status: string;
    notes: string | null;
    roomId: string | null;
    createdByReceptionId: string | null; // UUID of receptionist who created (if any)
    createdByDoctorId: string | null; // UUID of doctor who created (if any)
    estimatedDurationInMinutes: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": "456def78-90ab-cdef-1234-567890abcdef",
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "doctorId": "987fcdeb-51a2-43f1-b9c8-123456789abc",
      "date": "2024-12-15T14:30:00.000Z",
      "reason": "Regular checkup",
      "status": "scheduled",
      "notes": "Patient requested afternoon slot",
      "roomId": "abc12345-6789-def0-1234-567890abcdef",
      "createdAt": "2024-12-11T10:00:00.000Z",
      "updatedAt": "2024-12-11T10:00:00.000Z"
    }
  ],
  "error": null
}
```

---

## 3. Get Appointment by ID

**Endpoint:** `GET /appointments/:appointmentId`

**Description:** Retrieve a specific appointment by its ID

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### URL Parameters
```typescript
{
  appointmentId: string;  // UUID - Required
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
    patientId: string;
    doctorId: string;
    date: string;
    reason: string;
    status: string;
    notes: string | null;
    roomId: string | null;
    createdAt: string;
    updatedAt: string;
    createdByReceptionId: string | null;
    createdByDoctorId: string | null;
    estimatedDurationInMinutes: number;
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Appointment retrieved successfully",
  "data": {
    "id": "456def78-90ab-cdef-1234-567890abcdef",
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "doctorId": "987fcdeb-51a2-43f1-b9c8-123456789abc",
    "date": "2024-12-15T14:30:00.000Z",
    "reason": "Regular checkup",
    "status": "scheduled",
    "notes": "Patient requested afternoon slot",
    "roomId": "abc12345-6789-def0-1234-567890abcdef",
    "createdAt": "2024-12-11T10:00:00.000Z",
    "updatedAt": "2024-12-11T10:00:00.000Z"
  },
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Appointment not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Appointment not found",
    "statusCode": 404
  }
}
```

---

## 4. Get Appointments by Doctor

**Endpoint:** `GET /appointments/doctor/:doctorId`

**Description:** Retrieve all appointments for a specific doctor

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### URL Parameters
```typescript
{
  doctorId: string;  // UUID - Required
}
```

### Query Parameters
```typescript
{
  view?: "year" | "month" | "week" | "day" | "all";  // Optional, default: "month"
  date?: string;                                       // Optional, ISO 8601 date
}
```

**Example Request:**
```
GET /appointments/doctor/987fcdeb-51a2-43f1-b9c8-123456789abc?view=week
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;
    patient: {
      id: string;
      first_name?: string;
      last_name?: string;
      [key: string]: any;
    } | null;
    doctor: {
      id: string;
      first_name?: string;
      last_name?: string;
      [key: string]: any;
    } | null;
    roomId: string | null;
    createdByReceptionistId: string | null;
    createdByDoctorId: string | null;
    appointmentDate: string; // ISO 8601 date-time
    estimatedDurationInMinutes: number | null;
    status: string;
  };
  error: null;
}
```

---

## 5. Get Appointments by Patient

**Endpoint:** `GET /appointments/patient/:patientId`

**Description:** Retrieve all appointments for a specific patient

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### URL Parameters
```typescript
{
  patientId: string;  // UUID - Required
}
```

### Query Parameters
```typescript
{
  view?: "year" | "month" | "week" | "day" | "all";  // Optional, default: "month"
  date?: string;                                       // Optional, ISO 8601 date
}
```

**Example Request:**
```
GET /appointments/patient/123e4567-e89b-12d3-a456-426614174000?view=all
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    reason: string;
    status: string;
    notes: string | null;
    roomId: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  error: null;
}
```

---

## 6. Delete Appointment

**Endpoint:** `DELETE /appointments/:appointmentId`

**Description:** Cancel/delete an appointment

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### URL Parameters
```typescript
{
  appointmentId: string;  // UUID - Required
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
  "message": "Appointment deleted successfully",
  "data": null,
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Appointment not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Appointment not found",
    "statusCode": 404
  }
}
```

---

## 7. Complete Appointment

**Endpoint:** `POST /appointments/:appointmentId/complete`

**Description:** Complete an appointment and record medical history. This endpoint creates or updates the patient's medical file and stores the appointment results in the appointment history.

**Authentication:** Required

**Required Role:** `admin`, `doctor`

### URL Parameters
```typescript
{
  appointmentId: string;  // UUID - Required
}
```

### Request Body
```typescript
{
  patientId?: string;          // Optional, UUID
  doctorId?: string;           // Optional, UUID
  appointmentData?: object;    // Optional, medical data/results
}
```

**Example Request:**
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "doctorId": "987fcdeb-51a2-43f1-b9c8-123456789abc",
  "appointmentData": {
    "diagnosis": "Hypertension",
    "bloodPressure": "140/90",
    "medications": ["Lisinopril 10mg"],
    "notes": "Patient advised to reduce sodium intake",
    "followUp": "2 weeks"
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
  "message": "Appointment completed successfully",
  "data": {
    "id": "456def78-90ab-cdef-1234-567890abcdef",
    "patient": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "first_name": "John",
      "last_name": "Doe"
    },
    "doctor": {
      "id": "987fcdeb-51a2-43f1-b9c8-123456789abc",
      "first_name": "Alice",
      "last_name": "Smith"
    },
    "roomId": "abc12345-6789-def0-1234-567890abcdef",
    "createdByReceptionistId": "11111111-2222-3333-4444-555555555555",
    "createdByDoctorId": null,
    "appointmentDate": "2024-12-15T14:30:00.000Z",
    "estimatedDurationInMinutes": 30,
    "status": "scheduled"
  },
    "name": "ValidationError",
    "message": "Patient ID and Doctor ID are required",
    "statusCode": 400
  }
}
```

---

## 8. Get Appointment History by Appointment ID

**Endpoint:** `GET /appointments/history/:appointmentId`

**Description:** Retrieve the result/history record for a specific appointment

**Authentication:** Required

**Required Role:** `admin`, `doctor`

### URL Parameters
```typescript
{
  appointmentId: string;  // UUID - Required
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
    appointmentId: string;         // UUID
    appointmentData: object;       // Medical data/results
    createdAt: string;             // ISO 8601 date-time
    updatedAt: string;             // ISO 8601 date-time
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Appointment history retrieved successfully",
  "data": {
    "id": "def45678-90ab-cdef-1234-567890abcdef",
    "appointmentId": "456def78-90ab-cdef-1234-567890abcdef",
    "appointmentData": {
      "diagnosis": "Hypertension",
      "bloodPressure": "140/90",
      "medications": ["Lisinopril 10mg"],
      "notes": "Patient advised to reduce sodium intake"
    },
    "createdAt": "2024-12-15T15:00:00.000Z",
    "updatedAt": "2024-12-15T15:00:00.000Z"
  },
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Appointment history not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Appointment history not found",
    "statusCode": 404
  }
}
```

---

## 9. Get Appointment Histories by Patient ID

**Endpoint:** `GET /appointments/history/patient/:patientId`

**Description:** Retrieve all appointment history records for a specific patient

**Authentication:** Required

**Required Role:** `admin`, `doctor`

### URL Parameters
```typescript
{
  patientId: string;  // UUID - Required
}
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    appointmentId: string;
    appointmentData: object;
    createdAt: string;
    updatedAt: string;
  }>;
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Appointment histories retrieved successfully",
  "data": [
    {
      "id": "def45678-90ab-cdef-1234-567890abcdef",
      "appointmentId": "456def78-90ab-cdef-1234-567890abcdef",
      "appointmentData": {
        "diagnosis": "Hypertension",
        "bloodPressure": "140/90"
      },
      "createdAt": "2024-12-15T15:00:00.000Z",
      "updatedAt": "2024-12-15T15:00:00.000Z"
    }
  ],
  "error": null
}
```

---

## 10. Update Appointment History

**Endpoint:** `PATCH /appointments/history/:appointmentId`

**Description:** Update the appointment results/history data for a specific appointment

**Authentication:** Required

**Required Role:** `admin`, `doctor`

### URL Parameters
```typescript
{
  appointmentId: string;  // UUID - Required
}
```

### Request Body
```typescript
{
  appointmentData: object;  // Required, updated medical data
}
```

**Example Request:**
```json
{
  "appointmentData": {
    "diagnosis": "Hypertension - Stage 2",
    "bloodPressure": "145/95",
    "medications": ["Lisinopril 20mg", "Amlodipine 5mg"],
    "notes": "Increased medication dosage. Follow-up in 2 weeks."
  }
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
    appointmentId: string;
    appointmentData: object;
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
  "message": "Appointment history updated successfully",
  "data": {
    "id": "def45678-90ab-cdef-1234-567890abcdef",
    "appointmentId": "456def78-90ab-cdef-1234-567890abcdef",
    "appointmentData": {
      "diagnosis": "Hypertension - Stage 2",
      "bloodPressure": "145/95",
      "medications": ["Lisinopril 20mg", "Amlodipine 5mg"],
      "notes": "Increased medication dosage. Follow-up in 2 weeks."
    },
    "createdAt": "2024-12-15T15:00:00.000Z",
    "updatedAt": "2024-12-15T16:30:00.000Z"
  },
  "error": null
}
```

---

## 11. Delete Appointment History

**Endpoint:** `DELETE /appointments/history/:appointmentId`

**Description:** Delete the appointment history record for a specific appointment

**Authentication:** Required

**Required Role:** `admin`

### URL Parameters
```typescript
{
  appointmentId: string;  // UUID - Required
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
  "message": "Appointment history deleted successfully",
  "data": null,
  "error": null
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Appointment history not found",
  "data": null,
  "error": {
    "name": "AppError",
    "message": "Appointment history not found",
    "statusCode": 404
  }
}
```

---

## View Options

The `view` query parameter filters appointments by time period:

| View | Description | Example Date Range (if date=2024-12-11) |
|------|-------------|------------------------------------------|
| `year` | Current year | Jan 1, 2024 - Dec 31, 2024 |
| `month` | Current month | Dec 1, 2024 - Dec 31, 2024 |
| `week` | Current week | Dec 9, 2024 - Dec 15, 2024 |
| `day` | Specific day | Dec 11, 2024 (full day) |
| `all` | No filtering | All appointments |

---

## Field Validations

### Create Appointment DTO
- `patientId`: Required, valid UUID
- `doctorId`: Required, valid UUID
- `date`: Required, ISO 8601 date-time format
- `reason`: Required, non-empty string
- `status`: Optional string (default: "scheduled")
- `notes`: Optional string
- `roomId`: Optional, valid UUID

### Complete Appointment DTO
- `patientId`: Optional, valid UUID (validated in controller if provided)
- `doctorId`: Optional, valid UUID (validated in controller if provided)
- `appointmentData`: Optional, any valid JSON object

### Update Appointment History DTO
- `appointmentData`: Required, any valid JSON object

---

## Authorization

| Endpoint | Allowed Roles |
|----------|---------------|
| POST /appointments | admin, doctor, receptionist |
| GET /appointments | admin, doctor, receptionist |
| GET /appointments/doctor/:doctorId | admin, doctor, receptionist |
| GET /appointments/patient/:patientId | admin, doctor, receptionist |
| DELETE /appointments/:appointmentId | admin, doctor, receptionist |
| POST /appointments/:appointmentId/complete | admin, doctor |
| GET /appointments/history/:appointmentId | admin, doctor |
| GET /appointments/history/patient/:patientId | admin, doctor |
| PATCH /appointments/history/:appointmentId | admin, doctor |
| DELETE /appointments/history/:appointmentId | admin |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Appointment not found |
| 500 | Internal server error |