# API Endpoints Overview

Complete list of all available API endpoints grouped by route with descriptions.

---

## Authentication Routes (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate user with email and password. Returns access and refresh tokens in HTTP-only cookies. |
| POST | `/auth/logout` | Logout user and invalidate session. Clears both access and refresh token cookies. |
| POST | `/auth/refresh-token` | Refresh access token using refresh token stored in HTTP-only cookie. |

---

## Doctors Routes (`/doctors`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors` | Retrieve paginated list of all doctors with optional pagination parameters. |
| GET | `/doctors/:id` | Get a specific doctor by their UUID. |
| PATCH | `/doctors/:id` | Update doctor information (admin only). Supports partial updates. |
| DELETE | `/doctors/:id` | Permanently delete a doctor from the system (admin only). |

---

## Patients Routes (`/patients`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patients` | Create a new patient record with complete demographic and contact information. |
| GET | `/patients` | Retrieve paginated list of all patients. |
| GET | `/patients/:id` | Get a specific patient by their UUID. |
| PATCH | `/patients/:id` | Update patient information. Supports partial updates. |
| DELETE | `/patients/:id` | Permanently delete a patient from the system (admin only). |

---

## Appointments Routes (`/appointments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/appointments` | Create a new appointment with patient, doctor, and date information. |
| GET | `/appointments` | Get all appointments with optional time-based filtering (year/month/week/day/all). |
| GET | `/appointments/doctor/:doctorId` | Retrieve all appointments for a specific doctor with optional time filtering. |
| GET | `/appointments/patient/:patientId` | Retrieve all appointments for a specific patient with optional time filtering. |
| DELETE | `/appointments/:appointmentId` | Cancel/delete an appointment (admin, doctor, or receptionist). |

---

## Medical Files Routes (`/medical-files`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/medical-files` | Create a new medical file for a patient with flexible medical data. |
| GET | `/medical-files/patient/:patientId` | Retrieve the medical file for a specific patient. |
| PUT | `/medical-files/:id` | Update an existing medical file with new or modified medical data. |
| DELETE | `/medical-files/:id` | Permanently delete a medical file (admin only). |

---

## Users Routes (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/add-user` | Create a new user (Doctor or Receptionist). Admin access required. |

---

## Rooms Routes (`/rooms`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rooms` | Create a new room in the clinic. |
| GET | `/rooms` | Retrieve all rooms in the system. |
| GET | `/rooms/available` | Get only available rooms (not currently in use). |
| GET | `/rooms/:id` | Retrieve a specific room by its UUID. |
| PATCH | `/rooms/:id` | Update room information (admin or receptionist). |
| PATCH | `/rooms/:id/availability` | Toggle room availability status. |
| DELETE | `/rooms/:id` | Permanently delete a room from the system (admin only). |

---

## Authentication & Authorization

All endpoints except `/auth/login` require:
- **Authorization Header**: `Authorization: Bearer <access_token>`
- **Valid JWT Token**: Access token obtained from login endpoint
- **Role-Based Access**: Some endpoints require specific user roles (admin, doctor, receptionist)

---

## Response Format

All endpoints follow a unified response format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null,
  "error": null | object
}
```

---

## Common HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Missing or invalid authentication token |
| 403 | Forbidden - Authenticated but insufficient permissions |
| 404 | Not Found - Requested resource does not exist |
| 500 | Internal Server Error - Server-side error occurred |

---

## Documentation Files

Detailed documentation for each route group:
- `docs/api/AUTH.md` - Authentication endpoints
- `docs/api/DOCTORS.md` - Doctors management
- `docs/api/PATIENTS.md` - Patients management
- `docs/api/APPOINTMENTS.md` - Appointments management
- `docs/api/MEDICAL_FILES.md` - Medical files management
- `docs/api/USERS.md` - Users management
- `docs/api/ROOMS.md` - Rooms management
