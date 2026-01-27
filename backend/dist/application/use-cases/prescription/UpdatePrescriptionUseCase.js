"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrescriptionUseCase = void 0;
class UpdatePrescriptionUseCase {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    async execute(id, data) {
        return this.prescriptionRepository.updatePrescription(id, data);
    }
}
exports.UpdatePrescriptionUseCase = UpdatePrescriptionUseCase;
