"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPatientByIdUseCase = void 0;
class GetPatientByIdUseCase {
    constructor(patientRepository, medicalFileRepository) {
        this.patientRepository = patientRepository;
        this.medicalFileRepository = medicalFileRepository;
    }
    async execute(id) {
        const patient = await this.patientRepository.getPatientByid(id);
        // Fetch medical file data if patient has a medical file ID
        let medicalFileData = null;
        const medicalFileId = patient.getMedicalFileId();
        if (medicalFileId) {
            try {
                medicalFileData =
                    await this.medicalFileRepository.getMedicalFileByPatientId(id);
            }
            catch (error) {
                console.error("Failed to fetch medical file:", error);
                // Continue without medical file data if fetch fails
            }
        }
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
            medicalFileId: medicalFileId,
            medicalFile: medicalFileData,
        };
    }
}
exports.GetPatientByIdUseCase = GetPatientByIdUseCase;
