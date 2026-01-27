"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePrescriptionUseCase = void 0;
class DeletePrescriptionUseCase {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    async execute(id) {
        return this.prescriptionRepository.deletePrescription(id);
    }
}
exports.DeletePrescriptionUseCase = DeletePrescriptionUseCase;
