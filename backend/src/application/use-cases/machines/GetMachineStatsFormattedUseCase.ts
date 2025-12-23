import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';

export interface MachineStatsFormatted {
  In_Use: number;
  Available: number;
  Out_of_Service: number;
  Maintenance: number;
  total: number;
}

export class GetMachineStatsFormattedUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(): Promise<MachineStatsFormatted> {
    const stats = await this.machineRepository.getMachineStats();

    return {
      In_Use: stats.inUse,
      Available: stats.available,
      Out_of_Service: stats.outOfService,
      Maintenance: stats.maintenance,
      total: stats.total,
    };
  }
}
