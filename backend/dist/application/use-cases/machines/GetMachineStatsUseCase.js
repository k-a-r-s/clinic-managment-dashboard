"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMachineStatsUseCase = void 0;
class GetMachineStatsUseCase {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute() {
        return await this.machineRepository.getMachineStats();
    }
}
exports.GetMachineStatsUseCase = GetMachineStatsUseCase;
