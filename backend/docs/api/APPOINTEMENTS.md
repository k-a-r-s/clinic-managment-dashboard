# Appointments API Documentation

Base URL: `/appointments`

## Authentication
All endpoints require authentication via JWT token in the Authorization header.
Required roles: `DOCTOR`, `RECEPTIONIST`, or `ADMIN`

---

## Endpoints

### 1. Create Appointment
**POST** `/appointments`

Creates a new appointment in the system.

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```typescript
{
  patientId: string;              // UUID of the patient (required)
  doctorId: string;               // UUID of the doctor (required)
  roomId: string;                 // UUID of the room (required)
  createdByDoctorId: string | null;      // UUID of doctor who created (nullable)
  createdByReceptionId: string | null;   // UUID of receptionist who created (nullable)
  appointmentDate: Date | string;        // ISO date string or Date object (required)
  estimatedDurationInMinutes: number;    // Positive integer (required)
  status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";  // Appointment status (required)
}
```

#### Response
**Status:** `201 Created`
```json
{
  "message": "Appointment created successfully"
}
```

#### Error Responses
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

---

### 2. Get All Appointments
**GET** `/appointments?view={view}`

Retrieves all appointments with optional time filter.

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Query Parameters
- `view` (optional): `"year"` | `"month"` | `"week"` | `"day"` (default: `"month"`)

#### Response
**Status:** `200 OK`
```typescript
Array<{
  id: string;                            // UUID
  patientId: string;                     // UUID
  doctorId: string;                      // UUID
  roomId: string;                        // UUID
  createdByReceptionId: string | null;   // UUID or null
  createdByDoctorId: string | null;      // UUID or null
  appointementDate: string;              // ISO date string
  estimatedDurationInMinutes: number;    // Integer
  status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";
}>
```

#### Example Response
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "patientId": "660e8400-e29b-41d4-a716-446655440001",
    "doctorId": "770e8400-e29b-41d4-a716-446655440002",
    "roomId": "880e8400-e29b-41d4-a716-446655440003",
    "createdByReceptionId": "990e8400-e29b-41d4-a716-446655440004",
    "createdByDoctorId": null,
    "appointementDate": "2025-12-15T10:00:00.000Z",
    "estimatedDurationInMinutes": 30,
    "status": "SCHEDULED"
  }
]
```

#### Error Responses
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

---

### 3. Get Appointments by Doctor
**GET** `/appointments/doctor/:doctorId?view={view}`

Retrieves all appointments for a specific doctor.

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Path Parameters
- `doctorId` (required): UUID of the doctor

#### Query Parameters
- `view` (optional): `"year"` | `"month"` | `"week"` | `"day"` (default: `"month"`)

#### Response
**Status:** `200 OK`
```typescript
Array<{
  id: string;
  patientId: string;
  doctorId: string;
  roomId: string;
  createdByReceptionId: string | null;
  createdByDoctorId: string | null;
  appointementDate: string;
  estimatedDurationInMinutes: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";
}>
```

#### Error Responses
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Doctor not found

---

### 4. Get Appointments by Patient
**GET** `/appointments/patient/:patientId?view={view}`

Retrieves all appointments for a specific patient.

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Path Parameters
- `patientId` (required): UUID of the patient

#### Query Parameters
- `view` (optional): `"year"` | `"month"` | `"week"` | `"day"` (default: `"month"`)

#### Response
**Status:** `200 OK`
```typescript
Array<{
  id: string;
  patientId: string;
  doctorId: string;
  roomId: string;
  createdByReceptionId: string | null;
  createdByDoctorId: string | null;
  appointementDate: string;
  estimatedDurationInMinutes: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";
}>
```

#### Error Responses
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Patient not found

---

### 5. Delete Appointment
**DELETE** `/appointments/:appointmentId`

Deletes an appointment from the system.

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Path Parameters
- `appointmentId` (required): UUID of the appointment to delete

#### Response
**Status:** `200 OK`
```json
{
  "message": "Appointment deleted successfully"
}
```

#### Error Responses
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Appointment not found

---

## Data Types

### Appointment Status Enum
```typescript
type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";
```

### View Type
```typescript
type ViewType = "year" | "month" | "week" | "day";
```

---

## Common Error Response Format
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## Notes
- All date/time values are in ISO 8601 format
- All IDs are UUIDs (v4)
- Timestamps are in UTC
- Either `createdByDoctorId` or `createdByReceptionId` should be set, not both
- The `view` parameter filters appointments within the specified time range relative to the current date
