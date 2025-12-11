import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { GetMedicalFileResponseDto } from "../../dto/responses/medical-file/getMedicalFile";

export class GetMedicalFileUseCase {
    constructor(private medicalFileRepository: IMedicalFileRepository) { }
    async execute(patientId: string) {
        return (await this.medicalFileRepository.getMedicalFileByPatientId(patientId)).toJson() as GetMedicalFileResponseDto;
    }
}