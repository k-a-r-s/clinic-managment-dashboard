"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPatientByIdUseCase = void 0;
class GetPatientByIdUseCase {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async execute(id) {
        const patient = await this.patientRepository.getPatientByid(id);
        return {
            id: patient.getId(),
            firstName: patient.getFirstName(),
            lastName: patient.getLastName(),
            email: patient.getEmail(),
            phoneNumber: patient.getPhoneNumber(),
            birthDate: patient.getBirthDate(),
            gender: patient.getGender(),
            address: patient.getAddress(),
            profession: patient.getProfession(),
            childrenNumber: patient.getChildrenNumber(),
            familySituation: patient.getFamilySituation(),
            insuranceNumber: patient.getInsuranceNumber(),
            emergencyContactName: patient.getEmergencyContactName(),
            emergencyContactPhone: patient.getEmergencyContactPhone(),
            medicalFileId: patient.getMedicalFileId(),
        };
    }
}
exports.GetPatientByIdUseCase = GetPatientByIdUseCase;
