"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateMachineUseCase = void 0;
class DeactivateMachineUseCase {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute(id) {
        const existing = await this.machineRepository.getMachineById(id);
        if (!existing) {
            throw new Error('Machine not found');
        }
        await this.machineRepository.deactivateMachine(id);
    }
}
exports.DeactivateMachineUseCase = DeactivateMachineUseCase;
