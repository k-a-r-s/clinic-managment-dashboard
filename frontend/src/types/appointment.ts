export type AppointmentStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "NO_SHOW";

export interface doctor_app {
    id:string;
    first_name:string;
    last_name:string;
}

export interface patient_app {
    id:string;
    first_name:string;
    last_name:string;
}


export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  roomId?: string;
  createdByReceptionistId?: string;
  createdByDoctorId?: string;
  appointmentDate: string;
  estimatedDurationInMinutes: number; // in minutes
  actualDuration?: number;
  status: AppointmentStatus;
  notes?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  roomId: string;
  appointmentDate: string;
  estimatedDurationInMinutes: number;
  status?: AppointmentStatus;
  notes?: string;
  reason?: string;
  createdByDoctorId?: string | null,
  createdByReceptionId?: string | null,
}

export interface AppointmentWithDetails extends Appointment {
  doctor: doctor_app;
  patient: patient_app;
}