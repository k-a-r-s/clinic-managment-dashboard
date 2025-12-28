"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicalFileUseCase = void 0;
const MedicalFile_1 = require("../../../domain/entities/MedicalFile");
class createMedicalFileUseCase {
    constructor(medicalFileRepository, updatePatientUseCase, patientRepository) {
        this.medicalFileRepository = medicalFileRepository;
        this.updatePatientUseCase = updatePatientUseCase;
        this.patientRepository = patientRepository;
    }
    async execute(createMedicalFileDto) {
        const patient = await this.patientRepository.getPatientByid(createMedicalFileDto.patientId);
        if (!patient) {
            throw new Error("Patient not found");
        }
        const medicalFile = new MedicalFile_1.MedicalFile(createMedicalFileDto.doctorId, createMedicalFileDto.data ?? {});
        const medicalFileCreated = await this.medicalFileRepository.createMedicalFile(medicalFile);
        await this.updatePatientUseCase.execute(patient.getId(), {
            medicalFileId: medicalFileCreated.id,
        });
        return medicalFileCreated;
    }
}
exports.createMedicalFileUseCase = createMedicalFileUseCase;
