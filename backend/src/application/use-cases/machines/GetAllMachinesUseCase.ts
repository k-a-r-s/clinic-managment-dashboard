import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';

export class GetAllMachinesUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(filters?: { status?: string; roomId?: string }) {
    return await this.machineRepository.getAllMachines(filters);
  }
}
