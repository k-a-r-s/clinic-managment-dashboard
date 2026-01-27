"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMedicalFileUseCase = void 0;
class GetMedicalFileUseCase {
    constructor(medicalFileRepository) {
        this.medicalFileRepository = medicalFileRepository;
    }
    async execute(patientId) {
        const data = await this.medicalFileRepository.getMedicalFileByPatientId(patientId);
        return data;
    }
}
exports.GetMedicalFileUseCase = GetMedicalFileUseCase;
