import { Prescription, PrescriptionProps, PrescriptionMedicationProps } from "../../../domain/entities/Prescription";
import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import { CreatePrescriptionDto } from "../../dto/requests/CreatePrescriptionDto";

export class CreatePrescriptionUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async execute(prescriptionData: CreatePrescriptionDto): Promise<Prescription> {
    const medicationProps: PrescriptionMedicationProps[] = prescriptionData.medications.map((med: any) =>  ({
      id: "", // Will be generated
      prescriptionId: "", // Will be set after prescription creation
      medicationName: med.medicationName,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      notes: med.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const prescriptionProps: PrescriptionProps = {
      id: "", // Will be generated
      patientId: prescriptionData.patientId,
      doctorId: prescriptionData.doctorId,
      appointmentId: prescriptionData.appointmentId,
      prescriptionDate: prescriptionData.prescriptionDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      medications: medicationProps
    };

    const prescription = new Prescription(prescriptionProps);
    return await this.prescriptionRepository.createPrescription(prescription);
  }
}