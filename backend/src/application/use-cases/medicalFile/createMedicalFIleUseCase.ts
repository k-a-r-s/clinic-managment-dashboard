import { UUID } from "crypto";
import { MedicalFile } from "../../../domain/entities/MedicalFile";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { CreateMedicalFileDto } from "../../dto/requests/createMedicalFIleDto";
import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";
import { UpdatePatientUseCase } from "../patients/UpdatePatientUseCase";


export class createMedicalFileUseCase {
    constructor(private medicalFileRepository: IMedicalFileRepository, private updatePatientUseCase: UpdatePatientUseCase, private patientRepository: IPatientRepository) { }
    async execute(createMedicalFileDto: CreateMedicalFileDto) {
        const patient = await this.patientRepository.getPatientByid(createMedicalFileDto.patientId);
        if (!patient) {
            throw new Error("Patient not found");
        }
        const doctorId = createMedicalFileDto.doctorId ? (createMedicalFileDto.doctorId as UUID) : null;
        const medicalFile = new MedicalFile(doctorId, createMedicalFileDto.data ?? {});
        const medicalFileCreated = await this.medicalFileRepository.createMedicalFile(medicalFile);
        await this.updatePatientUseCase.execute(patient.getId(), {
            medicalFileId: medicalFileCreated.id,
        });
        return medicalFileCreated;
    }
}