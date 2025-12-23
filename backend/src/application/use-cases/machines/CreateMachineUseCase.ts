import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';
import { Machine } from '../../../domain/entities/Machine';
import { v4 as uuidv4 } from 'uuid';

export class CreateMachineUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(data: any): Promise<Machine> {
    const id = uuidv4();
    const machine = new Machine({
      id,
      machineId: data.machineId,
      manufacturer: data.manufacturer ?? null,
      model: data.model ?? null,
      status: data.status ?? 'available',
      lastMaintenanceDate: data.lastMaintenanceDate,
      nextMaintenanceDate: data.nextMaintenanceDate,
      
      isActive: data.isActive ?? true,
      roomId: data.roomId ?? null,
    });

    return this.machineRepository.createMachine(machine);
  }
}
