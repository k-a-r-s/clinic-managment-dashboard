"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMedicalFileUseCase = void 0;
class UpdateMedicalFileUseCase {
    constructor(medicalFileRepository) {
        this.medicalFileRepository = medicalFileRepository;
    }
    async execute(id, updateMedicalFileDto) {
        await this.medicalFileRepository.updateMedicalFile(id, updateMedicalFileDto.doctorId, updateMedicalFileDto.data ?? null);
    }
}
exports.UpdateMedicalFileUseCase = UpdateMedicalFileUseCase;
