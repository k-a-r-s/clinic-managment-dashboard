"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePatientUseCase = void 0;
const Patient_1 = require("../../../domain/entities/Patient");
class UpdatePatientUseCase {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async execute(id, updateData) {
        const patient = await this.patientRepository.getPatientByid(id);
        if (!patient) {
            throw new Error("Patient not found");
        }
        const updatedPatient = new Patient_1.Patient({
            id: patient.getId(),
            firstName: updateData.firstName ?? patient.getFirstName(),
            lastName: updateData.lastName ?? patient.getLastName(),
            email: updateData.email ?? patient.getEmail(),
            phoneNumber: updateData.phoneNumber ?? patient.getPhoneNumber(),
            birthDate: updateData.birthDate ?? patient.getBirthDate(),
            gender: updateData.gender ?? patient.getGender(),
            address: updateData.address ?? patient.getAddress(),
            profession: updateData.profession ?? patient.getProfession(),
            childrenNumber: updateData.childrenNumber ?? patient.getChildrenNumber(),
            familySituation: updateData.familySituation ?? patient.getFamilySituation(),
            insuranceNumber: updateData.insuranceNumber ?? patient.getInsuranceNumber(),
            emergencyContactName: updateData.emergencyContactName ?? patient.getEmergencyContactName(),
            emergencyContactPhone: updateData.emergencyContactPhone ?? patient.getEmergencyContactPhone(),
            medicalFileId: updateData.medicalFileId ?? patient.getMedicalFileId(),
        });
        return this.patientRepository.updatePatient(updatedPatient);
    }
}
exports.UpdatePatientUseCase = UpdatePatientUseCase;
