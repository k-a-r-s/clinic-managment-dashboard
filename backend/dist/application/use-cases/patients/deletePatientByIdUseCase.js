"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePatientByIdUseCase = void 0;
class DeletePatientByIdUseCase {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async execute(id) {
        await this.patientRepository.deletePatientByid(id);
    }
}
exports.DeletePatientByIdUseCase = DeletePatientByIdUseCase;
