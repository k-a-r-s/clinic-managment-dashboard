"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalFileController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class MedicalFileController {
    constructor(createMedicalFileUseCase, getMedicalFileUseCase, updateMedicalFileUseCase, deleteMedicalFileUseCase) {
        this.createMedicalFileUseCase = createMedicalFileUseCase;
        this.getMedicalFileUseCase = getMedicalFileUseCase;
        this.updateMedicalFileUseCase = updateMedicalFileUseCase;
        this.deleteMedicalFileUseCase = deleteMedicalFileUseCase;
    }
    async createMedicalFile(req, res) {
        const { body } = req;
        await this.createMedicalFileUseCase.execute(body);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Medical file created successfully", 201);
    }
    async getMedicalFileByPatientId(req, res) {
        const { patientId } = req.params;
        const result = await this.getMedicalFileUseCase.execute(patientId);
        return ResponseFormatter_1.ResponseFormatter.success(res, result, "Medical file retrieved successfully");
    }
    async updateMedicalFile(req, res) {
        const { id } = req.params;
        const { body } = req;
        await this.updateMedicalFileUseCase.execute(id, body);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Medical file updated successfully");
    }
    async deleteMedicalFile(req, res) {
        const { id } = req.params;
        await this.deleteMedicalFileUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Medical file deleted successfully");
    }
}
exports.MedicalFileController = MedicalFileController;
