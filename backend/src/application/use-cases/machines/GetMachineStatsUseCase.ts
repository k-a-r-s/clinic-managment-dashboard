import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';

export class GetMachineStatsUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute() {
    return await this.machineRepository.getMachineStats();
  }
}
