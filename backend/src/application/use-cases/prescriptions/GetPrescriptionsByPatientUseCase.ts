import { Prescription } from "../../../domain/entities/Prescription";
import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";

export class GetPrescriptionsByPatientUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async execute(input: { patientId: string }): Promise<Prescription[]> {
    const { patientId } = input;

    return await this.prescriptionRepository.getPrescriptionsByPatientId(patientId);
  }
}
