import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";

export class DeletePrescriptionUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async execute(id: string): Promise<void> {
    return this.prescriptionRepository.deletePrescription(id);
  }
}
