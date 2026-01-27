"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMachine = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
class DeleteMachine {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async execute(id) {
        const existingMachine = await this.machineRepository.getMachineById(id);
        if (!existingMachine) {
            throw new AppError_1.AppError("Machine not found", 404);
        }
        await this.machineRepository.deleteMachine(id);
    }
}
exports.DeleteMachine = DeleteMachine;
