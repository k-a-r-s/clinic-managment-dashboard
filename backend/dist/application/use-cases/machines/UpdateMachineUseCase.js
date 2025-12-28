"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMachineUseCase = void 0;
const Machine_1 = require("../../../domain/entities/Machine");
class UpdateMachineUseCase {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute(id, updateData) {
        const existing = await this.machineRepository.getMachineById(id);
        if (!existing) {
            throw new Error('Machine not found');
        }
        const updated = new Machine_1.Machine({
            id: existing.getId(),
            machineId: updateData.machineId ?? existing.getMachineId(),
            manufacturer: updateData.manufacturer ?? existing.getManufacturer(),
            model: updateData.model ?? existing.getModel(),
            status: updateData.status ?? existing.getStatus(),
            lastMaintenanceDate: updateData.lastMaintenanceDate ?? existing.getLastMaintenanceDate(),
            nextMaintenanceDate: updateData.nextMaintenanceDate ?? existing.getNextMaintenanceDate(),
            isActive: typeof updateData.isActive === 'boolean' ? updateData.isActive : existing.getIsActive(),
            roomId: updateData.roomId ?? existing.getRoomId(),
            createdAt: existing.toJson().createdAt,
            updatedAt: existing.toJson().updatedAt,
        });
        return this.machineRepository.updateMachine(updated);
    }
}
exports.UpdateMachineUseCase = UpdateMachineUseCase;
