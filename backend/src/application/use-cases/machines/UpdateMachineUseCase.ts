import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';
import { Machine } from '../../../domain/entities/Machine';

export class UpdateMachineUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(id: string, updateData: any): Promise<Machine> {
    const existing = await this.machineRepository.getMachineById(id);
    if (!existing) {
      throw new Error('Machine not found');
    }

    const updated = new Machine({
      id: existing.getId(),
      machineId: updateData.machineId ?? existing.getMachineId(),
      manufacturer: updateData.manufacturer ?? existing.getManufacturer(),
      model: updateData.model ?? existing.getModel(),
      status: updateData.status ?? existing.getStatus(),
      lastMaintenanceDate: updateData.lastMaintenanceDate ?? existing.getLastMaintenanceDate(),
      nextMaintenanceDate: updateData.nextMaintenanceDate ?? existing.getNextMaintenanceDate(),
      isActive: typeof updateData.isActive === 'boolean' ? updateData.isActive : existing.getIsActive(),
      room: updateData.room ?? existing.getRoom(),
      createdAt: (existing as any).toJson().createdAt,
      updatedAt: (existing as any).toJson().updatedAt,
    });

    return this.machineRepository.updateMachine(updated);
  }
}
