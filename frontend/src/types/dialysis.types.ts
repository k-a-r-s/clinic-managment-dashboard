// Dialysis Patient Entry (links patient to dialysis program)
export interface DialysisPatientEntry {
  id: string;
  patientId: string;
  startDate: string;
  status: "active" | "paused" | "stopped";
  notes?: string;
}

// Dialysis Protocol Types
export interface DialysisProtocol {
  id?: string;
  dialysisPatientId: string; // Links to dialysis_patients table
  dialysisType: "hemodialysis" | "peritoneal";
  sessionsPerWeek: number;
  sessionDurationMinutes: number;
  accessType: "fistula" | "catheter" | "graft";
  targetWeightKg?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dialysis Session Types
export interface DialysisSession {
  id: string;
  dialysisPatientId: string; // Links to dialysis_patients table
  sessionDate: string;
  durationMinutes?: number;
  completed: boolean;
  complications?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Incident Types
export interface DialysisIncident {
  id: string;
  sessionId: string;
  patientId: string; // CRITICAL: Incident is per patient
  type: "hypotension" | "cramps" | "clotting" | "nausea" | "other";
  severity: "mild" | "moderate" | "severe";
  timeOccurred: string;
  description: string;
  resolution?: string;
  createdAt?: string;
}

// Dialysis Patient Summary (for dashboard list)
export interface DialysisPatient {
  id: string; // dialysis_patient_id
  patientId: string;
  patientName: string;
  dialysisType: "hemodialysis" | "peritoneal";
  sessionsPerWeek: number;
  status: "active" | "paused" | "stopped";
  lastSessionDate?: string;
  nextSessionDate?: string;
  startDate: string;
  totalSessions?: number;
}

// Medical File History Entry (read-only)
export interface DialysisHistoryEntry {
  date: string;
  dialysisType: "hemodialysis" | "peritoneal";
  sessionsPerWeek: number;
  sessionDurationMinutes: number;
  accessType: string;
  note?: string;
}

// Form Data Types
export interface ProtocolFormData {
  dialysisType: "hemodialysis" | "peritoneal";
  sessionsPerWeek: number;
  sessionDurationMinutes: number;
  accessType: "fistula" | "catheter" | "graft";
  targetWeightKg?: number;
  notes?: string;
}

export interface SessionFormData {
  sessionDate: string;
  durationMinutes?: number;
  completed: boolean;
  complications?: string;
  notes?: string;
}

export interface IncidentFormData {
  patientId: string;
  type: "hypotension" | "cramps" | "clotting" | "nausea" | "other";
  severity: "mild" | "moderate" | "severe";
  timeOccurred: string;
  description: string;
  resolution?: string;
}
