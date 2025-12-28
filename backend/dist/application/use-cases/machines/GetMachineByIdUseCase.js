"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMachineByIdUseCase = void 0;
class GetMachineByIdUseCase {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute(id) {
        return await this.machineRepository.getMachineById(id);
    }
}
exports.GetMachineByIdUseCase = GetMachineByIdUseCase;
