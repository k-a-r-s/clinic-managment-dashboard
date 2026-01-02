import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import { GetPrescriptionResponseDto } from "../../dto/responses/prescriptions/getPrescription";

export class GetPrescriptionsByPatientIdUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async execute(patientId: string): Promise<GetPrescriptionResponseDto[]> {
    return this.prescriptionRepository.getPrescriptionsByPatientId(patientId);
  }
}
