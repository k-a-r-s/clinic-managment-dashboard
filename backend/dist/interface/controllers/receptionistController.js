"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptionistController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class ReceptionistController {
    constructor(getListUseCase, deleteUseCase, getByIdUseCase, updateUseCase) {
        this.getListUseCase = getListUseCase;
        this.deleteUseCase = deleteUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.updateUseCase = updateUseCase;
    }
    async getReceptionists(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const response = await this.getListUseCase.execute(page, limit);
        return ResponseFormatter_1.ResponseFormatter.success(res, response, "Receptionists retrieved successfully");
    }
    async getReceptionistById(req, res) {
        const id = req.params.id;
        const response = await this.getByIdUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, response, "Receptionist retrieved successfully");
    }
    async deleteReceptionistById(req, res) {
        const id = req.params.id;
        await this.deleteUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Receptionist deleted successfully");
    }
    async updateReceptionistById(req, res) {
        const id = req.params.id;
        const response = await this.updateUseCase.execute(id, req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, response, "Receptionist updated successfully");
    }
}
exports.ReceptionistController = ReceptionistController;
