import { UUID } from "crypto";
import { MedicalFile } from "../../../domain/entities/MedicalFile";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { CreateMedicalFileDto } from "../../dto/requests/createMedicalFIleDto";


export class createMedicalFileUseCase {
    constructor(private medicalFileRepository: IMedicalFileRepository) { }
    async execute(createMedicalFileDto: CreateMedicalFileDto) {
        const medicalFile = new MedicalFile(createMedicalFileDto.doctorId as UUID, createMedicalFileDto.data);
        await this.medicalFileRepository.createMedicalFile(medicalFile);
    }
}