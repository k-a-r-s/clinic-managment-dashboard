# Prescriptions Module - Frontend Implementation

This document outlines the frontend implementation of the prescriptions module for the clinic management system.

## Overview

The prescriptions module allows doctors to create prescriptions for patients and automatically syncs medications to the patient's medical file.

## Features

- **List Prescriptions**: View all prescriptions with search and filtering
- **Create Prescription**: Create new prescriptions with multiple medications
- **View Prescription Details**: View full prescription information
- **Medical File Integration**: Automatically sync medications to patient medical files
- **Prescription References**: Track which medications came from prescriptions

## Pages

### 1. PrescriptionsList

- **Location**: `frontend/src/features/prescriptions/pages/PrescriptionsList.tsx`
- **Features**:
  - Search by patient, doctor, medication, or ID
  - Data table with columns: ID, Patient, Doctor, Date, Medications, Item Count
  - View and Edit actions
  - Pagination
  - Badge display for medications (shows first 2, "+X more" for overflow)

### 2. CreatePrescription

- **Location**: `frontend/src/features/prescriptions/pages/CreatePrescription.tsx`
- **Features**:
  - Select patient and doctor
  - Set prescription date
  - Optional appointment reference
  - Add multiple medications with:
    - Medication name
    - Dosage (e.g., "4000 IU")
    - Frequency (e.g., "3 times/week")
    - Duration (e.g., "Ongoing", "2 weeks")
    - Notes (optional)
  - Auto-sync to medical file on save

### 3. PrescriptionDetails

- **Location**: `frontend/src/features/prescriptions/pages/PrescriptionDetails.tsx`
- **Features**:
  - View complete prescription information
  - Print prescription
  - Edit prescription (navigates to edit mode)
  - Delete prescription with confirmation
  - Shows all medications with full details

## Data Types

### PrescriptionMedication

```typescript
{
  id?: string;
  prescriptionId?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Prescription

```typescript
{
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  prescriptionDate: string;
  medications: PrescriptionMedication[];
  createdAt: string;
  updatedAt: string;
  // Populated fields
  patientName?: string;
  doctorName?: string;
}
```

## API (Mock Implementation)

**Location**: `frontend/src/features/prescriptions/api/prescriptions.api.ts`

### Endpoints

- `getPrescriptions()` - Get all prescriptions
- `getPrescriptionsByPatient(patientId)` - Get prescriptions for a specific patient
- `getPrescriptionById(id)` - Get single prescription
- `createPrescription(data)` - Create new prescription
- `updatePrescription(id, data)` - Update prescription
- `deletePrescription(id)` - Delete prescription

### Mock Data

Currently uses in-memory array with sample prescriptions. Includes realistic dialysis medications:

- EPO (Erythropoietin) - 4000 IU, 3 times/week
- Iron Sucrose - 100mg weekly
- Calcium Carbonate - 500mg, 3 times daily

## Medical File Integration

### Sync Utility

**Location**: `frontend/src/features/prescriptions/utils/medicalFileSync.ts`

### Functions

#### `syncPrescriptionToMedicalFile(prescription, medicalFile)`

- Converts prescription medications to medical file format
- Adds medications to patient's medication history
- Prevents duplicates
- Includes prescription reference

#### `removePrescriptionFromMedicalFile(prescriptionId, medicalFile)`

- Removes all history entries related to a prescription
- Used when prescription is deleted
- Preserves medications with non-prescription history

#### `updatePrescriptionInMedicalFile(prescription, medicalFile)`

- Updates medical file when prescription is edited
- Removes old entries and adds new ones

### Medical File Medication Format

Updated `Medication` type to include prescription references:

```typescript
{
  name: string;
  category: string;
  history: [{
    startDate: string;
    dosage: string;
    // NEW FIELDS:
    prescriptionId?: string;
    frequency?: string;
    duration?: string;
    notes?: string;
  }]
}
```

### UI Enhancements

The medical file medications tab now displays:

- Prescription reference badge (e.g., "From Prescription #123")
- Frequency and duration information
- Notes from prescription

## Backend Integration Checklist

When backend is ready, update the API file:

1. **Uncomment axios calls** in `prescriptions.api.ts`
2. **Update endpoints** to match backend API routes
3. **Remove mock data** and mock functions
4. **Update response handling** if backend structure differs
5. **Add error handling** for network errors
6. **Implement pagination** if backend supports it
7. **Add JWT token** to request headers

### Expected Backend Endpoints

```
GET    /api/prescriptions              - List all prescriptions
GET    /api/prescriptions/patient/:id  - Get by patient
GET    /api/prescriptions/:id          - Get single prescription
POST   /api/prescriptions              - Create prescription
PUT    /api/prescriptions/:id          - Update prescription
DELETE /api/prescriptions/:id          - Delete prescription
```

### Expected Request/Response Format

**Create Prescription Request:**

```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentId": "uuid (optional)",
  "prescriptionDate": "YYYY-MM-DD",
  "medications": [
    {
      "medicationName": "EPO",
      "dosage": "4000 IU",
      "frequency": "3 times/week",
      "duration": "Ongoing",
      "notes": "Optional notes"
    }
  ]
}
```

**Response:**

```json
{
  "id": "uuid",
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentId": "uuid",
  "prescriptionDate": "YYYY-MM-DD",
  "medications": [...],
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "patient": { "firstName": "...", "lastName": "..." },
  "doctor": { "firstName": "...", "lastName": "..." }
}
```

## Database Schema Reference

### prescriptions table

- `id` - UUID primary key
- `patient_id` - UUID foreign key to profiles
- `doctor_id` - UUID foreign key to doctors
- `appointment_id` - UUID foreign key to appointments (optional)
- `prescription_date` - Date
- `created_at` - Timestamp
- `updated_at` - Timestamp

### prescription_medications table

- `id` - UUID primary key
- `prescription_id` - UUID foreign key to prescriptions
- `medication_name` - varchar
- `dosage` - varchar
- `frequency` - varchar
- `duration` - varchar
- `notes` - text (optional)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Usage Example

### Creating a Prescription

1. Navigate to Prescriptions from sidebar
2. Click "Create New Prescription" button
3. Fill in prescription details:
   - Select patient
   - Select prescribing doctor
   - Set prescription date
   - (Optional) Link to appointment
4. Add medications:
   - Click "Add Medication"
   - Fill in medication details
   - Repeat for multiple medications
5. Click "Create Prescription"
6. Medications automatically appear in patient's medical file

### Viewing in Medical File

When viewing a patient's medical file:

1. Go to Medications tab
2. Prescription-sourced medications show:
   - Badge: "From Prescription #XXX"
   - Frequency and duration
   - Notes if provided
3. Click on prescription ID badge to view full prescription (future feature)

## Notes

- Frontend is fully functional with mock data
- Backend integration requires only API file updates
- Medical file sync happens automatically on prescription create
- Prescription references in medical file help track medication source
- Print functionality available for prescriptions
- Delete confirmation prevents accidental deletions

## Future Enhancements

- Edit prescription functionality
- Filter prescriptions by date range
- Export prescriptions to PDF
- Link from medical file prescription badge to prescription details
- Notification when prescription medications need refill
- Prescription templates for common medication combinations
- Drug interaction warnings
- Prescription history timeline
