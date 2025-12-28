"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPatientsUseCase = void 0;
class GetAllPatientsUseCase {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async execute() {
        const data = await this.patientRepository.getAllPatients();
        return data.map(patient => ({
            id: patient.getId(),
            firstName: patient.getFirstName(),
            lastName: patient.getLastName(),
            email: patient.getEmail(),
            phoneNumber: patient.getPhoneNumber(),
            age: patient.getAge(),
            gender: patient.getGender(),
        }));
    }
}
exports.GetAllPatientsUseCase = GetAllPatientsUseCase;
