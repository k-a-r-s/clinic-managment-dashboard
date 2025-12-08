import { Machine } from "../../../domain/entities/Machine";
import { IMachineRepository } from "../../../domain/repositories/IMachineRepository";

export class GetAllMachinesUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(): Promise<Machine[]> {
    return await this.machineRepository.getMachines();
  }
}