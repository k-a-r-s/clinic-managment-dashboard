import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import { UpdatePrescriptionDto } from "../../dto/requests/updatePrescriptionDto";
import { GetPrescriptionResponseDto } from "../../dto/responses/prescriptions/getPrescription";

export class UpdatePrescriptionUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async execute(
    id: string,
    data: UpdatePrescriptionDto
  ): Promise<GetPrescriptionResponseDto> {
    return this.prescriptionRepository.updatePrescription(id, data);
  }
}
