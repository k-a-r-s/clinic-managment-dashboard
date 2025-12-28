"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPatientUseCase = void 0;
const Patient_1 = require("../../../domain/entities/Patient");
const uuid_1 = require("uuid");
class AddPatientUseCase {
    constructor(patientRepository, createMedicalFileUseCase) {
        this.patientRepository = patientRepository;
        this.createMedicalFileUseCase = createMedicalFileUseCase;
    }
    async execute(patientData) {
        const id = (0, uuid_1.v4)();
        const patient = new Patient_1.Patient({
            id,
            ...patientData,
            medicalFileId: null,
        });
        await this.patientRepository.addPatient(patient);
    }
}
exports.AddPatientUseCase = AddPatientUseCase;
