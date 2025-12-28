//absolute zina istg

export * from "./doctors";
export * from "./dashboard";
export * from "./appointment";
// Admin Type

export interface UserProfile {
  id: string;
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
  id: string;
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
  medicalInfo?: {
    initialNephropathy?: string;
    firstDialysisDate?: string;
    careStartDate?: string;
    vascularAccess?: VascularAccess[];
    vaccinations?: Vaccination[];
    dialysisProtocol?: DialysisProtocol;
    medications?: Medication[];
    labResults?: LabResult[];
    clinicalSummary?: string;
  };
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
  firstUseDate: string;
  creationDates: string[];
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
  history: {
    startDate: string;
    dosage: string;
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
  id:  string;
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
  machineId?: string;
  manufacturer?: string | null;
  model?: string | null;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  // notes removed per design
  // notes removed
  // notes removed
  isActive?: boolean;
  room?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MachineFormData {
  machineId?: string;
  manufacturer?: string;
  model?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  // notes removed
  // notes removed
  // notes removed
  // store room by UUID (room id)
  room?: string;
}

// Room Types
export interface Room {
  status: any;
  id: string;
  roomNumber: string;
  type?: string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
