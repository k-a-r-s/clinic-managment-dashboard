"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMachineUseCase = void 0;
const Machine_1 = require("../../../domain/entities/Machine");
const uuid_1 = require("uuid");
class CreateMachineUseCase {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute(data) {
        const id = (0, uuid_1.v4)();
        const machine = new Machine_1.Machine({
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
exports.CreateMachineUseCase = CreateMachineUseCase;
