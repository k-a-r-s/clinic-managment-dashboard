import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";

export class DeleteMedicalFileUseCase {
    constructor(private medicalFileRepository: IMedicalFileRepository) { }
    async execute(id: string) {
        await this.medicalFileRepository.deleteMedicalFileById(id);
    }
}