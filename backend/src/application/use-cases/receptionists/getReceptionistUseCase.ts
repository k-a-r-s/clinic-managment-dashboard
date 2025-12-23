import { Receptionist } from "../../../domain/entities/Receptionist";
import { IReceptionistRepository } from "../../../domain/repositories/IReceptionistRepository";

export class GetReceptionistUseCase {
  constructor(private receptionistRepository: IReceptionistRepository) {}
  async execute(id: string): Promise<Receptionist | null> {
    return this.receptionistRepository.getReceptionistById(id);
  }
}
