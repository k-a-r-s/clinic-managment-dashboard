export interface PrescriptionMedicationDto {
  id: string;
  prescriptionId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionPatientDto {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PrescriptionDoctorDto {
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetPrescriptionResponseDto {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  prescriptionDate: Date;
  medications: PrescriptionMedicationDto[];
  patient: PrescriptionPatientDto | null;
  doctor: PrescriptionDoctorDto | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPrescriptionsResponseDto {
  total: number;
  prescriptions: GetPrescriptionResponseDto[];
}
