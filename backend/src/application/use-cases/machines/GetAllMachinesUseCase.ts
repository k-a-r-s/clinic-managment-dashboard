import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';

export class GetAllMachinesUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute() {
    return await this.machineRepository.getAllMachines();
  }
}
