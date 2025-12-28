"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMachineStatsFormattedUseCase = void 0;
class GetMachineStatsFormattedUseCase {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute() {
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
exports.GetMachineStatsFormattedUseCase = GetMachineStatsFormattedUseCase;
