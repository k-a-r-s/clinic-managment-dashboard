import { Receptionist } from "../../../domain/entities/Receptionist";
import { ReceptionistRepository } from "../../../infrastructure/repositories/ReceptionistRepository";

export class UpdateReceptionistByIdUseCase {
  constructor(private receptionistRepository: ReceptionistRepository) {}

  async execute(id: string, receptionistData: Partial<Receptionist>) {
    return await this.receptionistRepository.updateReceptionistById(id, receptionistData);
  }
}
