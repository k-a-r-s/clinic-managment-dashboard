import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import { GetPrescriptionResponseDto } from "../../dto/responses/prescriptions/getPrescription";

export class GetPrescriptionByIdUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async execute(id: string): Promise<GetPrescriptionResponseDto> {
    return this.prescriptionRepository.getPrescriptionById(id);
  }
}
