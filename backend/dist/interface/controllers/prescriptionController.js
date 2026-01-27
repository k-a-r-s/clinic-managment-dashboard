"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class PrescriptionController {
    constructor(createPrescriptionUseCase, getPrescriptionsUseCase, getPrescriptionByIdUseCase, getPrescriptionsByPatientIdUseCase, updatePrescriptionUseCase, deletePrescriptionUseCase) {
        this.createPrescriptionUseCase = createPrescriptionUseCase;
        this.getPrescriptionsUseCase = getPrescriptionsUseCase;
        this.getPrescriptionByIdUseCase = getPrescriptionByIdUseCase;
        this.getPrescriptionsByPatientIdUseCase = getPrescriptionsByPatientIdUseCase;
        this.updatePrescriptionUseCase = updatePrescriptionUseCase;
        this.deletePrescriptionUseCase = deletePrescriptionUseCase;
    }
    async createPrescription(req, res) {
        const prescription = await this.createPrescriptionUseCase.execute(req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, prescription, "Prescription created successfully", 201);
    }
    async getPrescriptions(req, res) {
        const prescriptions = await this.getPrescriptionsUseCase.execute();
        return ResponseFormatter_1.ResponseFormatter.success(res, prescriptions, "Prescriptions retrieved successfully");
    }
    async getPrescriptionById(req, res) {
        const prescription = await this.getPrescriptionByIdUseCase.execute(req.params.id);
        return ResponseFormatter_1.ResponseFormatter.success(res, prescription, "Prescription retrieved successfully");
    }
    async getPrescriptionsByPatientId(req, res) {
        const prescriptions = await this.getPrescriptionsByPatientIdUseCase.execute(req.params.patientId);
        return ResponseFormatter_1.ResponseFormatter.success(res, prescriptions, "Patient prescriptions retrieved successfully");
    }
    async updatePrescription(req, res) {
        const prescription = await this.updatePrescriptionUseCase.execute(req.params.id, req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, prescription, "Prescription updated successfully");
    }
    async deletePrescription(req, res) {
        await this.deletePrescriptionUseCase.execute(req.params.id);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Prescription deleted successfully");
    }
}
exports.PrescriptionController = PrescriptionController;
