"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMedicalFileUseCase = void 0;
class DeleteMedicalFileUseCase {
    constructor(medicalFileRepository) {
        this.medicalFileRepository = medicalFileRepository;
    }
    async execute(id) {
        await this.medicalFileRepository.deleteMedicalFileById(id);
    }
}
exports.DeleteMedicalFileUseCase = DeleteMedicalFileUseCase;
