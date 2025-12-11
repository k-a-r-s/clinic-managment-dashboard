import { MedicalData } from "../../../domain/entities/MedicalFile";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { UpdateMedicalFileDto } from "../../dto/requests/updateMedicalFileDto";


export class UpdateMedicalFileUseCase {
    constructor(private medicalFileRepository: IMedicalFileRepository) { }
    async execure(updateMedicalFileDto: UpdateMedicalFileDto) {
        await this.medicalFileRepository.updateMedicalFile(updateMedicalFileDto.doctorId as string, updateMedicalFileDto.data);
    }
}