"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialysisController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class DialysisController {
    constructor(createDialysisPatientUseCase, getAllDialysisPatientsUseCase, updateDialysisPatientUseCase, createProtocolUseCase, getProtocolByPatientIdUseCase, updateProtocolUseCase, createSessionUseCase, getSessionsByPatientIdUseCase, getSessionByIdUseCase, updateSessionUseCase, deleteSessionUseCase) {
        this.createDialysisPatientUseCase = createDialysisPatientUseCase;
        this.getAllDialysisPatientsUseCase = getAllDialysisPatientsUseCase;
        this.updateDialysisPatientUseCase = updateDialysisPatientUseCase;
        this.createProtocolUseCase = createProtocolUseCase;
        this.getProtocolByPatientIdUseCase = getProtocolByPatientIdUseCase;
        this.updateProtocolUseCase = updateProtocolUseCase;
        this.createSessionUseCase = createSessionUseCase;
        this.getSessionsByPatientIdUseCase = getSessionsByPatientIdUseCase;
        this.getSessionByIdUseCase = getSessionByIdUseCase;
        this.updateSessionUseCase = updateSessionUseCase;
        this.deleteSessionUseCase = deleteSessionUseCase;
    }
    // Dialysis Patients
    async createDialysisPatient(req, res) {
        const result = await this.createDialysisPatientUseCase.execute(req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Dialysis patient created successfully", 201);
    }
    async getAllDialysisPatients(req, res) {
        const { status } = req.query;
        const result = await this.getAllDialysisPatientsUseCase.execute({ status });
        return ResponseFormatter_1.ResponseFormatter.success(res, result.map((p) => p.toJson()), "Dialysis patients retrieved successfully");
    }
    async updateDialysisPatient(req, res) {
        const { id } = req.params;
        const result = await this.updateDialysisPatientUseCase.execute(id, req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Dialysis patient updated successfully");
    }
    // Protocols
    async createProtocol(req, res) {
        const result = await this.createProtocolUseCase.execute(req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Protocol created successfully", 201);
    }
    async getProtocolByPatientId(req, res) {
        const { dialysisPatientId } = req.params;
        const result = await this.getProtocolByPatientIdUseCase.execute(dialysisPatientId);
        if (!result) {
            return ResponseFormatter_1.ResponseFormatter.error(res, { type: "NOT_FOUND", message: "Protocol not found for this patient" }, 404, "Protocol not found for this patient");
        }
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Protocol retrieved successfully");
    }
    async updateProtocol(req, res) {
        const { id } = req.params;
        const result = await this.updateProtocolUseCase.execute(id, req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Protocol updated successfully");
    }
    // Sessions
    async createSession(req, res) {
        const result = await this.createSessionUseCase.execute(req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Session created successfully", 201);
    }
    async getSessionsByPatientId(req, res) {
        const { dialysisPatientId } = req.params;
        const result = await this.getSessionsByPatientIdUseCase.execute(dialysisPatientId);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.map((s) => s.toJson()), "Sessions retrieved successfully");
    }
    async getSessionById(req, res) {
        const { id } = req.params;
        const result = await this.getSessionByIdUseCase.execute(id);
        if (!result) {
            return ResponseFormatter_1.ResponseFormatter.error(res, { type: "NOT_FOUND", message: "Session not found" }, 404, "Session not found");
        }
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Session retrieved successfully");
    }
    async updateSession(req, res) {
        const { id } = req.params;
        const result = await this.updateSessionUseCase.execute(id, req.body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result.toJson(), "Session updated successfully");
    }
    async deleteSession(req, res) {
        const { id } = req.params;
        await this.deleteSessionUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Session deleted successfully");
    }
}
exports.DialysisController = DialysisController;
