import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { CreatePrescriptionDto } from "../../dto/requests/createPrescriptionDto";
import { GetPrescriptionResponseDto } from "../../dto/responses/prescriptions/getPrescription";

export class CreatePrescriptionUseCase {
  constructor(
    private prescriptionRepository: IPrescriptionRepository,
    private medicalFileRepository: IMedicalFileRepository
  ) {}

  async execute(
    data: CreatePrescriptionDto
  ): Promise<GetPrescriptionResponseDto> {
    const prescription = await this.prescriptionRepository.createPrescription(
      data
    );

    // Update medical file with prescription history
    try {
      const medicalFile =
        await this.medicalFileRepository.getMedicalFileByPatientId(
          data.patientId
        );

      if (medicalFile) {
        const existingPrescriptions = medicalFile.data?.prescriptions || [];
        const prescriptionRecord = {
          id: prescription.id,
          date: prescription.prescriptionDate,
          doctorId: prescription.doctorId,
          medications: prescription.medications.map((med) => ({
            name: med.medicationName,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            notes: med.notes,
          })),
        };

        await this.medicalFileRepository.updateMedicalFile(medicalFile.id, {
          prescriptions: [...existingPrescriptions, prescriptionRecord],
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to update medical file with prescription:", error);
      // Don't fail the prescription creation if medical file update fails
    }

    return prescription;
  }
}
