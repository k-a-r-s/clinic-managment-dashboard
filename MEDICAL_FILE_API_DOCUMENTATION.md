# Medical File API Specification

## Overview

This document defines the complete data structure for the **Patient Medical File** feature in the Dialysis Clinic Management System.

---

## Database Recommendations

### Storage Strategy

1. **Main Table**: `patient_medical_files`

   - `patient_id` (FK to patients table)
   - `nephropathy_info` (JSONB column)
   - `dialysis_protocol` (JSONB column)
   - `clinical_summary` (TEXT)
   - `created_at`, `updated_at`

2. **Separate Tables for Arrays**:
   - `vascular_accesses` - Historical timeline of vascular access
   - `medications` - Current and historical medications
   - `medication_dose_history` - Dosage changes over time
   - `vaccinations` - Vaccine records
   - `vaccination_doses` - Individual doses per vaccine
   - `lab_results` - Laboratory test results

### Why Separate Tables?

- **Queryable**: Easy to filter, sort, and search
- **Constraints**: Enforce business rules (e.g., only one active vascular access)
- **Performance**: Better indexing and query optimization
- **History Tracking**: Proper audit trails

---

## API Endpoints

### GET `/api/patients/:patientId/medical-file`

**Description**: Retrieve complete medical file for a patient

**Response**: 200 OK

```json
{
  "patientId": 123,
  "medicalFile": {
    "nephropathyInfo": { ... },
    "vascularAccess": [ ... ],
    "dialysisProtocol": { ... },
    "medications": [ ... ],
    "vaccinations": [ ... ],
    "labResults": [ ... ],
    "clinicalSummary": "..."
  }
}
```

**Response**: 404 Not Found

```json
{
  "error": "Medical file not found for patient"
}
```

---

### POST `/api/patients/:patientId/medical-file`

**Description**: Create a new medical file for a patient

**Request Body**: (Same structure as GET response)

**Response**: 201 Created

```json
{
  "message": "Medical file created successfully",
  "medicalFile": { ... }
}
```

---

### PUT `/api/patients/:patientId/medical-file`

**Description**: Update entire medical file

**Request Body**: (Same structure as GET response)

**Response**: 200 OK

```json
{
  "message": "Medical file updated successfully",
  "medicalFile": { ... }
}
```

---

### PATCH `/api/patients/:patientId/medical-file/nephropathy`

**Description**: Update only nephropathy information

**Request Body**:

```json
{
  "initialNephropathy": "Diabetic Nephropathy",
  "diagnosisDate": "2018-03-15"
}
```

---

### POST `/api/patients/:patientId/medical-file/vascular-access`

**Description**: Add new vascular access (marks others as inactive)

**Request Body**:

```json
{
  "type": "AVF",
  "site": "Left Radiocephalic",
  "operator": "Dr. Smith",
  "creationDate": "2024-01-15",
  "firstUseDate": "2024-01-30",
  "status": "active"
}
```

**Business Logic**: When status is "active", automatically set all other accesses to "inactive"

---

### PATCH `/api/patients/:patientId/medical-file/vascular-access/:accessId`

**Description**: Update vascular access status

**Request Body**:

```json
{
  "status": "abandoned"
}
```

**Constraint**: Once status is "abandoned", it should be locked (cannot be changed back)

---

### POST `/api/patients/:patientId/medical-file/medications`

**Description**: Add new medication

**Request Body**:

```json
{
  "name": "Erythropoietin (EPO)",
  "category": "Anemia Management",
  "initialDosage": {
    "startDate": "2024-01-15",
    "dosage": "4000 IU - 3x/week IV"
  }
}
```

---

### POST `/api/patients/:patientId/medical-file/medications/:medicationId/dose-change`

**Description**: Add new dosage record (dose change)

**Request Body**:

```json
{
  "startDate": "2024-06-15",
  "dosage": "6000 IU - 3x/week IV"
}
```

---

### POST `/api/patients/:patientId/medical-file/vaccinations`

**Description**: Add new vaccination record

**Request Body**:

```json
{
  "vaccineName": "Hepatitis B",
  "status": "In Progress",
  "initialDose": {
    "date": "2024-01-15",
    "reminderDate": "2024-02-15"
  }
}
```

---

### POST `/api/patients/:patientId/medical-file/vaccinations/:vaccinationId/doses`

**Description**: Add new dose to existing vaccination

**Request Body**:

```json
{
  "date": "2024-02-15",
  "reminderDate": "2024-08-15"
}
```

---

### POST `/api/patients/:patientId/medical-file/lab-results`

**Description**: Add new lab result

**Request Body**:

```json
{
  "date": "2024-12-20",
  "parameters": {
    "creatinine": "8.5",
    "urea": "65",
    "ktv": "1.4",
    "hemoglobin": "11.2",
    "potassium": "5.1",
    ...
  }
}
```

**Constraint**: Once created with validated_at timestamp, lab results should be immutable (delete only if entered in error)

---

## Business Rules & Constraints

### Vascular Access

1. **Only ONE access can have `status: "active"` at any time**
2. When creating/updating to "active", auto-set others to "inactive"
3. Once marked as "abandoned", status cannot be changed
4. Never delete vascular access records (historical data)

### Medications

1. Each medication can have multiple dose history entries
2. Most recent dose is the current active dose
3. Store as append-only log (never edit history)

### Vaccinations

1. Each vaccination can have multiple doses
2. Track reminder dates for next doses
3. Cannot delete doses once recorded

### Lab Results

1. Immutable once validated
2. Parameters stored as key-value pairs (flexible schema)
3. All numeric values stored as strings (preserves precision)
4. Display most recent results first

### Nephropathy Information

1. Should have audit log for changes (critical medical data)
2. Changes should be rare and require justification

---

## Data Types & Validation

### Dates

- Format: ISO 8601 (`YYYY-MM-DD`)
- Example: `"2024-12-20"`

### Status Enums

- **Vascular Access**: `"active"` | `"inactive"` | `"abandoned"`
- **Vaccination**: Any string (e.g., "Complete", "In Progress", "Overdue")

### Dialysis Days

- Array of strings: `["Monday", "Wednesday", "Friday"]`
- Valid values: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"

### Lab Parameters

All lab values stored as **strings** to preserve precision and units:

```json
{
  "creatinine": "8.5", // mg/dL
  "hemoglobin": "11.2", // g/dL
  "potassium": "5.1", // mmol/L
  "ktv": "1.4" // ratio
}
```

---

## Patient Table Integration

Add to existing `patients` table:

```sql
ALTER TABLE patients
ADD COLUMN medical_file_id INTEGER REFERENCES patient_medical_files(id);
```

Or use direct relationship:

```sql
-- In patient_medical_files table
patient_id INTEGER UNIQUE REFERENCES patients(id) ON DELETE CASCADE
```

---

## Response Examples

### Complete Medical File Response

See `MEDICAL_FILE_EXAMPLE.json` for full example.

### Empty Medical File (New Patient)

```json
{
  "patientId": 123,
  "medicalFile": {
    "nephropathyInfo": {
      "initialNephropathy": "",
      "diagnosisDate": "",
      "firstDialysisDate": "",
      "careStartDate": ""
    },
    "vascularAccess": [],
    "dialysisProtocol": {
      "dialysisDays": [],
      "sessionsPerWeek": 3,
      "generator": "",
      "sessionDuration": "",
      "dialyser": "",
      "needle": "",
      "bloodFlow": "",
      "anticoagulation": "",
      "dryWeight": "",
      "interDialyticWeightGain": "",
      "incidents": []
    },
    "medications": [],
    "vaccinations": [],
    "labResults": [],
    "clinicalSummary": ""
  }
}
```

---

## Security & Permissions

### Role-Based Access Control

- **Doctor**: Full read/write access to all sections
- **Nurse**: Read-only access + can add lab results, vaccinations
- **Admin**: Read-only access for auditing purposes
- **Patient**: Read-only access to their own medical file (if portal exists)

### Audit Logging

Track all changes to:

- Nephropathy information (critical diagnosis data)
- Dialysis protocol changes
- Medication dosage changes
- Vascular access status changes

Log format:

```json
{
  "userId": 456,
  "action": "UPDATE",
  "table": "medications",
  "recordId": 789,
  "changedFields": {
    "dosage": {
      "old": "4000 IU - 3x/week IV",
      "new": "6000 IU - 3x/week IV"
    }
  },
  "timestamp": "2024-12-28T14:30:00Z"
}
```

---

## Frontend Integration Notes

### Current Implementation

- Frontend uses `MedicalFile` TypeScript interface
- Form component: `MedicalFileForm.tsx`
- Integrates with patient registration and patient profile editing
- Supports read-only and edit modes

### State Management

- Medical file state stored in `useState<MedicalFile>`
- Updates via `onChange` callback
- Separate save to backend when patient is saved

### TODO for Backend Team

1. Implement POST/PUT endpoints for medical file creation/update
2. Return `medicalFile` object in `GET /patients/:id` response
3. Accept `medicalFile` in patient registration/update endpoints
4. Implement validation for business rules (only one active vascular access, etc.)

---

## Testing Recommendations

### Unit Tests

- Vascular access status constraint (only one active)
- Date validation (ISO 8601 format)
- Lab result immutability once validated
- Medication dose history ordering

### Integration Tests

- Create patient with medical file
- Update existing medical file
- Add vascular access and verify others become inactive
- Add medication dose change
- Retrieve medical file history

### Edge Cases

- Patient with no medical file (return empty structure)
- Updating abandoned vascular access (should reject)
- Deleting lab result with validated_at timestamp (should reject)
- Multiple concurrent updates to vascular access status

---

## Migration Strategy

### Phase 1: Database Schema

1. Create tables
2. Add foreign keys and constraints
3. Add indexes for performance

### Phase 2: API Endpoints

1. GET endpoint (read medical file)
2. POST endpoint (create medical file)
3. PUT endpoint (update medical file)

### Phase 3: Granular Endpoints

1. Vascular access endpoints
2. Medication endpoints
3. Vaccination endpoints
4. Lab results endpoints

### Phase 4: Business Logic

1. Vascular access status constraint
2. Lab result validation
3. Audit logging

---

## Performance Considerations

### Indexes

```sql
CREATE INDEX idx_vascular_access_patient ON vascular_accesses(patient_id);
CREATE INDEX idx_vascular_access_status ON vascular_accesses(status) WHERE status = 'active';
CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_lab_results_patient_date ON lab_results(patient_id, date DESC);
```

### Query Optimization

- Use JSON aggregation for nested arrays
- Limit lab results to most recent N results
- Cache medical file for frequently accessed patients

---

## Questions for Product Team

1. Should medication removal be allowed? (Currently frontend confirms before deletion)
2. Should clinical summary have version history?
3. What is retention policy for abandoned vascular accesses?
4. Should lab results support custom parameters beyond the 13 standard ones?
5. Do we need real-time notifications for critical lab values (e.g., high potassium)?

---

## Contact

For questions or clarifications about this API specification, contact the frontend development team.

**Files Created**:

- `MEDICAL_FILE_API_SPEC.json` - Field descriptions and types
- `MEDICAL_FILE_EXAMPLE.json` - Complete working example
- `MEDICAL_FILE_API_DOCUMENTATION.md` - This file
