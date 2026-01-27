"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPrescriptionByIdUseCase = void 0;
class GetPrescriptionByIdUseCase {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    async execute(id) {
        return this.prescriptionRepository.getPrescriptionById(id);
    }
}
exports.GetPrescriptionByIdUseCase = GetPrescriptionByIdUseCase;
