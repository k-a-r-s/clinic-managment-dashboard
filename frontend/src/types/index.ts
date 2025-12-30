//absolute zina istg

export * from "./doctors";
export * from "./users";
export * from "./prescriptions";
// Admin Type

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Patient Types
export interface Patient {
  name: any;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  birthDate: string;
  gender: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  currentMedications?: string[];
  createdAt?: string;
  updatedAt?: string;
  // Medical file data (if included in response)
  medicalFile?: MedicalFile;
}

export interface MedicalFile {
  id?: string;
  patientId?: string;
  nephropathyInfo: {
    initialNephropathy: string;
    diagnosisDate: string;
    firstDialysisDate: string;
    careStartDate: string;
  };
  vascularAccess: VascularAccess[];
  dialysisProtocol: DialysisProtocol;
  medications: Medication[];
  vaccinations: Vaccination[];
  labResults: LabResult[];
  clinicalSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  birthDate: string;
  gender: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// User Types
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "doctor" | "receptionist";
}

export interface VascularAccess {
  type: string;
  site: string;
  operator: string;
  creationDate: string;
  firstUseDate: string;
  status: "active" | "inactive" | "abandoned";
}

export interface Vaccination {
  vaccineName: string;
  doses: {
    doseNumber: number;
    date: string;
    reminderDate?: string;
  }[];
}

export interface DialysisProtocol {
  dialysisDays: string[];
  sessionsPerWeek: number;
  generator: string;
  sessionDuration: string;
  dialyser: string;
  needle: string;
  bloodFlow: string;
  anticoagulation: string;
  dryWeight: string;
  interDialyticWeightGain: string;
  incidents: string[];
}

export interface Medication {
  name: string;
  category: string;
  currentTreatment: {
    dosage: string;
    frequency: string;
    startDate: string;
    status: "active" | "discontinued" | "completed";
    prescriptionId?: string;
  };
  history: {
    prescriptionMedicationId?: string;
    prescriptionId?: string;
    startDate: string;
    endDate: string | null;
    dosage: string;
    frequency: string;
    status: "active" | "discontinued" | "completed";
    notes: string | null;
  }[];
}

export interface LabResult {
  date: string;
  parameters: {
    [key: string]: string;
  };
}

// Doctor Types
export interface Doctor {
  name: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  salary: number;
  isMedicalDirector: boolean;
  specialization: string;
  createdAt?: string;
  updatedAt?: string;
}

// Machine Types
export interface Machine {
  id: string;
  machineId: string;
  manufacturer?: string | null;
  model?: string | null;
  status: "available" | "in-use" | "maintenance" | "out-of-service";
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  roomId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Populated field
  room?: string | null;
}

export interface MachineFormData {
  machineId: string;
  manufacturer?: string;
  model?: string;
  status: "available" | "in-use" | "maintenance" | "out-of-service";
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  roomId?: string;
  isActive?: boolean;
}
  // store room by UUID (room id)
  room?: string;
}

// Room Types
export interface Room {
  id: string;
  roomNumber: string;
  capacity?: number;
  type?: string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  roomId?: number;
  createdByReceptionistId?: string;
  createdByDoctorId?: string;
  appointmentDate: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  notes?: string;
  reasonForVisit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  roomId?: string;
  appointmentDate: string;
  estimatedDuration: number;
  status?: "SCHEDULED" | "in-progress" | "COMPLETED" | "CANCELED" | "no-show";
  notes?: string;
  reasonForVisit?: string;
}

export interface AppointmentWithDetails extends Appointment {
  doctorName: string;
  patientName: string;
  roomNumber?: string;
}

// API Response Types
export interface ApiSuccessResponse<T = any> {
  success: true;
  status: number;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  data: null;
  error: {
    type: string;
    subErrorType?: string;
    context?: any;
    message: string;
    details?: any;
    hint?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
