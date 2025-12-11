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
  data: {
    id: string;                  // UUID
    patientId: string;           // UUID
    doctorId: string;            // UUID
    date: string;                // ISO 8601 date-time
    reason: string;
    status: string;
    notes: string | null;
    roomId: string | null;       // UUID
    createdAt: string;           // ISO 8601 date-time
    updatedAt: string;           // ISO 8601 date-time
  };
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

**Description:** Retrieve all appointments with optional time-based filtering

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

### Query Parameters
```typescript
{
  view?: "year" | "month" | "week" | "day" | "all";  // Optional, default: "month"
  date?: string;                                       // Optional, ISO 8601 date
}
```

**Example Requests:**
```
GET /appointments?view=week&date=2024-12-11
GET /appointments?view=day&date=2024-12-15
GET /appointments?view=all
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

## 3. Get Appointments by Doctor

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

## 4. Get Appointments by Patient

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

## 5. Delete Appointment

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

---

## Authorization

| Endpoint | Allowed Roles |
|----------|---------------|
| POST /appointments | admin, doctor, receptionist |
| GET /appointments | admin, doctor, receptionist |
| GET /appointments/doctor/:doctorId | admin, doctor, receptionist |
| GET /appointments/patient/:patientId | admin, doctor, receptionist |
| DELETE /appointments/:appointmentId | admin, doctor, receptionist |

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
