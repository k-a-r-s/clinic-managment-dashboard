"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class PatientController {
    constructor(addPatientUseCase, getPatientByIdUseCase, deletePatientByIdUseCase, getAllPatientsUseCase, updatePatientUseCase) {
        this.addPatientUseCase = addPatientUseCase;
        this.getPatientByIdUseCase = getPatientByIdUseCase;
        this.deletePatientByIdUseCase = deletePatientByIdUseCase;
        this.getAllPatientsUseCase = getAllPatientsUseCase;
        this.updatePatientUseCase = updatePatientUseCase;
    }
    async addPatient(req, res) {
        const { body } = req;
        const result = await this.addPatientUseCase.execute({ ...body });
        console.log(result);
        return ResponseFormatter_1.ResponseFormatter.success(res, result, "Patient created successfully", 201);
    }
    async getPatientById(req, res) {
        const { id } = req.params;
        const result = await this.getPatientByIdUseCase.execute(id);
        console.log(result);
        return ResponseFormatter_1.ResponseFormatter.success(res, result, "Patient retrieved successfully");
    }
    async deletePatientById(req, res) {
        const { id } = req.params;
        const result = await this.deletePatientByIdUseCase.execute(id);
        console.log(result);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "Patient deleted successfully");
    }
    async getAllPatients(req, res) {
        const result = await this.getAllPatientsUseCase.execute();
        return ResponseFormatter_1.ResponseFormatter.success(res, result, "Patients retrieved successfully");
    }
    async updatePatient(req, res) {
        const { id } = req.params;
        const { body } = req;
        const result = await this.updatePatientUseCase.execute(id, body);
        return ResponseFormatter_1.ResponseFormatter.success(res, result, "Patient updated successfully");
    }
}
exports.PatientController = PatientController;
