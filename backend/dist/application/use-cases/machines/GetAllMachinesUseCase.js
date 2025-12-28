"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMachinesUseCase = void 0;
class GetAllMachinesUseCase {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute(filters) {
        return await this.machineRepository.getAllMachines(filters);
    }
}
exports.GetAllMachinesUseCase = GetAllMachinesUseCase;
