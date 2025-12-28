"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class MachineController {
    constructor(createMachineUseCase, getAllMachinesUseCase, getMachineByIdUseCase, updateMachineUseCase, deactivateMachineUseCase, getMachineStatsUseCase, getMachineStatsFormattedUseCase) {
        this.createMachineUseCase = createMachineUseCase;
        this.getAllMachinesUseCase = getAllMachinesUseCase;
        this.getMachineByIdUseCase = getMachineByIdUseCase;
        this.updateMachineUseCase = updateMachineUseCase;
        this.deactivateMachineUseCase = deactivateMachineUseCase;
        this.getMachineStatsUseCase = getMachineStatsUseCase;
        this.getMachineStatsFormattedUseCase = getMachineStatsFormattedUseCase;
    }
    async createMachine(req, res) {
        const { body } = req;
        const result = await this.createMachineUseCase.execute(body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), 'Machine created successfully', 201);
    }
    async getMachines(req, res) {
        const { status, roomId } = req.query;
        const result = await this.getAllMachinesUseCase.execute({ status, roomId });
        return ResponseFormatter_1.ResponseFormatter.success(res, result.map((m) => m.toJson()), 'Machines retrieved successfully');
    }
    async getMachineById(req, res) {
        const { id } = req.params;
        const result = await this.getMachineByIdUseCase.execute(id);
        if (!result) {
            return ResponseFormatter_1.ResponseFormatter.error(res, { type: 'NotFoundError', message: 'Machine not found' }, 404, 'Machine not found');
        }
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), 'Machine retrieved successfully');
    }
    async updateMachine(req, res) {
        const { id } = req.params;
        const { body } = req;
        const result = await this.updateMachineUseCase.execute(id, body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), 'Machine updated successfully');
    }
    async deactivateMachine(req, res) {
        const { id } = req.params;
        await this.deactivateMachineUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, 'Machine deactivated successfully');
    }
    async getStats(req, res) {
        if (!this.getMachineStatsUseCase) {
            return ResponseFormatter_1.ResponseFormatter.error(res, { type: 'InternalServerError', message: 'Machine stats not available' }, 500, 'Machine stats not available');
        }
        const result = await this.getMachineStatsUseCase.execute();
        return ResponseFormatter_1.ResponseFormatter.success(res, result, 'Machine stats retrieved successfully');
    }
    async getFormattedStats(req, res) {
        if (!this.getMachineStatsFormattedUseCase) {
            return ResponseFormatter_1.ResponseFormatter.error(res, { type: 'InternalServerError', message: 'Machine stats not available' }, 500, 'Machine stats not available');
        }
        const result = await this.getMachineStatsFormattedUseCase.execute();
        return ResponseFormatter_1.ResponseFormatter.success(res, result, 'Machine stats retrieved successfully');
    }
}
exports.MachineController = MachineController;
