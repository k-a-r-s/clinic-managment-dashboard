// Prescription Types - Based on database schema

export interface PrescriptionMedication {
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

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  prescriptionDate: string;
  medications: PrescriptionMedication[];
  createdAt?: string;
  updatedAt?: string;
  // Populated fields
  patientName?: string;
  doctorName?: string;
}

export interface PrescriptionFormData {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  prescriptionDate: string;
  medications: Omit<
    PrescriptionMedication,
    "id" | "prescriptionId" | "createdAt" | "updatedAt"
  >[];
}
