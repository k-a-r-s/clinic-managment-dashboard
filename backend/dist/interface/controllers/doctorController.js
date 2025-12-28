"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class DoctorController {
    constructor(getDoctorsUseCase, deleteDoctorUseCase, getDoctorUseCase, updateDoctorByIdUseCase) {
        this.getDoctorsUseCase = getDoctorsUseCase;
        this.deleteDoctorUseCase = deleteDoctorUseCase;
        this.getDoctorUseCase = getDoctorUseCase;
        this.updateDoctorByIdUseCase = updateDoctorByIdUseCase;
    }
    async getDoctors(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const response = await this.getDoctorsUseCase.execute(page, limit);
        return ResponseFormatter_1.ResponseFormatter.success(res, response, "Doctors retrieved successfully");
    }
    async getDoctorByid(req, res) {
        const id = req.params.id;
        const response = await this.getDoctorUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, response, "Doctor retrieved successfully");
    }
    async deleteDoctorById(req, res) {
        const id = req.params.id;
        await this.deleteDoctorUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Doctor deleted successfully");
    }
    async updateDoctorById(req, res) {
        const id = req.params.id;
        const response = await this.updateDoctorByIdUseCase.execute(id, req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, response, "Doctor updated successfully");
    }
}
exports.DoctorController = DoctorController;
