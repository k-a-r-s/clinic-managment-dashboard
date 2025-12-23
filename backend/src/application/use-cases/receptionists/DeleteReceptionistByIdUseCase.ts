import { IReceptionistRepository } from "../../../domain/repositories/IReceptionistRepository";

export class DeleteReceptionistByIdUseCase {
  constructor(private receptionistRepository: IReceptionistRepository) {}
  async execute(id: string) {
    const r = await this.receptionistRepository.getReceptionistById(id);
    if (!r) {
      throw new Error("Receptionist not found");
    }
    await this.receptionistRepository.deleteReceptionistById(id);
  }
}
