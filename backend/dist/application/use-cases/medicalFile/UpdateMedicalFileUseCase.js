"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMedicalFileUseCase = void 0;
class UpdateMedicalFileUseCase {
    constructor(medicalFileRepository) {
        this.medicalFileRepository = medicalFileRepository;
    }
    async execute(id, updateMedicalFileDto) {
        await this.medicalFileRepository.updateMedicalFile(id, updateMedicalFileDto.data ?? null, updateMedicalFileDto.doctorId);
    }
}
exports.UpdateMedicalFileUseCase = UpdateMedicalFileUseCase;
