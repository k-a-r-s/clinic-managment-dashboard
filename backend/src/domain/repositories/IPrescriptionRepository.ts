import { Prescription } from "../entities/Prescription";

export interface IPrescriptionRepository {
  getPrescriptionById(id: string): Promise<Prescription | null>;
  getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]>;
  getPrescriptionsByDoctorId(doctorId: string): Promise<Prescription[]>;
  createPrescription(prescription: Prescription): Promise<Prescription>;
  updatePrescription(prescription: Prescription): Promise<void>;
  deletePrescription(id: string): Promise<void>;
}