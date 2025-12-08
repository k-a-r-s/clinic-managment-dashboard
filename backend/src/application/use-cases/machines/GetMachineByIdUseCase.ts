import { Machine } from "../../../domain/entities/Machine";
import { IMachineRepository } from "../../../domain/repositories/IMachineRepository";

export class GetMachineByIdUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(id: string): Promise<Machine | null> {
    return await this.machineRepository.getMachineById(id);
  }
}