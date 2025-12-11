import { MedicalData } from "../../../domain/entities/MedicalFile";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { UpdateMedicalFileDto } from "../../dto/requests/updateMedicalFileDto";


export class UpdateMedicalFileUseCase {
    constructor(private medicalFileRepository: IMedicalFileRepository) { }
    async execute(id: string, updateMedicalFileDto: UpdateMedicalFileDto) {
        await this.medicalFileRepository.updateMedicalFile(id, updateMedicalFileDto.doctorId as string, updateMedicalFileDto.data);
    }
}