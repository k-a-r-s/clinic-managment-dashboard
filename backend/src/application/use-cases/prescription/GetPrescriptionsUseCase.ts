import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import { GetPrescriptionResponseDto } from "../../dto/responses/prescriptions/getPrescription";

export class GetPrescriptionsUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async execute(): Promise<GetPrescriptionResponseDto[]> {
    return this.prescriptionRepository.getPrescriptions();
  }
}
