"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPrescriptionsByPatientIdUseCase = void 0;
class GetPrescriptionsByPatientIdUseCase {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    async execute(patientId) {
        return this.prescriptionRepository.getPrescriptionsByPatientId(patientId);
    }
}
exports.GetPrescriptionsByPatientIdUseCase = GetPrescriptionsByPatientIdUseCase;
